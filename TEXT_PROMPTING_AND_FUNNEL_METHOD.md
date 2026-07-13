# Text Prompting and Funnel Method — Caster Copy System

Версия: `1.0`
Контур: Caster visual/product method + Anton trust gate + source-linked copy research

## Зачем это нужно

Хороший сайт ломается, если текст generic: громкие обещания без фактов, слабое УТП, CTA без последствия, benefits вместо конкретной ценности, сценарий воронки без состояния пользователя.

Этот метод добавляет в Caster отдельный слой для формирования текстов, УТП, описаний, усиления фактов и сценариев воронок продаж.

## Базовый протокол

```text
source truth
→ audience and situation
→ VOC / objections / proof inventory
→ authorial DNA / anti-stamp rules
→ value proposition candidates
→ fact-strengthening pass
→ page/funnel scenario
→ copy blocks
→ Anton trust gate
→ browser/user-path proof
→ learning closeout
```

## 1. Copy source pack

Перед генерацией текста фиксируем:

```text
product:
audience:
current_alternative:
buyer_stage:
primary_pain:
desired_outcome:
proof_inventory:
constraints:
forbidden_claims:
tone:
conversion_action:
destination_receipt:
```

Если нет `proof_inventory`, текст может быть только `draft_claims`, не production copy.

## 2. УТП matrix

УТП не пишется одной попыткой. Сначала генерируем варианты по нескольким углам:

```text
audience-specific:
outcome-led:
only/we_are_the_only:
before_after:
risk_reduction:
speed_or_cost:
trust_or_control:
```

Каждый вариант проверяется:

- кто это читает;
- что обещано;
- чем доказано;
- почему сейчас;
- чем отличается от альтернативы;
- что пользователь делает дальше.

## 3. Fact-strengthening pass

Каждый сильный claim проходит усиление факта:

```text
claim:
source:
evidence_type: owner | analytics | customer_quote | benchmark | demo | inference
number_or_specific_detail:
scope:
condition:
what_we_cannot_claim:
safe_version:
proof_required:
```

Правило: если claim нельзя доказать, он смягчается или удаляется. Конкретика лучше громкости.

## 4. Voice of Customer pass

Когда есть отзывы, интервью, чаты, заявки, комментарии или sales notes, сначала извлекаем язык клиента:

```text
raw_phrase:
speaker_type:
pain:
desired_outcome:
objection:
trigger:
words_to_reuse:
words_to_avoid:
copy_use:
```

AI не должен “улучшать” VOC до потери смысла. Сначала сохраняем формулировки клиента, потом адаптируем.

## 4.1 Authorial Text DNA pass

Если нужен живой авторский голос, тексты проходят [Authorial Text DNA Method](AUTHORIAL_TEXT_DNA_METHOD.md):

```text
anti-stamp stop-list
→ authorial DNA corpus
→ fact source pack
→ bound drafting agent
→ anti-stamp lint
→ style-fit score
→ fact guard
```

Что это добавляет:

- явный список запрещённых AI-штампов, пустых усилителей и generic CTA;
- карту авторского ритма, лексики, proof style, objection style и CTA style;
- clean-room boundary для публичных референсов;
- разделение `style_sources` и `fact_sources`;
- self-check агента: claims, источники, нарушения запретов, риски;
- статус `production_copy_ready` только после `style_fit_pass` и `fact_guard_pass`.

Правило: авторский тон не имеет права усиливать недоказанный claim. Если факт не закрыт proof, текст остаётся `source_bound_draft`.

## 5. Funnel scenario map

Воронка — это не список блоков, а смена состояния пользователя:

```text
stage:
user_state:
question_in_head:
objection:
needed_fact:
copy_job:
asset_or_screen:
CTA:
next_state:
failure_recovery:
proof_required:
```

Минимальные стадии:

- attention: почему остановиться;
- relevance: это про меня или нет;
- value: что я получу;
- proof: почему верить;
- friction: что мешает;
- action: что произойдёт после CTA;
- receipt: как я пойму, что действие принято;
- nurture: что делать, если не готов.

## 6. Prompt structure

Для текстовых задач используем не один prompt, а chain:

```text
1. Extract facts and constraints from source pack.
2. Extract audience pains, objections and desired outcomes.
3. Generate value proposition candidates.
4. Critique each candidate for proof, specificity and differentiation.
5. Select top candidates and explain tradeoffs.
6. Draft page/funnel copy by stage.
7. Run Anton trust gate.
8. Produce final copy with known limits.
```

## 7. Copy block contract

Каждый copy block должен иметь:

```text
block:
job:
audience_state:
source_refs:
claim_level:
copy:
CTA_or_next_action:
fallback_or_recovery:
proof_needed:
```

Нельзя вставлять текст на сайт без `job` и `source_refs`.

## 8. Anton trust gate

Anton блокирует copy, если:

- УТП обещает больше, чем продукт делает;
- claim без source/proof;
- CTA не объясняет последствие;
- форма собирает чувствительные данные без trust context;
- success state выдаёт demo за production;
- funnel ведёт в тупик;
- facts усилены до искажения.

## 9. Caster gate

Cастер проверяет:

- headline читается за один glance;
- текст поддерживает visual engine, а не объясняет его;
- copy density соответствует секции;
- first viewport даёт product/category signal;
- CTA виден и логичен;
- тон не generic AI;
- нет внутренней методологической лексики в UI.

## 10. Status taxonomy

```text
copy_intake_incomplete: нет source pack или proof route
voc_extracted: язык клиента извлечён, copy ещё не готов
value_prop_candidates_ready: варианты УТП есть, не выбраны
draft_copy_ready: текст написан, claims не закрыты proof
trust_review_ready: готово к Anton gate
copy_local_demo_pass: текст работает в локальном flow
copy_production_ready: claims, CTA, receipt и legal/product proof закрыты
```

## Итоговое правило

Сильный текст в Caster — это не “красиво написано”. Это source-bound обещание, понятное конкретному пользователю, доказанное фактами и встроенное в сценарий действия.
