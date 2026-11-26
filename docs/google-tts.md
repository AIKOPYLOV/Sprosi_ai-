# Озвучка эпизодов: Gemini TTS и ElevenLabs

## Ключ

Для двух независимых MP4 используются Gemini API key из Google AI Studio и ElevenLabs API key. Локальные переменные — `GEMINI_API_KEY` и `ELEVENLABS_API_KEY`; в GitHub Actions секреты — `SPROSI_AI_OZVUCHKA` и `ELEVEN_LABS9`. Не коммить ключи, не печатай их и не помещай в workflow inputs.

Google Cloud Text-to-Speech API key и service-account JSON не используются. Gemini voice clips генерируются моделью `gemini-2.5-flash-preview-tts`: Aoede для героини, Charon для заказчика. ElevenLabs использует `eleven_multilingual_v2`, голос Aria для героини и Daniel для заказчика; доступ к каталогу голосов не запрашивается.

## Проверка в GitHub Actions

Открой **Actions → Render 2D cartoon voice variants → Run workflow**. GitHub выполнит две независимые задачи и приложит к каждой MP4 отдельный артефакт: `sprosi-ai-google-tts` и `sprosi-ai-elevenlabs`. Значения API ключей не появляются в workflow inputs.

Если Google AI Studio отвечает `402`, задача Gemini не сможет создать свою версию, но ElevenLabs job продолжит сборку независимо. Это ошибка оплаты/кредитов проекта Google, а не ошибка формата ключа. Ранее Gemini API проекта уже вернул `402`, поэтому доступность Google-версии зависит от текущего состояния проекта.

## Синтез реплик

На каждую реплику отправляется отдельный запрос, чтобы замена одной реплики не затрагивала весь эпизод. Полный текст, роль персонажа и подача заданы в `src/episodes/episode-001-voice.json`.

Аудио сохраняется отдельными MP3 в `public/audio/episode-001/google/` и `public/audio/episode-001/elevenlabs/`. Remotion читает нужную папку по выбранной композиции. Оригинальные звуковые эффекты создаются скриптом и добавляются при рендере.

## Локальный запуск

Локально вызови `node scripts/generate-voice-variants.mjs --provider=google` и/или `--provider=elevenlabs` после настройки локальных переменных.

Сгенерированные аудиофайлы исключены из Git. Не сохраняй реальный ключ в shell history; предпочтительнее использовать локальный `.env` или менеджер секретов.

