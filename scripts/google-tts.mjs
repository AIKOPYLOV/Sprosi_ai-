import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {createSign} from 'node:crypto';

function arg(name, fallback) {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
}

try {
  const envFile = await fs.readFile('.env', 'utf8');
  for (const line of envFile.split(/\r?\n/)) {
    const match = line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    const rawValue = match[2].trim();
    const quote = rawValue[0];
    const quoted = rawValue.length >= 2 && (quote === '"' || quote === "'") && rawValue.at(-1) === quote;
    process.env[match[1]] = quoted ? rawValue.slice(1, -1) : rawValue;
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const singleText = arg('--text');
const inputPath = arg('--input', 'src/episodes/template.json');
const singleOutput = arg('--out', 'out/voice-smoke.mp3');
let cachedAccessToken;

async function loadServiceAccount() {
  const inlineJson = process.env.GOOGLE_TTS_CREDENTIALS || process.env.SPROSI_AI_OZVUCHKA;
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (inlineJson?.trim().startsWith('{')) return JSON.parse(inlineJson);
  if (credentialsPath) return JSON.parse(await fs.readFile(credentialsPath, 'utf8'));
  if (inlineJson) {
    throw new Error('SPROSI_AI_OZVUCHKA должен содержать JSON-ключ Google Cloud service account. API key для Cloud Text-to-Speech не поддерживается.');
  }
  throw new Error('Не найдены Google Cloud credentials. Локально задай GOOGLE_APPLICATION_CREDENTIALS; в GitHub Actions сохрани JSON service account в SPROSI_AI_OZVUCHKA.');
}

async function getAccessToken() {
  if (cachedAccessToken) return cachedAccessToken;
  const account = await loadServiceAccount();
  if (account.type !== 'service_account' || !account.client_email || !account.private_key) {
    throw new Error('Ожидался JSON service-account key с type, client_email и private_key.');
  }
  const now = Math.floor(Date.now() / 1000);
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
  const unsigned = `${encode({alg:'RS256',typ:'JWT'})}.${encode({iss:account.client_email,scope:'https://www.googleapis.com/auth/cloud-platform',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600})}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  const assertion = `${unsigned}.${signer.sign(account.private_key,'base64url')}`;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion}),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.access_token) throw new Error(`Google OAuth token request failed (HTTP ${response.status}). Check the service-account JSON and project configuration.`);
  cachedAccessToken = result.access_token;
  return cachedAccessToken;
}

async function synthesize(text, voiceName = 'ru-RU-Standard-A', languageCode = 'ru-RU', speakingRate = 0.96, pitch = 0) {
  if (!text?.trim()) throw new Error('Текст реплики пустой.');
  const accessToken = await getAccessToken();
  const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
    method: 'POST',
    headers: {'Content-Type': 'application/json',Authorization:`Bearer ${accessToken}`},
    body: JSON.stringify({input:{text},voice:{languageCode,name:voiceName},audioConfig:{audioEncoding:'MP3',speakingRate,pitch}}),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.audioContent) {
    const message = String(result?.error?.message ?? `HTTP ${response.status}`).replaceAll(accessToken, '[REDACTED]');
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

