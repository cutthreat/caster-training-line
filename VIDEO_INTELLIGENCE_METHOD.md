# Video Intelligence Method — Caster Learning System

Версия: `2.0`  
Цель: превращать видео, screen-recording, tutorial или курс в source-linked опыт, который можно воспроизвести, адаптировать и проверить в реальном интерфейсе.

## Главный принцип

Видео нельзя разбирать как transcript summary. Единица анализа — синхронный time-aligned segment:

```text
timecode
→ spoken intent
→ visible UI/frame
→ code/file/action
→ result/state
→ extracted pattern
→ Caster adaptation
→ Anton risk
→ proof required
```

Если у урока нет таймкода и хотя бы одного визуального или экранного evidence ref, это гипотеза, а не подтверждённый урок.

## 1. Governed intake

До извлечения создаётся `manifest`:

```text
corpus_id:
source_url_or_path:
title:
duration:
language:
access_route: public_url | local_export | approved_connector
goal:
output_product:
privacy_constraints:
allowed_actions:
done_when:
proof_requirement:
```

Запрещено использовать cookies, tokens, browser profile internals или private scraping. Для YouTube достаточно public URL + `yt-dlp` metadata/subtitles/media.

## 2. Evidence layers

Каждый источник проходит слоями:

1. `metadata` — title, duration, chapters, description;
2. `transcript` — normalized captions/transcription;
3. `timeline` — timestamped segments;
4. `frames` — interval, scene-change и manual keyframes;
5. `screen_text` — OCR/manual reading for UI/code frames;
6. `code_surface` — visible file, component, prompt or command;
7. `result_state` — what changed in the preview/browser;
8. `knowledge_packet` — transferable lesson;
9. `proof_catalog` — links to all evidence.

Transcript, frame and code refs должны использовать один и тот же timecode namespace.

## 3. Sampling strategy

Не достаточно снять кадр каждые N секунд. Используем три слоя sampling:

- `interval`: один кадр каждые 10–20 секунд для общей карты;
- `chapter`: первый, средний и последний кадр каждого смыслового блока;
- `event`: дополнительный кадр до/во время/после prompt, code edit, preview, error, polish и deploy.

Для motion сохраняем минимум `before → transition → after`. Для UI/code сохраняем `code/prompt → preview → final state`.

## 4. Transcript normalization

Для динамических hero и screen-recordings добавляется [MOTION_INTELLIGENCE_METHOD.md](MOTION_INTELLIGENCE_METHOD.md): motion анализируется как state transition с trigger, moving layers, timing, user meaning и code correlation.

Субтитры очищаются от повторов, тегов и пустых строк, но timestamp сохраняется. Каждому сегменту присваиваются:

```text
segment_id:
start:
end:
speaker_or_role:
topic:
spoken_claim:
action_verbs:
uncertainty:
```

Мы отделяем:

- `instruction` — что нужно сделать;
- `observation` — что автор видит;
- `claim` — что автор утверждает;
- `opinion` — личный вкус;
- `promotion` — рекламный фрагмент;
- `failure` — проблема или неудачная итерация.

Только `instruction`, `observation` и подтверждённые `result_state` могут стать reusable pattern без дополнительной проверки.

## 5. Time-aligned tracker

Главный рабочий артефакт — не свободный конспект, а ledger из [VIDEO_TIMECODE_LEDGER_TEMPLATE.md](VIDEO_TIMECODE_LEDGER_TEMPLATE.md).

Минимальная строка:

```text
segment_id
time_start / time_end
transcript_ref
frame_refs
screen_or_code_ref
spoken_intent
visible_action
result_state
failure_or_tradeoff
reusable_pattern
Caster_adaptation
Anton_risk
proof_required
evidence_level
confidence
```

Главное правило: каждая строка должна отвечать на вопрос «что автор сказал, что одновременно произошло на экране и что именно мы переносим».

## 6. Code/UI correlation

Когда автор пишет код, код не анализируется отдельно. Для каждой code event фиксируем:

