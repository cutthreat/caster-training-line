# Линия — implementation brief v2

## Objective

Дать частному пользователю быстрый и понятный путь от интереса к заявке на финансовый продукт, не скрывая формат действия и границы demo-контура.

## Visual thesis

Жёлто-чёрная fintech-система с одним главным объектом — картой, которая ощущается живой через мягкий depth/tilt, но остаётся функциональной и спокойной.

## Content plan

1. Hero — что это и главный CTA.
2. Product switcher — выбрать сценарий.
3. Benefits — доказать ценность.
4. App surface — показать контроль расходов.
5. Steps — снять сомнения о пути.
6. Application — собрать контакт в два шага.

## Reference roles

- Mobbin: onboarding/login/state patterns;
- T‑Bank: public fintech clarity and product breadth as benchmark, not source-copy;
- video `ADp4isXOva4`: reference-first build, hero media/motion, targeted polish and deploy discipline.

## Interaction thesis

- hero card tilt/depth on pointer, disabled for reduced motion;
- section reveal once per viewport;
- tabs/audience switch changes the product context;
- two-step application with progress, back path, validation and demo receipt.

## Responsive contract

- mobile re-authors hero to one-column composition;
- product tabs remain full-width hit targets;
- application remains one task per step;
- no horizontal overflow at 390px;
- all critical copy and CTA remain visible without hover.

## Acceptance

- no dead buttons or misleading labels;
- all links resolve to a section or explicit action;
- default/hover/focus/pressed/error/success states exist where applicable;
- `prefers-reduced-motion` preserves meaning;
- local demo is clearly distinguished from real CRM receipt;
- external Pages returns 200;
- desktop and mobile browser proof captured;
- console/network failures checked before production claim.

## Known limits

- Current application is a demo-local flow. It stores only in the browser and does not submit personal data to a backend.
- Exact Mobbin screen IDs were not available for the fintech research batch; only pattern evidence is used.
