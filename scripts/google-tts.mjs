import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

function arg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
}

const apiKey = process.env.GOOGLE_TTS_API_KEY || process.env.SPROSI_AI_OZVUCHKA;
if (!apiKey) {
  console.error('Не найден Google TTS key. Локально задай GOOGLE_TTS_API_KEY; в GitHub Actions используй secret SPROSI_AI_OZVUCHKA.');
  process.exit(1);
}

const singleText = arg('--text');
const inputPath = arg('--input', 'src/episodes/template.json');
const singleOutput = arg('--out', 'out/voice-smoke.mp3');

async function synthesize(text, voiceName = 'ru-RU-Standard-A', languageCode = 'ru-RU', speakingRate = 0.96, pitch = 0) {
  if (!text?.trim()) throw new Error('Текст реплики пустой.');
  const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({input:{text},voice:{languageCode,name:voiceName},audioConfig:{audioEncoding:'MP3',speakingRate,pitch}}),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.audioContent) {
    const message = String(result?.error?.message ?? `HTTP ${response.status}`).replaceAll(apiKey, '[REDACTED]');
    throw new Error(`Google TTS вернул ошибку: ${message}`);
  }
  return Buffer.from(result.audioContent, 'base64');
}

try {
  if (singleText) {
    const audio = await synthesize(singleText);
    await fs.mkdir(path.dirname(path.resolve(singleOutput)), {recursive:true});
    await fs.writeFile(singleOutput, audio);
    console.log(`Озвучка создана: ${singleOutput}`);
  } else {
    const episode = JSON.parse(await fs.readFile(inputPath, 'utf8'));
    const lines = (episode.beats ?? []).flatMap((beat) => beat.dialogue ?? []);
    if (lines.length === 0) throw new Error('В эпизоде нет реплик в beats[].dialogue[].');
    const base = path.join('public', 'audio', episode.id);
    await fs.mkdir(base, {recursive:true});
    for (const line of lines) {
      if (/\[[^\]]+\]/.test(line.text)) throw new Error(`Сначала замени шаблонную реплику: ${line.id}`);
      const audio = await synthesize(line.text, line.voiceName, line.languageCode, line.speakingRate ?? 0.96, line.pitch ?? 0);
      const filename = `${line.id}.mp3`;
      await fs.writeFile(path.join(base, filename), audio);
      line.audioFile = `audio/${episode.id}/${filename}`;
      console.log(`Создана реплика ${line.id}`);
    }
    await fs.writeFile(inputPath, `${JSON.stringify(episode, null, 2)}\n`);
    console.log(`Готово: ${lines.length} реплик; episode JSON обновлён путями к аудио.`);
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

