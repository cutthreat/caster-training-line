# Video Review — BydFvfT3IjM

Статус: `pattern_extracted`  
Источник: `https://www.youtube.com/watch?v=BydFvfT3IjM`  
Title: `Как создать ИИ-агента в Gemini Gems + NotebookLM для текстов без машинного штампа`  
Channel: `Бизнес & AI`  
Duration: `2:03`  
Upload date: `2026-05-20`

## Evidence

Локально собраны:

- metadata: `video-intel/yt-BydFvfT3IjM/sources/metadata.json`;
- transcript: `video-intel/yt-BydFvfT3IjM/transcripts/transcript.ru.vtt`;
- media: `video-intel/yt-BydFvfT3IjM/media/source.webm`;
- frames/contact sheet: `video-intel/yt-BydFvfT3IjM/frames/contact-sheet.jpg`;
- keyframes:
  - `frame-00-00-03.jpg` — intro/problem;
  - `frame-00-00-21.jpg` — step 1, stop-list;
  - `frame-00-00-37.jpg` — step 2, text DNA;
  - `frame-00-00-54.jpg` — step 3, NotebookLM;
  - `frame-00-01-37.jpg` — step 4, clone/Gem;
  - `frame-00-01-58.jpg` — Gemini/NotebookLM UI.

## Timeline extraction

| Timecode | Spoken / visible move | Transferable pattern | Caster decision |
|---|---|---|---|
| 00:00 | Автор формулирует проблему: тексты после нейросетей требуют ручной правки, нужен материал без машинного штампа. | Генерация текста должна иметь анти-штамп контур, а не один промпт. | Принято. Добавить отдельный anti-stamp lint. |
| 00:21 | Step 1: “программируем запреты”; список любимых AI-слов, фраз, знаков препинания. | Stop-list должен быть явным источником правил для агента. | Принято и усилено replacement principles. |
| 00:37 | Step 2: “вшиваем ДНК”; текстовый файл со стилем, жаргоном, матрицей авторского письма. | Style corpus нужен до генерации. | Принято с clean-room boundary и правами источников. |
| 00:54 | Step 3: NotebookLM, загрузка файлов, изолированная база знаний. Автор утверждает, что правила “цементируются”. | Source-bound knowledge base уменьшает дрейф. | Принято частично: не считаем это защитой от галлюцинаций без fact guard. |
| 01:37 | Step 4: создание Gemini Gem / автономного бота с инструкцией работать строго по базе. | Оболочка агента полезна как повторяемый production route. | Принято как optional implementation, не как единственный инструмент. |

## Что внедряем

1. `Anti-stamp stop-list` — запрещённые AI-слова, фразы, CTA, пунктуация, пустые усилители.
2. `Authorial DNA corpus` — карта авторского ритма, лексики, аргументации, proof style и CTA style.
3. `Bound drafting agent` — агент работает по corpus, stop-list и source pack.
4. `Self-check output` — агент обязан показать claims, источники, запреты и риски.
5. `Style-fit score` — численная проверка, что текст действительно в нужном голосе.

## Что усиливаем

Исходный подход полезен, но его нельзя переносить как “магическую закрытую архитектуру”. В Caster добавлены обязательные защитные слои:

- стиль отделён от фактов;
- публичные референсы помечаются как `inspiration_only`;
- claims проходят fact source pack;
- anti-stamp lint проверяет не только слова, но и ритм, CTA и пустые promises;
- Anton блокирует текст, если сильный стиль маскирует недоказанное обещание;
- publication status возможен только после `style_fit_pass` + `fact_guard_pass`.

## Что не переносим

- Не копируем чужие тексты, ритм, структуру, брендовые формулы.
- Не считаем NotebookLM/Gemini/Gems гарантией отсутствия ошибок.
- Не публикуем текст без proof refs, CTA consequence и receipt/recovery.
- Не используем “цифровой клон” как пользовательское обещание, если продукт этого реально не делает.

## Promotion result

Метод вынесен в [AUTHORIAL_TEXT_DNA_METHOD.md](../../../AUTHORIAL_TEXT_DNA_METHOD.md) и подключён к:

- [TEXT_PROMPTING_AND_FUNNEL_METHOD.md](../../../TEXT_PROMPTING_AND_FUNNEL_METHOD.md);
- [VIDEO_INTELLIGENCE_METHOD.md](../../../VIDEO_INTELLIGENCE_METHOD.md);
- [CASTER_METHOD_SITE_AND_INTERFACE.md](../../../CASTER_METHOD_SITE_AND_INTERFACE.md).
