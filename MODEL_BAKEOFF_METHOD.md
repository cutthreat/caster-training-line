# Model Bake-off Method — Caster Agent Evaluation

Версия: `1.0`
Источник: разбор видео `I Made Fable 5 and GPT 5.6 Build the Same App (RAW RESULTS)` от Jay E / RoboNuggets, YouTube: https://www.youtube.com/watch?v=_rTPBC3RnRI

## Зачем это нужно

Когда мы строим сайт или интерфейс высокого уровня, нельзя выбирать модель, агента или связку по ощущению. Нужен короткий controlled bake-off: одинаковое задание, одинаковые ограничения, один независимый результат, затем оценка по нашему стандарту.

Цель bake-off — не доказать, что одна модель всегда лучше другой. Цель — понять, какая связка лучше подходит для конкретного типа задачи: визуальный сайт, продуктовый flow, форма, motion, 3D, кодовая архитектура, polishing или QA.

## Базовый протокол

```text
same task
→ same source truth
→ same constraints
→ same prompt / task packet
→ no revision raw output
→ side-by-side evaluation
→ steering-cost estimate
→ controlled second pass
→ Caster/Anton verdict
→ promote only useful pattern
```

## Что фиксируем

Для каждого участника bake-off:

```text
agent_or_model:
task_packet:
input_assets:
allowed_tools:
time_budget:
revision_policy: raw_once | one_steered_pass | full_iteration
output_url_or_path:
visual_score:
product_score:
implementation_score:
motion_score:
mobile_score:
trust_score:
proof_score:
steering_cost:
failure_modes:
best_use_case:
do_not_use_for:
verdict:
```

## Raw pass

Первый проход всегда оценивается как `raw_once`: один task packet, без подсказок после старта и без ручного исправления результата.

Это нужно, чтобы увидеть:

- базовый вкус композиции;
- способность держать структуру задачи;
- качество UI states без напоминаний;
- склонность к generic AI-copy;
- насколько агент сам закрывает mobile, accessibility, loading/error/success;
- где он начинает фантазировать вместо source truth.

Raw pass не является production verdict. Это диагностический срез.

## Steering cost

После raw pass считаем не только качество результата, но и стоимость доведения:

- `0` — почти не требует steering, достаточно proof/polish;
- `1` — нужны точечные правки секций/states;
- `2` — нужна переавторизация visual system или UX flow;
- `3` — результат проще пересобрать, чем чинить.

Сильный raw result с `steering_cost=3` не считается лучшим выбором для production. Для Caster важнее связка, которая быстро доходит до доказанного результата.

## Оценочная матрица

Каждый критерий оценивается `0–3`.

```text
visual_taste: композиция, типографика, rhythm, asset use
product_fit: понятный пользовательский результат
implementation_quality: структура, поддерживаемость, отсутствие хрупких костылей
interaction_states: default/hover/focus/loading/error/success/back path
motion_judgment: motion объясняет смысл, а не украшает пустоту
mobile_reauthoring: mobile сделан заново, а не сжат
truthfulness: claims, demo/prod границы, receipt
proofability: можно проверить браузером и source refs
```

Promotion threshold: минимум `18/24`, без нулей в `product_fit`, `truthfulness`, `proofability`.

## Caster и Anton роли

Cастер оценивает:

- visual taste;
- first viewport;
- composition and rhythm;
- asset/crop;
- motion meaning;
- originality boundary.

Anton оценивает:

- пользовательский смысл;
- trust и claims;
- CTA consequence;
- формы и sensitive input;
- recovery/back path;
- честность demo/local/prod.

Если Caster даёт высокий visual score, но Anton блокирует trust или action consequence, результат не проходит.

## Как применять к нашим сайтам

Для сложного сайта запускаем bake-off до основной сборки, если есть хотя бы один фактор:

- новый тип визуальной подачи;
- сложный motion или 3D;
- продуктовый flow с формой;
- важный публичный URL;
- сомнение, какая связка быстрее доведёт до уровня Caster.

Минимальный пакет:

1. один source-bound task packet;
2. два кандидата или две стратегии;
3. raw outputs;
4. таблица scoring;
5. выбранная стратегия;
6. learning note в Caster method.

## Запрещено

- Выбирать модель по одному красивому screenshot.
- Сравнивать разные prompts и называть это benchmark.
- Переносить чужой UI/copy/assets из видео.
- Считать raw one-shot production-ready без browser proof.
- Принимать “визуально богаче” как “лучше для пользователя”.

## Итоговое правило

Лучший агент для Caster — не тот, кто делает самый эффектный первый экран. Лучший агент — тот, кто при равном task packet быстрее приходит к доказанному пользовательскому результату с низкой стоимостью steering и честными ограничениями.
