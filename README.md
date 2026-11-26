# Спроси AI — 2D-мультфильмы

Рабочая база для разработки коротких 2D-историй и вертикальных роликов для Reels. В репозитории собраны драматургическая схема из материалов проекта, визуальные правила, шаблон раскадровки, Remotion-композиция и озвучка через Google Cloud Text-to-Speech.

## Что здесь есть

- `AGENTS.md` — постоянные правила для Codex при разработке эпизодов.
- `docs/story-structure.md` — хук, рост напряжения, конфликт, возвращение, повторный рост и развязка; схема сценария и удержания из PDF.
- `docs/visual-style.md` — художественное направление и правила непрерывности персонажей.
- `docs/production-workflow.md` — процесс от идеи до вертикального MP4.
- `docs/google-tts.md` — настройки Google TTS; секрет GitHub Actions ожидается под именем `SPROSI_AI_OZVUCHKA`.
- `src/episodes/template.json` — структурированный шаблон эпизода и планов.
- `src/StoryboardAnimatic.tsx` — черновая вертикальная композиция для проверки ритма и длины сцен до финальной иллюстрации.
- `scripts/validate-episode.mjs` — проверка структуры сценария.
- `scripts/google-tts.mjs` — генерация отдельных MP3-файлов для реплик.
- `.github/workflows/google-tts-smoke.yml` — ручная проверка секрета через короткий вызов Google TTS без вывода ключа в логи.

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

## Google TTS

Локально скопируйте `.env.example` в `.env` и укажите путь к JSON service-account key в `GOOGLE_APPLICATION_CREDENTIALS`. Для разового smoke test GitHub secret `SPROSI_AI_OZVUCHKA` может содержать OAuth2 access token. Обычный API key Google Cloud Text-to-Speech не принимает.

```bash
npm run tts -- --input src/episodes/episode-001.json
```

В GitHub Actions секрет уже добавлен под именем `SPROSI_AI_OZVUCHKA`. Сейчас проверка показала, что в нём пока не service-account JSON. После замены содержимого на JSON-ключ запусти **Actions → Google TTS smoke test → Run workflow**. Успешный вызов создаст MP3-артефакт `google-tts-smoke`; workflow не печатает значение секрета.

