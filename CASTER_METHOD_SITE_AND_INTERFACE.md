# Caster Method — создание сайтов и интерфейсов

Версия: `1.0`  
Контур: Caster visual direction + Anton product/trust gate + Mobbin research + browser proof  
Назначение: создавать сайты и интерфейсы, которые одновременно выглядят зрелыми, понятны пользователю, реалистичны в реализации и честны по уровню готовности.

## 0. Главный принцип

Не начинаем с компонентов, промпта или CSS. Начинаем с пользовательской задачи, source truth и visual engine. Каждый результат должен пройти четыре вопроса:

1. Понятно ли за 3 секунды, что это, для кого и что делать дальше?
2. Работает ли путь пользователя в default, mobile, error, empty, loading и recovery состояниях?
3. Доказана ли связь между референсом, решением и текущим build?
4. Не обещаем ли мы больше, чем реально отправляет, сохраняет или получает система?

Если ответ не доказан, вердикт не `ready`.

## 1. Нормализация задачи

До работы фиксируем короткий task contract:

```text
result: какой пользовательский результат должен появиться
audience: кто выполняет действие
primary_task: одно главное действие
scope: страницы, экраны, states и breakpoints
source_truth: approved copy, product rules, Figma/source URLs, real assets
accepted_patterns: что разрешено перенести как принцип
constraints: права, legal, performance, stack, backend, deadline
done_when: проверяемые acceptance criteria
proof_route: browser, screenshots, destination receipt, owner decision
```

Пустые `source_truth`, `done_when` или `proof_route` переводят задачу в `intake_incomplete`.

## 2. Source truth и reference research

Для видео, screen-recording и tutorial действует отдельный time-aligned метод: [VIDEO_INTELLIGENCE_METHOD.md](VIDEO_INTELLIGENCE_METHOD.md). Transcript-only summary не считается достаточным evidence.

### 2.1 Иерархия источников

Приоритет источников:

1. текущая approved product truth;
2. owner/legal/engineering decision;
3. exact Figma/source-bound screen или asset;
4. Mobbin/реальные shipped UI patterns;
5. public inspiration;
6. AI-generated proposal.

Нижний источник не может отменить верхний.

### 2.2 Mobbin lane

Mobbin используем для task-specific research: `login`, `onboarding`, `paywall`, `settings`, `empty/error`, `checkout`, `form`. Отчёт обязан разделять:

- `evidence`: что реально найдено, с URL/ID и ограничениями доступа;
- `accepted_pattern`: переносимый UX-принцип;
- `clean_room_boundary`: что нельзя копировать;
- `implementation_contract`: как принцип будет адаптирован;
- `proof_required`: чем проверим результат.

Статусы:

- `screen_exact_research_complete` — есть точные source links/IDs;
- `pattern_research_ready` — есть category/evidence и переносимые patterns, но exact card proof неполный;
- `mobbin_tool_unavailable` — connector не виден в runtime;
- `pending_owner_auth` — нужен OAuth/доступ владельца.

Запрещено выдавать название продукта из выдачи за доказательство конкретного UI. Запрещено копировать layout, copy, assets, brand, visual rhythm или flow.

### 2.3 Reference card

Для каждой ссылки сохраняем:

```text
source:
source_type: exact_screen | flow | category | public_inspiration
role: hierarchy | interaction | imagery | material | content_density
evidence_level:
observed_pattern:
accepted_pattern:
clean_room_boundary:
implementation_contract:
proof_required:
```

## 3. Caster brief

Перед build создаём brief, который другой исполнитель сможет выполнить без чата:

```text
role: visual director + senior product designer
objective: one user outcome
audience:
offer_and_conditions:
visual_thesis: mood + material + energy in one sentence
hero_object:
content_plan: hero / support / detail / proof / CTA
interaction_thesis: 2–3 motions with user effect
reference_roles:
copy_rules:
asset_map:
responsive_contract:
accessibility_contract:
performance_budget:
do_not_change:
acceptance_checklist:
```

