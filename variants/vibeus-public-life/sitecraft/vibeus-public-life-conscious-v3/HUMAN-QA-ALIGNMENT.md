# Human-QA alignment

The design-intent card stayed hidden until both raw traces were closed. The
accepted evidence is bound to the current responsive semantic sketch.

| Contract | Intended | Desktop observed | Mobile observed | Result |
| --- | --- | --- | --- | --- |
| Category | public social surface for AI makers | “витрина/социальная площадка для публикации и просмотра AI-проектов” | “платформа/каталог, где собирают и показывают AI-проекты публично” | pass |
| Value | inspect public examples before contributing | “без регистрации посмотреть, какие проекты уже опубликованы” | “посмотреть готовые публичные примеры” | pass |
| Audience | makers who need a public place for an AI-assisted result | “создатели и энтузиасты AI-продуктов/веб-проектов” | “люди, которые делают AI-проекты” | pass |
| Primary action | open the public catalogue | click “Смотреть проекты ↗” | click “Смотреть проекты /” | pass |
| Route | public-before-auth catalogue route | chose the catalogue because it answers the goal without registration | chose the projects link to check usefulness without registration | pass |

Residual: trust is moderate (57 desktop, 58 mobile) because the first viewport
shows one labelled demo object. The visual build must add owned catalogue and
route proof; copy alone is not allowed to close this gap.

Calibration history is retained under `human-qa/sketch-*-v2`. Those traces are
not accepted because the old deterministic perception bridge omitted inverse
CTA text. The repaired bridge uses pixels only, including responsive focus-tile
OCR; no DOM, hidden route, or design intent was disclosed.
