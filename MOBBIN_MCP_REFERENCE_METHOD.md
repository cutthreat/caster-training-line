# Mobbin MCP Reference Method — Caster UI Reference Loop

Версия: `1.0`
Источник: разбор видео `This New MCP Gives Claude a Design Superpower (600,000+ UI Screen References)` от Jay E / RoboNuggets, YouTube: https://www.youtube.com/watch?v=AAmdB1bvmYw

## Зачем это нужно

AI-интерфейсы часто выглядят generic: одинаковые serif-заголовки, фиолетовые градиенты, случайные карточки, слабые состояния и неполный набор экранов. Mobbin полезен не как источник копирования, а как слой реальных shipped UI patterns перед генерацией, редизайном и QA.

Этот метод добавляет в Caster четыре обязательных Mobbin-прохода для интерфейсных задач.

## Базовый протокол

```text
task contract
→ generic AI detector
→ reference search
→ reference cards
→ clean-room pattern extraction
→ redesign / build
→ missing-screens pass
→ standout-components pass
→ Caster/Anton proof
```

## 1. Generic AI Detector

Перед редизайном фиксируем, почему текущий экран выглядит слабым:

```text
screen:
symptom:
generic_palette:
generic_type:
generic_layout:
missing_states:
weak_information_architecture:
fake_or_dead_actions:
proof:
```

Типовые сигналы:

- случайный purple/blue gradient;
- декоративные карточки без задачи;
- одинаковая плотность всех блоков;
- нет empty/error/loading/success/back states;
- dashboard/landing выглядит как template, а не как продукт;
- CTA не имеет доказанного результата.

## 2. Reference-First Redesign

Для каждого важного flow или экрана формулируем запрос к Mobbin:

```text
Find 3-5 real shipped UI references for this task/screen.
Return source links or IDs when available.
Separate observed pattern from brand/copy/layout.
Extract what should be adapted to our product.
```

Результат не считается `screen_exact_research_complete`, если нет точных screen/flow URL или ID. В этом случае статус только `pattern_research_ready`.

## 3. Missing-Screens Pass

После основного build запускаем отдельный поиск:

```text
Using Mobbin, find UI screens builders usually miss for this app/flow.
Map them into our design system.
List required states and recovery paths.
```

Для Caster это обязательный pass на:

- onboarding;
- auth/login;
- checkout/payment;
- settings/profile;
- empty states;
- error/recovery;
- permissions;
- confirmation/receipt;
- cancellation/back path;
- loading/progress.

Anton блокирует релиз, если missing-screen pass не закрыт для sensitive или transaction flows.

## 4. Standout-Components Pass

После базовой структуры можно искать не только “правильные”, но и сильные компоненты:

```text
Find 5 useful and visually strong UI component patterns for this product context.
Keep them compatible with our design system.
Do not copy brand, layout, copy, assets or visual rhythm.
```

Компонент проходит только если он:

- помогает пользовательской задаче;
- не ломает information hierarchy;
- имеет states;
- работает на mobile;
- может быть проверен браузером.

## Clean-room boundary

Mobbin — evidence layer, не библиотека для копирования.

Запрещено переносить:

- exact layout;
- brand;
- copy;
- assets;
- visual rhythm;
- private/paywalled screen details без source permission;
- названия продуктов как доказательство конкретного UI.

Разрешено переносить:

- структуру задачи;
- state coverage;
- placement logic;
- trust pattern;
- progressive disclosure;
- recovery route;
- density principle.

## Evidence statuses

```text
screen_exact_research_complete: есть точные screen/flow URLs или IDs
pattern_research_ready: есть category/evidence и переносимый pattern, но exact cards неполные
connector_ready: MCP/connector доступен в текущем execution surface
connector_available_elsewhere: connector подтверждён в другом thread/surface
mobbin_tool_unavailable: tools не видны текущему runtime
pending_owner_auth: нужен OAuth/login/paid access
```

## Caster gate

Cастер проверяет:

- reference не превратился в копию;
- visual system стал менее generic;
- density и rhythm соответствуют продукту;
- компоненты не декоративные;
- mobile переавторен.

## Anton gate

Anton проверяет:

- закрыты missing screens;
- sensitive input имеет trust context;
- CTA consequence доказан;
- есть receipt/recovery/back path;
- demo не выдан за production.

## Итоговое правило

Mobbin нужен не чтобы “сделать красиво как X”. Он нужен, чтобы Caster видел реальные интерфейсные решения, извлекал переносимый pattern, закрывал забытые экраны и доказывал, что UI не является generic AI output.