«Сделай дорого», «как T‑Bank» или «как референс» — не brief. Это может быть только shorthand, который нужно развернуть в observable decisions.

## 4. Visual engine

Каждый визуально насыщенный экран получает:

1. `media kernel`: главный image/video/3D/canvas/product object;
2. `one effect`: reveal, depth, scrub, parallax, orbit, hover или transition;
3. `page rhythm`: hero → support → detail → proof/action → CTA;
4. `proof`: screenshot, state, mobile, overflow, console/network.

Один section = одна dominant visual idea, один смысл, один следующий шаг. Cards появляются только если card — это сама задача или продуктовый объект.

## 5. Content and copy

Copy должна помогать решению, а не объяснять внутреннюю методологию.

Проверяем:

- product name и promise видны сразу;
- headline укладывается в один reading glance;
- supporting copy короткая и конкретная;
- условия, ограничения и последствия CTA не спрятаны;
- нет `source-bound`, `verifier`, `training`, `AI-generated` и другой внутренней лексики в UI;
- claims имеют source/legal/owner proof;
- можно удалить 30% текста без потери смысла.

## 6. UX flow и states

Для каждого действия строим state map:

```text
entry → default → input → validation → loading → success/receipt
                       ↘ error → recovery
                       ↘ cancel/back → сохранённое состояние
empty → объяснение → один CTA → результат
```

Для onboarding и forms default:

- одна задача на экран;
- видимый прогресс;
- один primary CTA;
- back path без потери контекста;
- короткий trust context перед sensitive input;
- ручной fallback или альтернативный способ продолжить;
- понятное последствие действия;
- distinction между demo/local state и реальным destination receipt.

Для «Линии» это применено как `контакт → формат/подтверждение`.

## 7. Interaction contract

Каждый control должен иметь:

- default;
- hover;
- focus-visible;
- pressed/active;
- disabled, если применимо;
- loading;
- success/error;
- keyboard path;
- mobile target size;
- честный результат.

Hover не является proof. Кнопка считается работающей только когда её результат проверен браузером и соответствует label.

Motion rules:

- 2–3 intentional motions на визуальный сайт;
- не более одного dominant motion beat на section;
- `prefers-reduced-motion` сохраняет смысл;
- нет jump/lag/blank canvas;
- motion не маскирует слабый оффер или плохую читаемость.

## 8. Responsive re-authoring

Mobile не равен сжатому desktop.

Для каждого ключевого screen фиксируем:

- что остаётся первым;
- что скрывается или переносится;
- как меняется crop/media;
- какие controls становятся full-width;
- как сохраняется back path и CTA consequence;
- что происходит при длинном тексте, реальных числах и отсутствии media.

## 9. Implementation layers

Работа идёт слоями:

1. architecture/file tree;
2. source and asset map;
3. visual engine;
4. hero/composition;
5. section skeleton;
6. interaction/state behavior;
7. copy and CTA;
8. responsive re-authoring;
9. accessibility/performance;
10. polish;
11. deploy/proof;
12. learning closeout.

Не исправляем глобальным CSS один локальный дефект, если можно починить компонентным правилом. Не подключаем тяжёлую библиотеку ради эффекта, который решается native CSS/canvas.

## 9.1 Video/sitecraft pass

Для сайтов с cinematic-качеством добавляем отдельный pass из видео-workflow:

1. выбрать reference roles, а не один «похожий сайт»;
2. собрать visual thesis и shot/interaction list до кода;
3. реализовать hero visual engine первым;
4. дать каждой секции один controlled motion beat;
5. сделать targeted polish по одной секции за итерацию;
6. проверить mobile, reduced motion, fallback и performance;
7. только после browser proof публиковать внешний URL.

Для динамического hero motion разбирается по [Motion Intelligence Method](MOTION_INTELLIGENCE_METHOD.md): `trigger → start state → moving layers → timing/easing → end state → user meaning`. В proof packet фиксируем не только итоговый кадр, но и K0/K1/K2/K3/K4, чтобы доказать continuity, narrative и fallback.