1. файл/компонент/слой, если виден;
2. prompt или изменение, если слышно/видно;
3. visual/UI state до изменения;
4. visual/UI state после изменения;
5. дефект, который исправлялся;
6. tradeoff: performance, mobile, accessibility, maintainability;
7. точный reproduction step;
8. proof, который нужен у нас.

Полезная единица обучения:

```text
prompt/code change → observed delta → why it matters → safe adaptation
```

Не переносим code snippets автоматически. Переносим implementation pattern только после проверки на нашем stack и наших constraints.

## 7. Learning packet

Каждый сильный segment превращается в packet:

```text
lesson_title:
source_refs:
problem:
author_move:
visible_proof:
code_or_tool_move:
why_it_worked:
where_it_fails:
accepted_pattern:
clean_room_boundary:
Caster_decision:
Anton_decision:
implementation_contract:
acceptance_criteria:
```

`accepted_pattern` не может быть «сделать как у автора». Он должен быть формулируемым правилом: например, «один motion beat на section, который объясняет переход».

### 7.1 Creative production extraction

Если видео показывает создание рекламного ролика, cinematic сайта, generated assets или агентный creative workflow, извлекаем не только итоговый visual, но и production pipeline:

```text
input_pack:
core_image:
element_board:
scene_or_section_plan:
prompt_or_generation_table:
tool_streams:
human_taste_gate:
assembly_boundary:
output_proof:
```

Полезным считается не кадр сам по себе, а связка `input quality → generation stream → selected output → assembly decision → proof`. Чужие кадры, copy, бренд и rhythm не переносятся.

## 8. Reproduction ladder

Опыт внедряется ступенчато:

1. `observe` — source segment понятен;
2. `extract` — pattern сформулирован;
3. `translate` — есть clean-room implementation contract;
4. `build` — локальный код реализован;
5. `verify` — browser proof подтверждает behavior;
6. `accept` — Caster и Anton закрыли свои gates;
7. `promote` — урок добавлен в method/canon.

Нельзя переходить из `observe` сразу в `accept`.

## 8.1 Model/agent comparison extraction

Если видео сравнивает модели, агентов, генераторы или workflow, итогом должен быть не рейтинг из ролика, а воспроизводимый comparison protocol.

Фиксируем:

```text
compared_systems:
task_type:
same_prompt_or_not:
same_constraints_or_not:
revision_policy:
visible_outputs:
author_verdict:
evidence_for_verdict:
missing_controls:
transferable_protocol:
not_transferable_claims:
```

Переносимый урок возможен только если понятно, что сравнивалось на одинаковом задании и какие criteria использовались. Claims о превосходстве модели не становятся нашим source truth без собственного bake-off.

Для Caster такие видео переводятся в [Model Bake-off Method](MODEL_BAKEOFF_METHOD.md): `same task → raw output → scoring → steering cost → verified adoption`.

## 8.2 Reference-database extraction

Если видео показывает Mobbin, UI databases, design-system references или MCP reference connectors, извлекаем не “какие экраны понравились”, а reference workflow:

```text
reference_source:
access_status:
exact_screen_refs_available:
search_prompt:
observed_patterns:
missing_screens:
standout_components:
clean_room_boundary:
proof_required:
```

Для Caster такие видео переводятся в [Mobbin MCP Reference Method](MOBBIN_MCP_REFERENCE_METHOD.md): `generic detector → reference search → clean-room extraction → missing screens → standout components → proof`.

## 8.3 Copy/prompt/funnel extraction

Если видео или разбор посвящён copywriting prompts, УТП, landing copy, sales funnel, email sequence, VOC, JTBD или ICP, извлекаем не готовый текст, а text-production workflow:

```text
source_type:
copy_job:
audience:
buyer_stage:
prompt_structure:
input_data_required:
fact_sources:
value_prop_formula:
funnel_stage:
CTA_consequence:
proof_or_validation:
not_transferable_claims:
```

