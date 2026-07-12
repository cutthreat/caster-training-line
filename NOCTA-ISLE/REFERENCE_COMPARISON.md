# NOCTA vs reference video — Caster comparison

Дата: 2026-07-12  
Reference: `ADp4isXOva4`  
Frames: `reference-frames/ref-12m10.jpg`, `ref-20m50.jpg`  
Output: `reference-frames/nocta-hero-current.png`, `nocta-arrival-current.png`, `mobile-proof.png`

## Verdict

`structural_pass / visual_blocked_for_reference_level`

NOCTA уже работает как самостоятельный cinematic landing: есть hero, narrative section, arrival transition, selectable stay states, CTA, mobile re-authoring и proofable interaction. Но до visual level ролика не хватает реального hero asset и более сложного media-led narrative.

## What matches

- one dominant concept per page;
- editorial type pairing: neutral sans + serif accent;
- dark atmospheric palette with one acid accent;
- large sparse typography;
- section-by-section scroll rhythm;
- one action per section;
- mobile version preserves the main visual thesis.

## Main gaps

### P1 — weak media kernel

В референсе остров и Сизиф несут основную эмоциональную массу через реалистичное image/video. В NOCTA гора, вода и луна собраны процедурным CSS и читаются как abstract geometry. Это удерживает стиль, но не даёт того же visual authority.

### P2 — shallow motion narrative

Сейчас есть reveal и form/stay interaction, но нет scroll-linked media sequence уровня `approach → reveal → detail`. Следующий pass должен менять crop/scale/position hero media, а не только показывать секцию.

### P2 — arrival scene lacks object

В референсе кадр имеет сильный объект и environment. У NOCTA arrival сейчас маршрутная схема и абстрактный берег. Нужен один identifiable object: причал, лодка, дом или световой маяк.

### P3 — proof composition

Desktop proof сейчас лучше воспринимается после scroll, а не как отдельный hero/arrival storyboard. Для reference-level acceptance нужны отдельные captures: hero, transition, arrival, stay state, CTA и mobile default.

## Recommended next pass

1. Добавить approved/generated hero image с `asset_id`, owner/licensing, dimensions, weight, poster и fallback.
2. Сделать scroll-linked sequence из 3–4 кадров или лёгкого canvas sequence.
3. Привязать arrival reveal к одному объекту — лодке/дому/маяку.
4. Оставить текущую типографику и цветовую систему; не добавлять больше декоративных UI-элементов.
5. Переснять proof storyboard и прогнать Anton по CTA/форме после media pass.

## Acceptance for next visual pass

- hero object readable without copy;
- crop/reveal changes with scroll;
- mobile uses a dedicated crop/fallback;
- reduced motion preserves the same story;
- no layout shift or console errors;
- asset provenance and weight are recorded;
- Caster score at least `11/15`;
- no `BD-05 fake_premium`, `BD-20 motion_boundary_gap`, `BD-23 cinematic_performance_debt`.