Generated media не является готовым production asset без `asset_id`, owner/licensing, dimensions, weight, crop, fallback и viewport contract. В fintech-поверхностях motion и atmosphere всегда вторичны по отношению к offer, conditions, trust и CTA consequence.

## 10. Caster pass

Cастер проверяет:

- composition: dominant/support/quiet space/focal route;
- visual system: type scale, rhythm, contrast, crop;
- first 3 seconds;
- mobile priority;
- content resilience;
- state completeness;
- originality boundary;
- asset/media contract;
- motion and reduced motion;
- proof sufficiency.

Caster verdict должен содержать: defect, user impact, proposed fix, acceptance criteria, desktop note, mobile note, proof required, next UI step.

## 11. Anton pass

Anton — blocking product gate. Он проверяет:

- product meaning;
- task continuity;
- trust;
- form integrity;
- navigation;
- information architecture;
- visual hierarchy;
- copy clarity;
- actionability;
- market quality.

Anton блокирует:

- fake/dead actions;
- misleading labels;
- claims без proof;
- форму, принимающую nonsense;
- demo receipt, выданный за CRM receipt;
- отсутствие recovery/back path;
- чувствительный ввод без trust context;
- «готово» без destination-side proof.

## 12. Eight-pillar release gate

Перед release выставляем статус по восьми pillars:

1. `brief_fidelity`;
2. `visual_system`;
3. `hero`;
4. `copy`;
5. `imagery`;
6. `motion`;
7. `mobile`;
8. `delivery`.

Каждый pillar имеет `pass`, `blocked` или `pending` и proof reference. Один критический `blocked` запрещает общий `ready`.

## 13. Proof contract

Минимальный proof packet:

- local URL или deployed URL;
- desktop screenshot;
- mobile screenshot;
- key states: default, validation/error, loading, success/receipt, empty где применимо;
- no horizontal overflow;
- no console errors/failed asset requests;
- main interaction smoke-test;
- keyboard/focus path;
- reduced-motion check;
- real content/long text check;
- destination receipt для CRM/analytics/backend claims;
- known limits и rollback path.

Full-page screenshot не доказывает reveal/scroll state. Green verifier не заменяет human visual review.

## 14. Truthful status taxonomy

- `intake_incomplete` — не хватает source/done/proof contract;
- `structural_pass` — структура и маршрут проверены;
- `visual_blocked` — visual issue или нет свежего screenshot proof;
- `pattern_research_ready` — Mobbin patterns найдены, exact screens не доказаны;
- `local_demo_pass` — локальный flow работает, данные не ушли наружу;
- `locally_verified_not_production` — локально работает, production receipt не доказан;
- `pending_external_evidence` — нужен owner/live/backend/legal proof;
- `closed_by_evidence` — соответствующий external/source/owner proof есть;
- `production_blocked` — есть критический blocker;
- `ready` — все критические gates pass и доказаны.

## 15. Learning closeout

После каждой задачи сохраняем:

```text
task:
source_truth:
accepted_patterns:
caster_findings:
anton_findings:
decision_codes:
proof_refs:
what_changed:
what_failed:
what_to_reuse:
known_limits:
next_try:
```

Устойчивый урок попадает в canon/playbook, а не остаётся только в чате.

## 16. Final expert checklist

Перед финальным ответом:

- [ ] цель понятна за 3 секунды;
- [ ] primary CTA понятен за 5 секунд;
- [ ] каждый control даёт полезный результат;
- [ ] source evidence отделён от accepted pattern;
- [ ] clean-room boundary зафиксирован;
- [ ] Caster verdict actionable;
- [ ] Anton trust/form gate пройден;
- [ ] mobile переавторен;
- [ ] states/recovery/back path проверены;
- [ ] claims имеют proof;
- [ ] demo не выдан за production;
- [ ] desktop/mobile/state proof приложен;
- [ ] deployment/receipt/rollback status честно указан.

Итоговый принцип: красивый интерфейс — это не результат. Результат — понятный пользовательский путь, зрелая визуальная система, работающие состояния и доказанная связь с правдой продукта.
