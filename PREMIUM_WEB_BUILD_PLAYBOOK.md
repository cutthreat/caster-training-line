# Premium Web Build Playbook

Источник: видео [Build $10,000 Websites using Claude Code](https://youtu.be/VMvZuhcDdnw), адаптировано для Caster Training и сайта «Линия».

## Цель

Создавать продуктовые сайты с узнаваемой визуальной системой, ясным сценарием и проверяемым качеством. Это не формула цены и не обещание «дорогого» результата — это дисциплина перед visual pass.

## 1. Build brief до первой реализации

Каждый запуск фиксирует:

- аудиторию и одну целевую задачу;
- оффер и честные условия;
- 1–3 референса с ролью (`hierarchy`, `interaction`, `imagery`, `material`), но без копирования;
- visual thesis и главный hero object;
- количество и назначение секций;
- copy owner и source of truth;
- применимый stack, motion/accessibility contract и performance budget;
- desktop/mobile acceptance screenshots.

## 2. Eight-pillar gate

Перед pass пройти восемь pillars:

1. `brief fidelity` — страница решает заявленную задачу.
2. `visual system` — типографика, цвет и spacing образуют свою систему.
3. `hero` — смысл, объект и действие ясны за 3 секунды.
4. `copy` — конкретна, не объясняет UI и не обещает недоказанное.
5. `imagery` — визуал несёт смысл, имеет ownership/fallback/crop contract.
6. `motion` — не более одного осмысленного движения на секцию; есть reduced-motion.
7. `mobile` — приоритеты и композиция переавторены, а не только ужаты.
8. `delivery` — внешняя ссылка, deploy proof, no-overflow, console/network check и маршрут отката.

Если хотя бы один pillar не имеет proof, статус — `polish_incomplete`, а не production pass.

## 3. Polish loop

После первого reveal не переписывать всё сразу. Делать короткие, наблюдаемые проходы:

1. выбрать одну плоскую или неясную секцию;
2. назвать defect и user impact;
3. изменить один visual/motion/copy аспект;
4. проверить desktop, mobile и reduced motion;
5. зафиксировать до/после и перейти к следующей секции.

Правило motion: один visual beat на секцию. Например, hover для CTA, number transition для facts или controlled reveal для product visual. Motion не должен скрывать слабый оффер или ухудшать ввод/скролл.

## 4. Anti-generic guard

Перед release спросить:

- не получился ли знакомый AI-layout без продуктовой причины;
- есть ли у hero собственный объект и характер, а не только большой текст;
- не повторяются ли карточки/градиенты/шрифтовая иерархия без задачи;
- видны ли реальные условия до CTA;
- есть ли у каждого интерактива truthfully useful outcome.

## 5. «Линия»: ближайший применимый backlog

- подключить backend/CRM receipt вместо demo-localStorage;
- добавить отдельный источник юридически подтверждённых условий для числовых claims;
- снять и приложить desktop/mobile screenshots после каждого visual change;
- измерить LCP/INP и вес визуальных assets после добавления реальных медиа.
