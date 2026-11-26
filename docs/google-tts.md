# Google Cloud Text-to-Speech

## Секрет и безопасность

В GitHub Actions секрет ожидается под точным именем `SPROSI_AI_OZVUCHKA` и должен содержать JSON-ключ Google Cloud service account. Проверочный запуск показал, что Cloud Text-to-Speech отклоняет API-key authentication и ожидает OAuth2. Скрипт подписывает JWT service account, получает краткоживущий OAuth access token и передаёт его Google API. Сам ключ и токен не выводятся.

Локально укажи путь к JSON-файлу в `GOOGLE_APPLICATION_CREDENTIALS`. Этот файл не добавляй в Git. Service account должен иметь доступ к проекту Google Cloud, включённый Cloud Text-to-Speech API и право на синтез речи; настройки проекта и биллинг должны быть активны.

## Проверка ключа в Actions

1. Убедись, что `SPROSI_AI_OZVUCHKA` содержит JSON с `type`, `client_email` и `private_key` от Google Cloud service account.
2. Открой вкладку **Actions** и выбери **Google TTS smoke test**.
3. Нажми **Run workflow** и оставь короткую фразу на русском.
4. Успешный job и артефакт `google-tts-smoke` означают, что авторизация и вызов TTS прошли.
5. Если шаг упал, проверь service-account JSON, доступ к проекту, включённый API, роль service account и billing. Не добавляй ключ в workflow-файл или команду.

Тест вручную запускается в GitHub; при каждом push API не вызывается. Это ограничивает случайные вызовы и расходы.

## Голоса

Шаблон использует имя `ru-RU-Standard-A` с языком `ru-RU` и умеренным темпом. Перед записью выбери голос для каждого персонажа, прослушай пробу и сохрани голос во всех репликах персонажа. Если меняется голос/семейство модели, проверь его в Google Cloud Text-to-Speech voices list.

Параметры реплики: `voiceName`, `languageCode`, `speakingRate` и `pitch`. Делай отдельный аудиофайл на каждую реплику, чтобы можно было менять монтаж без повторной генерации всего эпизода. Для протяжённых пауз и сложной интонации редактируй аудио/тайминг после синтеза; не рассчитывай, что TTS сам сыграет эмоциональный подтекст.

## Локальный вызов

```bash
cp .env.example .env
# Укажи GOOGLE_APPLICATION_CREDENTIALS=/путь/к/service-account.json в .env
npm run tts -- --input src/episodes/episode-001.json
```

Сгенерированные MP3 сохраняются в `public/audio/<episode-id>/` и исключены из Git.

