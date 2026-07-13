# Assistant Operations Contour Method — Caster Workbench Layer

Версия: `1.0`
Источники:

- `Codex на максимум: как превратить его в личного AI-ассистента`, Web3nity, YouTube: https://www.youtube.com/watch?v=iBZLChDd3As
- `Я создал ИИ-ассистента, который ведет все мои дела (сэкономил 100к)`, Михаил Тимочко, YouTube: https://www.youtube.com/watch?v=JIXS04GejZI

## Зачем это нужно

Caster уже умеет делать сайты, разбирать видео, использовать Mobbin, усиливать copy и проверять UX. Следующий слой — операционный контур, который не даёт задачам, решениям, созвонам, дедлайнам и follow-up теряться между чатами, файлами и инструментами.

Этот метод описывает, как строить проектный AI-ассистент не как “умный чат”, а как workbench: правила, inbox, память, источники данных, нормализация задач, approval gates и регулярный ритм.

## Главный принцип

AI-ассистент полезен не потому, что имеет доступ ко всему. Он полезен, когда:

- знает границы задачи;
- принимает входящие в один inbox;
- нормализует их в понятные next steps;
- связывает задачи с источником;
- не отправляет и не меняет внешние данные без разрешения;
- регулярно предлагает помощь на основе свежего состояния.

## Базовый протокол

```text
agent rules
→ inbox
→ source intake
→ task normalization
→ memory / project context
→ deadlines and calendar candidates
→ approval gate
→ execution / handoff
→ daily rhythm
→ closeout and learning
```

## 1. Agent rules

В каждом проектном контуре должен быть явный файл или раздел правил:

```text
role:
scope:
allowed_sources:
forbidden_sources:
inbox_rule:
memory_rule:
deadline_rule:
external_action_rule:
approval_required_for:
proof_required:
closeout_format:
```

Без agent rules ассистент действует как обычный чат и быстро теряет контекст.

## 2. Inbox first

Все новые вводные сначала попадают в inbox:

```text
source:
received_at:
raw_input:
type: idea | task | deadline | meeting_note | decision | blocker | follow_up
project:
urgency:
owner:
next_action:
status:
proof_ref:
```

Нельзя сразу превращать сырую фразу в задачу без нормализации. Сначала фиксируем источник и тип.

## 3. Voice and meeting intake

Голосовые заметки, созвоны, транскрипты и длинные сообщения используются как input layer:

```text
raw_transcript:
speaker:
decisions:
tasks:
owners:
deadlines:
risks:
open_questions:
calendar_candidates:
follow_up_messages:
```

Полезный результат не “сделать краткое резюме”, а извлечь action map: кто, что, к какому сроку, какой следующий шаг, где proof.

## 4. Task normalization

Каждая задача приводится к форме:

```text
task:
why:
owner:
source_ref:
deadline:
dependencies:
definition_of_done:
proof_required:
next_step:
status:
```

Если нет `definition_of_done` или `proof_required`, задача остаётся `intake_incomplete`.

## 5. Memory and context

Память — это не склад всего подряд. В неё попадают только устойчивые решения:

```text
decision:
rule:
preference:
known_limit:
route:
verified_source:
last_updated:
```

Запрещено сохранять secrets, raw credentials, cookies, tokens, OAuth material, browser profile data, raw private history or unverified claims.

## 6. Connectors and external actions

Подключения к календарям, дискам, таск-трекерам, Telegram, CRM или другим сервисам требуют отдельного action boundary:

```text
read_allowed:
write_allowed:
draft_allowed:
send_allowed:
approval_required:
destination_receipt_required:
rollback_or_recovery:
```

Default для Caster: читать/анализировать можно только в разрешённом контуре; отправка сообщений, публикация, внешняя запись, изменение календаря или CRM — только через явное разрешение и receipt.

## 7. Daily rhythm

Ассистент должен не только отвечать, но и поддерживать ритм:

```text
morning_check:
open_tasks:
calendar_conflicts:
stale_items:
blockers:
suggested_help:
owner_decisions_needed:
```

Важно: daily rhythm не должен превращаться в шум. Хороший ассистент предлагает 2–5 конкретных действий, а не пересказывает весь backlog.

## 8. Caster adaptation

Для Caster-проектов этот контур используется так:

- новые идеи и референсы попадают в inbox;
- видео и Mobbin findings становятся source-linked packets;
- copy/УТП/funnel правки получают proof refs;
- site tasks получают `definition_of_done`;
- Anton blockers становятся отдельными follow-up tasks;
- publish/deploy/CRM claims требуют destination receipt;
- learning closeout попадает в canon только после proof.

## 9. Anton gate

Anton блокирует operations contour, если:

- ассистент пишет во внешние сервисы без approval;
- задачи создаются без source/ref;
- дедлайны поставлены без owner decision;
- meeting transcript превращён в action без проверки;
- demo receipt выдан за real destination receipt;
- память хранит лишнее или чувствительное.

## 10. Status taxonomy

```text
ops_intake_ready: inbox and source rules exist
ops_context_ready: project memory and rules are connected
ops_task_normalized: tasks have owner/done/proof
ops_read_only_connected: sources can be read/analyzed
ops_write_pending_approval: write/send/calendar actions require owner gate
ops_rhythm_active: daily/periodic check is defined
ops_closed_by_receipt: external action has destination proof
```

## Итоговое правило

Операционный AI-ассистент — это не чат с доступами. Это система, где входящие превращаются в проверяемые задачи, действия проходят approval gates, а контекст растёт только через доказанные решения и closeout.