Для Caster такие источники переводятся в [Text Prompting and Funnel Method](TEXT_PROMPTING_AND_FUNNEL_METHOD.md): `source pack → VOC/objections → УТП matrix → fact strengthening → funnel scenario → copy blocks → trust gate`.

## 8.4 Assistant-operations extraction

Если видео показывает личного AI-ассистента, Codex workbench, проектную память, task/calendar automation, call-note extraction, Notion/Calendar flow или MCP connectors, извлекаем не “какие сервисы подключили”, а operations contour:

```text
agent_rules:
inbox_rule:
source_types:
task_normalization:
memory_boundary:
connector_boundary:
approval_required_for:
daily_or_recurring_rhythm:
proof_or_receipt:
failure_modes:
```

Для Caster такие источники переводятся в [Assistant Operations Contour Method](ASSISTANT_OPERATIONS_CONTOUR_METHOD.md): `rules → inbox → source intake → normalized tasks → approval gates → rhythm → closeout`.

## 8.5 Authorial-style copy extraction

Если видео показывает NotebookLM, Gemini Gems, style clone, writing agent, “digital copy”, anti-AI-cliche workflow или базу знаний для текстов, извлекаем не готовый промпт, а управляемый контур авторского письма:

```text
anti_stamp_stop_list:
style_corpus:
source_ownership:
fact_source_pack:
knowledge_base_boundary:
agent_instruction:
self_check:
hallucination_risk:
originality_risk:
publication_gate:
```

Для Caster такие источники переводятся в [Authorial Text DNA Method](AUTHORIAL_TEXT_DNA_METHOD.md): `stop-list → style DNA → fact pack → bound agent → anti-stamp lint → style-fit score → fact guard → Anton gate`.

Важно: claims автора о “закрытой архитектуре” или “невозможности фантазировать” не принимаются как proof. Они становятся гипотезой, пока наш fact guard и source refs не подтвердят результат.

## 9. Quality scoring

Каждый learning packet получает оценки `0–3`:

- `transcript_alignment` — слова связаны с визуальным событием;
- `screen_evidence` — есть кадры до/после;
- `code_correlation` — code/tool move связан с UI result;
- `reproducibility` — другой исполнитель повторит шаг;
- `transferability` — pattern переносим на наш продукт;
- `risk_coverage` — отмечены failure/performance/accessibility risks.

Минимум для promotion: `14/18`, без нулей в `screen_evidence`, `reproducibility` и `risk_coverage`.

## 10. Caster/Anton handoff

Caster получает:

- visual pattern;
- composition/typography/motion implication;
- clean-room boundary;
- desktop/mobile adaptation;
- screenshot proof requirement.

Anton получает:

- user task;
- trust/claim implication;
- form/sensitive-input risk;
- CTA consequence;
- recovery and destination receipt requirement.

Сырые transcript/frames не смешиваются с пользовательским UI и не подменяют source/legal/product truth.

## 11. Proof catalog

Итоговый каталог должен связать:

```text
source URL
→ transcript segment
→ frame IDs
→ code/prompt reference
→ local implementation
→ browser proof
→ verdict
```

Для scroll/cinematic сайтов обязательны screen-by-screen captures. Full-page screenshot один не доказывает reveal states.

## 12. Truthful closeout

Допустимые статусы:

- `transcript_only`;
- `timeline_mapped`;
- `pattern_extracted`;
- `pattern_research_ready`;
- `implementation_ready`;
- `locally_verified_not_production`;
- `closed_by_evidence`;
- `blocked_for_proof`.

Нельзя писать `изучено и внедрено`, если есть только transcript или только красивый screenshot.

## 13. Fast operating loop

```text
manifest
→ metadata/chapters
→ normalized transcript
→ interval + event frames
→ time-aligned ledger
→ code/UI correlation
→ learning packets
→ Caster/Anton adaptation
→ local build
→ browser proof
→ method promotion
```

Именно этот loop теперь является стандартом для обучения на видео в Caster.
