# Спроси AI — 2D-мультфильмы

Рабочая база для разработки коротких 2D-историй и вертикальных роликов для Reels. В репозитории собраны драматургическая схема из материалов проекта, визуальные правила, шаблон раскадровки, Remotion-композиция и озвучка через Gemini TTS.

## Что здесь есть

- `AGENTS.md` — постоянные правила для Codex при разработке эпизодов.
- `docs/story-structure.md` — хук, рост напряжения, конфликт, возвращение, повторный рост и развязка; схема сценария и удержания из PDF.
- `docs/visual-style.md` — художественное направление и правила непрерывности персонажей.
- `docs/production-workflow.md` — процесс от идеи до вертикального MP4.
- `docs/google-tts.md` — настройки Gemini TTS; секрет GitHub Actions ожидается под именем `SPROSI_AI_OZVUCHKA`.
- `src/episodes/template.json` — структурированный шаблон эпизода и планов.
- `src/StoryboardAnimatic.tsx` — черновая вертикальная композиция для проверки ритма и длины сцен до финальной иллюстрации.
- `scripts/validate-episode.mjs` — проверка структуры сценария.
- `scripts/google-tts.mjs` — генерация отдельных WAV-файлов для реплик через Gemini TTS.
- `.github/workflows/google-tts-smoke.yml` — ручная проверка Gemini API key без вывода ключа в логи.

## Быстрый старт

Требуется Node.js 20 или новее.

```bash
npm install
npm run studio
```

Studio откроет черновую раскадровку `StoryboardAnimatic`. Она намеренно не содержит готовых героев или готовой истории: сначала заполняем сценарий и утверждаем дизайн персонажей, затем заменяем карточки планов на художественные сцены.

## Подготовка эпизода

1. Скопируйте `src/episodes/template.json` в новый файл, например `src/episodes/episode-001.json`.
2. Заполните хук, ставки, эскалации, выбор героя, развязку и финальный вопрос.
3. Запустите `npm run validate -- src/episodes/episode-001.json`.
4. Создайте листы персонажей и локаций, затем раскадровку и отдельные планы.
5. Укажите голоса и реплики в `dialogue`; генератор пропишет `audioFile` после синтеза.
6. Зарегистрируйте эпизод как композицию Remotion и откройте Studio для просмотра.
7. После согласования выполните `npm run render -- StoryboardAnimatic out/episode-001.mp4`.

Подробности и критерии качества — в `docs/` и `AGENTS.md`.

## Gemini TTS

Локально скопируйте `.env.example` в `.env` и укажите Gemini API key в `GEMINI_API_KEY`. В GitHub Actions ключ хранится в секрете `SPROSI_AI_OZVUCHKA`.

```bash
npm run tts -- --input src/episodes/episode-001.json
```

Запусти **Actions → Gemini TTS smoke test → Run workflow**. Успешный вызов создаст WAV-артефакт `google-tts-smoke`; workflow не печатает значение секрета.

