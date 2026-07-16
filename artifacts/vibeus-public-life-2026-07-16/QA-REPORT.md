# VibeUs Public Life QA report

## Runtime

- Local route: `http://127.0.0.1:8771/variants/vibeus-public-life/`
- Default Hero: Code breach.
- Alternative Heroes: `?hero=quantum`, `?hero=singularity`.
- Local HTML, CSS, JavaScript and product screenshot assets returned HTTP 200.
- Final console exceptions: 0.
- Final log errors: 0.
- Final failed network requests: 0.
- Font status at capture: loaded.

## Responsive proof

| Viewport | Result |
|---|---|
| 1440 by 900 | pass, no accidental horizontal overflow |
| 768 by 900 | pass, authored vertical lifecycle |
| 390 by 844 | pass, CTA visible and no overflow |
| 320 by 700 | pass, CTA bottom 660 px, no overflow |

## Interaction proof

- Desktop journey advances through four horizontal chapters and one progress line.
- Mobile journey is vertical and does not depend on scroll translation.
- Reduced motion: foreground particles removed, canvas loop stopped, sticky journey disabled, track transform none.
- Mobile menu: open state sets `aria-expanded=true`, body overflow hidden and full-screen links visible; close state restores all values.
- Decorative Hero layers are pointer-inert and do not intercept CTA clicks.

## Destination proof

HTTP 200 was verified for authentication, catalog, three exact project pages, terms, privacy and support.

## Automated verifier

`node artifacts/vibeus-public-life-2026-07-16/verify.mjs`

Result: 14 of 14 static contracts pass.

Limit: the verifier does not judge composition, product meaning or conversion quality. Those are covered by Caster and Anton verdicts.
