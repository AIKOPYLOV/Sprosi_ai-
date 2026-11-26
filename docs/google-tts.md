# Gemini TTS через Gemini API

## Ключ

Для озвучки используется Gemini API key из Google AI Studio. Локально сохрани его как `GEMINI_API_KEY` в `.env`. Для GitHub Actions секрет называется `SPROSI_AI_OZVUCHKA`. Не коммить ключ, не печатай его и не помещай в workflow inputs.

Обычный Google Cloud Text-to-Speech API key и service-account JSON не используются этим скриптом. Запрос идёт к модели `gemini-2.5-flash-preview-tts`; ключ передаётся через заголовок `x-goog-api-key`.

## Проверка в GitHub Actions

1. В `SPROSI_AI_OZVUCHKA` должен быть Gemini API key из AI Studio.
2. Открой **Actions → Gemini TTS smoke test → Run workflow**.
3. После успешного вызова скачай артефакт `google-tts-smoke` и прослушай его.

Ключ может быть валидным, но синтез всё равно не пройдёт без доступных Gemini API credits/billing. Ошибка `402` означает, что кредиты проекта закончились или не настроена предоплата.

## Синтез реплик

Шаблон использует голос `Kore`. На каждую реплику отправляется отдельный запрос, чтобы монтаж и замена дубля не затрагивали весь эпизод. В `voiceName` укажи голос Gemini, а необязательный `delivery` задаёт короткую инструкцию по подаче, например «тихо и с тревогой».

Gemini возвращает PCM-аудио; скрипт добавляет WAV-заголовок, сохраняет `.wav` в `public/audio/<episode-id>/` и прописывает путь в `audioFile` эпизода. Remotion воспроизводит этот файл через `<Audio>`.

## Локальный запуск

```bash
cp .env.example .env
# Добавь GEMINI_API_KEY в .env
npm run tts -- --input src/episodes/episode-001.json
```

Для короткой проверки можно создать один файл:

```bash
GEMINI_API_KEY='...' npm run tts -- --text 'Проверка озвучки.' --out out/voice-smoke.wav
```

Сгенерированные аудиофайлы исключены из Git. Не сохраняй реальный ключ в shell history; предпочтительнее использовать локальный `.env` или менеджер секретов.

