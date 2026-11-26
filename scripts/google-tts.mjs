import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

function arg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
}

try {
  const envFile = await fs.readFile('.env', 'utf8');
  for (const line of envFile.split(/\r?\n/)) {
    const match = line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    const value = match[2].trim();
    const quote = value[0];
    const isQuoted = value.length >= 2 && (quote === '"' || quote === "'") && value.at(-1) === quote;
    process.env[match[1]] = isQuoted ? value.slice(1, -1) : value;
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const apiKey = process.env.GEMINI_API_KEY || process.env.SPROSI_AI_OZVUCHKA;
const model = process.env.GEMINI_TTS_MODEL || 'gemini-2.5-flash-preview-tts';
const singleText = arg('--text');
const inputPath = arg('--input', 'src/episodes/template.json');
const singleOutput = arg('--out', 'out/voice-smoke.wav');

if (!apiKey) {
  console.error('Не найден Gemini API key. Локально задай GEMINI_API_KEY; в GitHub Actions используй secret SPROSI_AI_OZVUCHKA.');
  process.exit(1);
}

function pcmToWav(pcm, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const header = Buffer.alloc(44);
  const byteRate = sampleRate * channels * bitsPerSample / 8;
  const blockAlign = channels * bitsPerSample / 8;
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

function audioFromResponse(result) {
  const parts = result?.candidates?.[0]?.content?.parts ?? [];
  const part = parts.find((item) => item.inlineData?.data || item.inline_data?.data);
  const data = part?.inlineData ?? part?.inline_data;
  if (!data?.data) throw new Error('Gemini TTS не вернул аудио.');
  const mimeType = data.mimeType ?? data.mime_type ?? 'audio/pcm;rate=24000';
  const bytes = Buffer.from(data.data, 'base64');
  if (mimeType.includes('pcm') || mimeType.includes('L16')) {
    const rate = Number(mimeType.match(/rate=(\d+)/)?.[1] ?? 24000);
    return {bytes: pcmToWav(bytes, rate), extension: 'wav'};
  }
  if (mimeType.includes('wav') || mimeType.includes('wave')) return {bytes, extension: 'wav'};
  if (mimeType.includes('mpeg') || mimeType.includes('mp3')) return {bytes, extension: 'mp3'};
  throw new Error(`Неизвестный формат аудио от Gemini: ${mimeType}`);
}

async function synthesize(text, voiceName = 'Kore', delivery = '') {
  if (!text?.trim()) throw new Error('Текст реплики пустой.');
  const prompt = delivery ? `${delivery}\n${text}` : text;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'x-goog-api-key': apiKey},
    body: JSON.stringify({
      contents: [{parts: [{text: prompt}]}],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {voiceConfig: {prebuiltVoiceConfig: {voiceName}}},
      },
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Gemini TTS вернул HTTP ${response.status}: ${result?.error?.message ?? 'ошибка API'}`);
  }
  return audioFromResponse(result);
}

async function writeAudio(basePath, audio) {
  const outputPath = basePath.replace(/\.(wav|mp3|pcm)$/i, '') + `.${audio.extension}`;
  await fs.mkdir(path.dirname(path.resolve(outputPath)), {recursive: true});
  await fs.writeFile(outputPath, audio.bytes);
  return outputPath;
}

try {
  if (singleText) {
    const audio = await synthesize(singleText);
    const outputPath = await writeAudio(singleOutput, audio);
    console.log(`Озвучка создана: ${outputPath}`);
  } else {
    const episode = JSON.parse(await fs.readFile(inputPath, 'utf8'));
    const lines = (episode.beats ?? []).flatMap((beat) => beat.dialogue ?? []);
    if (lines.length === 0) throw new Error('В эпизоде нет реплик в beats[].dialogue[].');
    const base = path.join('public', 'audio', episode.id);
    await fs.mkdir(base, {recursive: true});
    for (const line of lines) {
      if (/\[[^\]]+\]/.test(line.text)) throw new Error(`Сначала замени шаблонную реплику: ${line.id}`);
      const audio = await synthesize(line.text, line.voiceName, line.delivery ?? '');
      const outputPath = await writeAudio(path.join(base, line.id), audio);
      line.audioFile = path.relative('public', outputPath).split(path.sep).join('/');
      console.log(`Создана реплика ${line.id}`);
    }
    await fs.writeFile(inputPath, `${JSON.stringify(episode, null, 2)}\n`);
    console.log(`Готово: ${lines.length} реплик; episode JSON обновлён путями к аудио.`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

