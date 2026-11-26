import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {spawnSync} from 'node:child_process';

try {
  const envFile = await fs.readFile('.env', 'utf8');
  for (const line of envFile.split(/\r?\n/)) {
    const match = line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    const value = match[2].trim();
    const quote = value[0];
    const quoted = value.length >= 2 && (quote === '"' || quote === "'") && value.at(-1) === quote;
    process.env[match[1]] = quoted ? value.slice(1, -1) : value;
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const provider = process.argv.find((arg) => arg.startsWith('--provider='))?.split('=')[1] ?? 'both';
if (!['both', 'google', 'elevenlabs'].includes(provider)) throw new Error('Provider must be both, google, or elevenlabs.');
const scriptPath = process.argv.slice(2).find((arg) => !arg.startsWith('--')) ?? 'src/episodes/episode-001-voice.json';
const script = JSON.parse(await fs.readFile(scriptPath, 'utf8'));
const googleKey = process.env.SPROSI_AI_OZVUCHKA || process.env.GEMINI_API_KEY;
const elevenKey = process.env.ELEVEN_LABS9 || process.env.ELEVENLABS_API_KEY;
const googleModel = process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts';
const root = path.join('public', 'audio', script.episodeId);

if (['both', 'google'].includes(provider) && !googleKey) throw new Error('GitHub secret SPROSI_AI_OZVUCHKA (Gemini API key) is missing.');
if (['both', 'elevenlabs'].includes(provider) && !elevenKey) throw new Error('GitHub secret ELEVEN_LABS9 (ElevenLabs API key) is missing.');

const fallbackVoices = {
  hero: {voice_id: '9BWtsMINqrJLrRacOk9x', name: 'Aria', labels: {gender: 'female'}},
  client: {voice_id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', labels: {gender: 'male'}},
};

function audioPart(result) {
  const parts = result?.candidates?.[0]?.content?.parts ?? [];
  const audio = parts.find((part) => part.inlineData?.data || part.inline_data?.data);
  const data = audio?.inlineData ?? audio?.inline_data;
  if (!data?.data) throw new Error('Gemini TTS returned no audio.');
  const mime = data.mimeType ?? data.mime_type ?? 'audio/pcm;rate=24000';
  const bytes = Buffer.from(data.data, 'base64');
  if (/pcm|L16/i.test(mime)) {
    const rate = Number(mime.match(/rate=(\d+)/)?.[1] ?? 24000);
    const wav = Buffer.alloc(44);
    wav.write('RIFF', 0); wav.writeUInt32LE(36 + bytes.length, 4); wav.write('WAVE', 8);
    wav.write('fmt ', 12); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
    wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 2, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
    wav.write('data', 36); wav.writeUInt32LE(bytes.length, 40);
    return Buffer.concat([wav, bytes]);
  }
  if (/wav|wave/i.test(mime)) return bytes;
  throw new Error(`Unsupported Gemini TTS format: ${mime}`);
}

function toMp3(bytes, inputFormat) {
  const result = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-f', inputFormat, '-i', 'pipe:0', '-codec:a', 'libmp3lame', '-q:a', '3', '-f', 'mp3', 'pipe:1'], {input: bytes, maxBuffer: 16 * 1024 * 1024});
  if (result.status !== 0) throw new Error(`ffmpeg audio conversion failed: ${result.stderr.toString().trim()}`);
  return result.stdout;
}

async function googleTts(line) {
  const voiceName = line.voice === 'client' ? 'Charon' : 'Aoede';
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(googleModel)}:generateContent`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'x-goog-api-key': googleKey},
    body: JSON.stringify({contents: [{parts: [{text: `${line.delivery}\n${line.text}`}]}], generationConfig: {responseModalities: ['AUDIO'], speechConfig: {voiceConfig: {prebuiltVoiceConfig: {voiceName}}}}}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Google Gemini TTS failed (${response.status}): ${data?.error?.message ?? 'API error'}`);
  return toMp3(audioPart(data), 'wav');
}

async function elevenTts(line, voice) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice.voice_id)}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: {'xi-api-key': elevenKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg'},
    body: JSON.stringify({
      text: line.text,
      model_id: 'eleven_multilingual_v2',
      language_code: 'ru',
      voice_settings: {stability: 0.42, similarity_boost: 0.78, style: 0.3, use_speaker_boost: true},
    }),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`ElevenLabs TTS failed (${response.status}): ${message.slice(0, 500)}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

const voices = fallbackVoices;
if (provider !== 'google') console.log(`ElevenLabs voices selected: hero=${voices.hero.name}; client=${voices.client.name}`);

for (const line of script.lines) {
  const outputs = [];
  if (['both', 'google'].includes(provider)) outputs.push(['google', await googleTts(line)]);
  if (['both', 'elevenlabs'].includes(provider)) {
    const voice = line.voice === 'client' ? voices.client : voices.hero;
    outputs.push(['elevenlabs', await elevenTts(line, voice)]);
  }
  for (const [variant, buffer] of outputs) {
    const output = path.join(root, variant, `${line.id}.mp3`);
    await fs.mkdir(path.dirname(output), {recursive: true});
    await fs.writeFile(output, buffer);
  }
  console.log(`Generated paired voice line: ${line.id}`);
}
console.log(`Generated ${script.lines.length} lines for ${provider} voice variant(s).`);
