import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const file = process.argv[2] ?? 'src/episodes/template.json';
const absolute = path.resolve(file);
const errors = [];
const requiredArc = ['hook', 'rising-action', 'conflict', 'return', 'renewed-rise', 'resolution'];

try {
  const episode = JSON.parse(fs.readFileSync(absolute, 'utf8'));
  if (!episode.id || !episode.title || !episode.logline) errors.push('Заполни id, title и logline.');
  if (episode.aspectRatio !== '9:16') errors.push('Для базового проекта aspectRatio должен быть 9:16.');
  if (!Number.isInteger(episode.fps) || episode.fps < 1) errors.push('fps должен быть целым положительным числом.');
  if (!Array.isArray(episode.beats) || episode.beats.length < requiredArc.length) {
    errors.push('Добавь все шесть драматургических этапов.');
  } else {
    const actualArc = episode.beats.map((beat) => beat.arc);
    if (actualArc[0] !== 'hook') errors.push('Первый этап должен быть hook.');
    for (const arc of requiredArc) if (!actualArc.includes(arc)) errors.push(`В арке отсутствует этап: ${arc}.`);
    for (const [index, beat] of episode.beats.entries()) {
      const prefix = `План ${index + 1}`;
      if (!beat.id || !beat.label || !beat.visual || !beat.action || !beat.camera || !beat.transition) errors.push(`${prefix}: заполни id, label, visual, action, camera и transition.`);
      if (!Number.isFinite(beat.durationSeconds) || beat.durationSeconds <= 0) errors.push(`${prefix}: durationSeconds должен быть больше нуля.`);
      if (!Array.isArray(beat.dialogue) || !Array.isArray(beat.sound)) errors.push(`${prefix}: dialogue и sound должны быть массивами.`);
      for (const line of beat.dialogue ?? []) {
        if (!line.id || !line.characterId || !line.text || !line.voiceName || !line.languageCode) errors.push(`${prefix}: у реплики обязательны id, characterId, text, voiceName и languageCode.`);
        if (/\[[^\]]+\]/.test(line.text ?? '')) errors.push(`${prefix}: замени шаблонный текст реплики «${line.id ?? '?'}».`);
      }
      if (beat.arc === 'conflict' && (!beat.choice?.optionA || !beat.choice?.riskA || !beat.choice?.optionB || !beat.choice?.riskB)) errors.push('В этапе conflict укажи два решения и риск каждого.');
    }
    const actualDuration = episode.beats.reduce((sum, beat) => sum + (Number(beat.durationSeconds) || 0), 0);
    if (Math.abs(actualDuration - episode.totalDurationSeconds) > 0.01) errors.push(`Сумма длительностей планов (${actualDuration}с) не совпадает с totalDurationSeconds (${episode.totalDurationSeconds}с).`);
  }
} catch (error) {
  console.error(`Не удалось прочитать ${absolute}: ${error.message}`);
  process.exit(1);
}

if (errors.length) {
  console.error('Сценарий пока не готов:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Структура эпизода выглядит корректно: ${file}`);

