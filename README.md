# Спроси AI — 2D-мультфильмы

Рабочая база для разработки коротких 2D-историй и вертикальных роликов для Reels. В репозитории собраны драматургическая схема из PDF, визуальные правила, шаблон раскадровки и Remotion-композиция с покадровым движением. Для каждого эпизода можно собрать отдельные видео с Gemini TTS и ElevenLabs.

## Что здесь есть

- `AGENTS.md` — постоянные правила для Codex при разработке эпизодов.
- `docs/story-structure.md` — хук, рост напряжения, конфликт, возвращение, повторный рост и развязка; схема сценария и удержания из PDF.
- `docs/visual-style.md` — художественное направление и правила непрерывности персонажей.
- `docs/production-workflow.md` — процесс от идеи до вертикального MP4.
- `docs/google-tts.md` — настройки обеих систем озвучки и запуск генерации.
- `src/episodes/template.json` — структурированный шаблон эпизода и планов.
- `src/StoryboardAnimatic.tsx` — черновая вертикальная композиция для проверки ритма и длины сцен до финальной иллюстрации.
- `src/Episode001Promo.tsx` — динамичный рисованный ролик 9:16: героиня, жесты, эмоции, реквизит, въезды титров и движения камеры.
- `src/episodes/episode-001-voice.json` — единый сценарий реплик и подачи для обоих вариантов озвучки.
- `src/episodes/episode-001.json` — драматургическая карта истории.
- `public/episodes/episode-001/` — листы персонажа и локации, ключевые кадры, знак Академии и снимок реального экрана курса.
- `scripts/validate-episode.mjs` — проверка структуры сценария.
- `scripts/generate-voice-variants.mjs` — отдельные реплики для Gemini TTS и ElevenLabs; секреты не выводятся в логи.
- `scripts/create-sound-effects.mjs` — оригинальные короткие звуковые эффекты, генерируемые локально.
- `.github/workflows/google-tts-smoke.yml` — ручная проверка Gemini API key без вывода ключа в логи.
- `.github/workflows/render-cartoon.yml` — сборка двух MP4 в GitHub Actions.

## Быстрый старт

Требуется Node.js 20 или новее.

```bash
npm install
npm run studio
```

Studio откроет черновую раскадровку `StoryboardAnimatic`. Она намеренно не содержит готовых героев или готовой истории: сначала заполняем сценарий и утверждаем дизайн персонажей, затем заменяем карточки планов на художественные сцены.

В Studio доступны `SprosiAcademyPromoGoogle` и `SprosiAcademyPromoElevenLabs`. Обе композиции показывают одну 35-секундную историю; генерация аудио нужна перед рендером.

## Подготовка эпизода

1. Скопируйте `src/episodes/template.json` в новый файл, например `src/episodes/episode-001.json`.
2. Заполните хук, ставки, эскалации, выбор героя, развязку и финальный вопрос.
3. Запустите `npm run validate -- src/episodes/episode-001.json`.
4. Создайте листы персонажей и локаций, затем раскадровку и отдельные планы.
5. Укажите голоса и реплики в `dialogue`; генератор пропишет `audioFile` после синтеза.
6. Зарегистрируйте эпизод как композицию Remotion и откройте Studio для просмотра.
7. После согласования выполните `npm run render -- StoryboardAnimatic out/episode-001.mp4`.

Подробности и критерии качества — в `docs/` и `AGENTS.md`.

## Два варианта озвучки

Для локальной сборки добавьте в `.env` переменные `GEMINI_API_KEY` и `ELEVENLABS_API_KEY`. В GitHub Secrets должны быть `SPROSI_AI_OZVUCHKA` (Gemini API key) и `ELEVEN_LABS9` (ElevenLabs API key). Значения ключей не сохраняются в файлах или логах.

```bash
node scripts/generate-voice-variants.mjs --provider=google
node scripts/generate-voice-variants.mjs --provider=elevenlabs
node scripts/create-sound-effects.mjs
npx remotion render src/index.tsx SprosiAcademyPromoGoogle out/sprosi-ai-google-tts.mp4
npx remotion render src/index.tsx SprosiAcademyPromoElevenLabs out/sprosi-ai-elevenlabs.mp4
```

Для ElevenLabs выбрал Aria для героини и Daniel для заказчика; `eleven_multilingual_v2` поддерживает русский, поэтому генератору не нужно отдельное разрешение `voices_read`. В Gemini выбраны выразительный голос Aoede для героини и низкий Charon для заказчика.

Чтобы получить оба MP4, открой **Actions → Render 2D cartoon voice variants → Run workflow**. Gemini и ElevenLabs собираются в независимых заданиях: если один API временно откажет, результат другого всё равно останется доступен. Готовое видео появится в артефакте соответствующего задания.

