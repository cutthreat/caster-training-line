# Authorial Text DNA Method — Caster Anti-Stamp Copy System

Версия: `1.0`  
Контур: Caster copy + funnel method + Anton trust gate  
Источник для обновления: `https://www.youtube.com/watch?v=BydFvfT3IjM`

## Зачем это нужно

Обычная генерация текста быстро уходит в узнаваемый AI-штамп: одинаковые вводные, пустые усилители, гладкие фразы без фактов, искусственный энтузиазм, одинаковый ритм абзацев.

Этот метод добавляет в Caster отдельный контур авторского голоса: сначала собираем запреты, стиль, факты и сценарий, потом генерируем текст, затем прогоняем его через анти-штамп, факт-чек и Anton gate.

Главное усиление относительно исходного видео: стиль и факты хранятся отдельно. Закрытая база знаний снижает дрейф, но не делает текст автоматически истинным. Production copy возможен только после проверки claims и источников.

## Базовый протокол

```text
source truth
→ anti-stamp stop-list
→ authorial DNA corpus
→ fact source pack
→ funnel/context brief
→ bound drafting agent
→ anti-stamp lint
→ style-fit score
→ fact guard
→ Anton trust gate
→ production copy
```

Нельзя начинать с промпта. Сначала собирается материал, на котором агент имеет право работать.

## 1. Anti-stamp stop-list

Перед генерацией фиксируем, что запрещено:

```text
forbidden_words:
forbidden_phrases:
forbidden_openings:
forbidden_cta_patterns:
forbidden_punctuation:
generic_claims:
empty_intensifiers:
ai_meta_language:
replacement_principles:
```

Типовые запреты:

- “в современном мире”, “революционный”, “уникальный”, “инновационный” без доказательства;
- расплывчатые обещания без условия, числа, примера или источника;
- одинаковые списки из трёх benefits без сценария пользователя;
- восклицательные CTA, если продукт требует доверия;
- внутренние слова вроде `source-bound`, `верификатор`, `методология`, если это UI copy.

Запреты не должны просто удалять слова. Для каждого сильного запрета нужен принцип замены: что писать вместо этого и за счёт какого факта.

## 2. Authorial DNA corpus

`Authorial DNA` — это не копирование чужого текста. Это карта устойчивых языковых решений:

```text
source_id:
ownership: own | client_provided | public_reference | licensed
allowed_use: direct_reuse | style_learning | inspiration_only | blocked
domain:
audience:
lexicon:
professional_slang:
sentence_rhythm:
paragraph_shape:
argument_pattern:
metaphor_domain:
proof_style:
objection_style:
cta_style:
taboo:
```

Лучший материал:

- собственные статьи, посты, сценарии, письма, интервью;
- sales notes, ответы в чатах, разборы заявок;
- клиентские формулировки из VOC;
- публичные референсы только как `inspiration_only`, без копирования структуры, фраз и узнаваемого rhythm.

Если своих текстов нет, можно использовать внешние сайты, видео и каналы как учебные примеры, но результат должен пройти clean-room boundary: переносим принцип, а не фразу, образ, брендовый тон или композицию чужого автора.

## 3. Fact source pack

Факты отделяются от стиля:

```text
claim:
source:
evidence_type: owner | analytics | customer_quote | benchmark | demo | inference
scope:
condition:
number_or_detail:
safe_version:
forbidden_overclaim:
proof_required:
```

Правило: стиль может быть авторским, но claim обязан быть доказуемым. Если факт отсутствует, текст получает статус `draft_claims`, а не `production_copy_ready`.

## 4. Bound drafting agent

NotebookLM, Gemini Gems или другой агент могут использоваться как оболочка, но рабочий contract важнее инструмента.

Минимальная инструкция агенту:

```text
role:
work_only_with_attached_sources: yes
source_priority:
style_sources:
fact_sources:
anti_stamp_stop_list:
claim_policy:
uncertainty_policy:
copy_job:
funnel_stage:
output_format:
self_check_required:
```

Критические правила:

- не добавлять claims вне fact source pack;
- не копировать публичные референсы дословно;
- сохранять авторский ритм без имитации конкретного чужого автора;
- если данных не хватает, помечать `needs_source`, а не выдумывать;
- в финале отдавать не только текст, но и self-check: какие claims использованы, какие запреты проверены, где есть риск.

## 5. Anti-stamp lint

После черновика прогоняем текст через линт:

```text
cliche_found:
generic_claim_found:
unsupported_superlative:
same_sentence_rhythm:
empty_intro:
ai_meta_language:
weak_cta:
missing_consequence:
overlong_block:
replacement:
```

Текст не проходит, если:

- его можно вставить на сайт любого конкурента;
- headline не даёт category/product signal;
- benefits не связаны с pain, objection или next action;
- CTA не объясняет, что произойдёт после клика;
- есть “красиво”, но нет условия, факта, примера или ограничения.

## 6. Style-fit score

Каждый текст оценивается по шкале `0–3`:

```text
lexicon_fit:
sentence_rhythm_fit:
paragraph_shape_fit:
proof_style_fit:
objection_handling_fit:
cta_style_fit:
specificity:
originality_boundary:
```

Минимум для публикации: `18/24`, без нулей.  
Если `originality_boundary = 0`, текст блокируется независимо от общей суммы.

## 7. Funnel and scenario integration

Авторский голос не заменяет сценарий воронки. Для каждого блока фиксируем:

```text
funnel_stage:
user_state:
question_in_head:
objection:
needed_fact:
authorial_move:
copy:
CTA_or_next_action:
receipt:
recovery:
```

Текст обязан переводить пользователя в следующее состояние: понять, поверить, сравнить, оставить заявку, подтвердить формат, вернуться после сомнения.

## 8. Anton gate

Anton блокирует текст, если:

- стиль маскирует недоказанное обещание;
- “цифровой слепок” превращается в копирование чужого автора;
- claims не связаны с source refs;
- CTA ведёт в несуществующее действие;
- success state имитирует реальную отправку без честного receipt;
- текст звучит экспертно, но не помогает пользователю принять решение.

## 9. Status taxonomy

```text
style_sources_collected: есть корпус, права и роли источников размечены
anti_stamp_rules_ready: запреты и принципы замены зафиксированы
fact_source_pack_ready: claims и proof route собраны
bound_agent_ready: агент/промпт подключён к источникам и правилам
source_bound_draft: черновик создан, claims ещё проверяются
anti_stamp_pass: AI-штампы сняты
style_fit_pass: авторский голос принят по score
fact_guard_pass: claims подтверждены или смягчены
production_copy_ready: текст прошёл style, fact, funnel и Anton gates
```

## Итоговое правило

Хороший AI-текст в Caster — это не “похоже на человека”. Это доказуемый текст с авторским ритмом, чистым источником фактов, понятной ролью в воронке и отсутствием машинного штампа.
