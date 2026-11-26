import fs from 'node:fs/promises';
import path from 'node:path';

const outputDir = path.join('public', 'audio', 'episode-001', 'sfx');
const sampleRate = 44100;

function wav(samples) {
  const pcm = Buffer.alloc(samples.length * 2);
  samples.forEach((sample, index) => pcm.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(sample * 32767))), index * 2));
  const header = Buffer.alloc(44);
  header.write('RIFF', 0); header.writeUInt32LE(36 + pcm.length, 4); header.write('WAVE', 8);
  header.write('fmt ', 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24); header.writeUInt32LE(sampleRate * 2, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34);
  header.write('data', 36); header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

function render(seconds, synth) {
  return wav(Array.from({length: Math.ceil(sampleRate * seconds)}, (_, i) => synth(i / sampleRate, i / (sampleRate * seconds))));
}

const effects = {
  'notification.wav': render(0.34, (t) => 0.22 * Math.exp(-t * 9) * (Math.sin(2 * Math.PI * 880 * t) + 0.45 * Math.sin(2 * Math.PI * 1320 * t))),
  'impact.wav': render(0.42, (t) => 0.2 * Math.exp(-t * 9) * Math.sin(2 * Math.PI * (95 - 52 * t) * t)),
  'whoosh.wav': render(0.44, (t, p) => {
    const noise = Math.sin(2 * Math.PI * 1733 * t) * Math.sin(2 * Math.PI * 47 * t) + Math.sin(2 * Math.PI * 3119 * t) * 0.4;
    return 0.07 * Math.sin(Math.PI * p) ** 2 * noise;
  }),
  'tick.wav': render(0.085, (t) => 0.14 * Math.exp(-t * 65) * Math.sin(2 * Math.PI * 1450 * t)),
  'resolution.wav': render(1.2, (t) => {
    const notes = [[523.25, 0], [659.25, 0.18], [783.99, 0.36], [1046.5, 0.58]];
    return notes.reduce((sum, [frequency, start]) => sum + (t >= start ? 0.085 * Math.exp(-(t - start) * 2.8) * Math.sin(2 * Math.PI * frequency * (t - start)) : 0), 0);
  }),
};

await fs.mkdir(outputDir, {recursive: true});
await Promise.all(Object.entries(effects).map(([name, samples]) => fs.writeFile(path.join(outputDir, name), samples)));
console.log(`Created ${Object.keys(effects).length} original sound effects.`);
