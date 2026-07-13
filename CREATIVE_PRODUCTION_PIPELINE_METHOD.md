# Creative Production Pipeline Method — Caster Visual Asset System

Версия: `1.0`
Источник: разбор видео `AI Brand Ads SO Cinematic you'll think they cost $30,000 (it costs cents) — Creative AI Masterclass` от Jay E / RoboNuggets, YouTube: https://www.youtube.com/watch?v=UEeJShCrROw

## Зачем это нужно

Для визуальных сайтов высокого уровня недостаточно написать хороший prompt или выбрать сильную модель. Качество начинается раньше: с исходного пакета, визуального вкуса, сцены, референсов, asset board и решения, что автоматизировать, а что оставить человеку.

Этот метод добавляет в Caster отдельный слой production-подготовки для cinematic сайтов, hero, рекламных страниц, video-led страниц и любых проектов, где media kernel несёт основной смысл.

## Базовый протокол

```text
product truth
→ creative direction
→ input pack
→ scene/section plan
→ prompt table
→ generation streams
→ human taste gate
→ assembly
→ browser/product proof
→ learning closeout
```

## Главный принцип

`Garbage in → garbage out` применяется к интерфейсам так же жёстко, как к данным.

Если входной пакет слабый, модель будет компенсировать это generic-стилем, случайными деталями, шумной эстетикой и неподходящим motion. Поэтому Caster должен оценивать не только готовый экран, но и качество входов.

## Input pack

Перед visual build фиксируем:

```text
product_or_place:
primary_user_result:
core_image:
hero_object:
element_board:
reference_roles:
scene_or_section_plan:
copy_intent:
motion_intent:
format_targets:
asset_rights:
do_not_generate:
quality_mode: speed | balanced | max_quality
```

### Core image

Главный кадр или объект, который держит весь visual engine. Для сайта это может быть product shot, место, персона, интерфейс, карта, 3D-объект, фото или generated bitmap с понятными правами.

### Element board

Набор визуальных элементов, которые задают мир: детали продукта, материалы, свет, окружение, UI-фрагменты, текстуры, предметы, цвета, кадры состояния. Это не moodboard ради красоты, а карта того, что модель или дизайнер должны удержать в кадре.

### Scene/section plan

Для видео это сцены. Для сайта это sections и motion beats.

```text
S1 hero: что видит пользователь и какой объект главный
S2 reveal: что меняется после первого скролла
S3 detail: какая часть продукта раскрывается
S4 proof/action: почему можно доверять
S5 CTA: что пользователь делает дальше
```

## Prompt table

Не держим prompts только в чате. Для production-проекта создаём таблицу:

```text
scene_or_section:
input_refs:
prompt_goal:
model_or_tool:
expected_output:
negative_constraints:
acceptance_criteria:
selected_output:
rejected_outputs:
reason:
```

Это превращает генерацию из случайной попытки в управляемый production ledger.

## Что автоматизировать

Автоматизируем:

- подготовку вариантов prompts;
- генерацию черновых изображений/видео;
- таблицу scenes/sections;
- batch-экспорт;
- naming и inventory;
- первичный scoring;
- сбор proof packet.

Оставляем человеку/Caster:

- выбор сильного кадра;
- отсечение generic AI look;
- taste gate;
- финальный монтаж/композицию при `max_quality`;
- решение, что не должно быть в кадре;
- проверку, что visual служит пользовательской задаче.

## Quality mode

```text
speed: можно автоматизировать больше, допускаются простые transitions
balanced: человек выбирает keyframes/assets, сборка частично автоматизирована
max_quality: финальная сборка, монтаж, crop и sequence проходят Caster taste gate вручную
```

Если режим `max_quality`, финальную stitching/assembly нельзя считать полностью автоматической. Инструменты помогают, но Caster принимает монтаж, crop, timing и continuity.

## Caster gate

Caster проверяет:

- есть ли strong core image;
- держится ли один visual world;
- не выглядит ли результат generic AI;
- есть ли continuity между sections/scenes;
- работают ли crop, light, material, scale;
- не перегружена ли сцена деталями;
- есть ли clean-room boundary;
- права и fallback зафиксированы.

## Anton gate

Anton проверяет:

- visual не подменяет offer;
- CTA consequence понятен;
- claims не завышены;
- generated media не создаёт ложного product promise;
- форма/заявка/демо не выглядит production receipt без доказательства;
- пользователь понимает, что делать дальше.

## Acceptance criteria

Production pack считается готовым к build только если:

- `core_image` выбран;
- `element_board` собран;
- `scene_or_section_plan` есть;
- prompts/source refs сохранены;
- asset rights или known limits указаны;
- есть rejected-output notes;
- Caster и Anton gates не блокируют;
- proof route определён.

## Что не переносим из видео

- Не переносим чужой Gentle Monster креатив, кадры, copy или визуальный ритм.
- Не принимаем заявленные цены моделей как наш production baseline.
- Не считаем агентную автоматизацию заменой taste gate.
- Не называем generated asset production-ready без прав, fallback и viewport contract.

## Итоговое правило

Cinematic уровень появляется не из одного prompt. Он появляется из качественного input pack, управляемой генерации, человеческого taste gate и доказанного результата в интерфейсе.
