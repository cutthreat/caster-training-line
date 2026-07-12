# AURELIA motion ledger

Источник: ADp4isXOva4, hero reveal segment приблизительно 09:30–09:54, dense frame contact-sheet в локальном `motion-reference/`.

| Segment | Что видно в reference | Наш clean-room adaptation | Proof |
|---|---|---|---|
| K0 / 0.00 | wide island context, title readable | full-bleed photo, title и CTA поверх спокойной зоны | desktop hero |
| K1 / 0.35 | camera approaches mountain/forest, crop tightens | scroll-linked `scale` + `translateY` photo | transform before/after |
| K2 / 0.65 | lake/forest detail becomes dominant | photo crop remains subject-led, copy fades to 38% | scroll capture |
| K3 / 0.90 | wide aerial returns, page structure becomes clear | next section enters after hero, CTA remains recoverable | arrival capture |
| K4 / 1.00 | author transitions to next page/section | journey section with second media crop and text action | screen-by-screen proof |

## Code mapping

- `hero-photo --hero-scale`: camera push/pull analogue;
- `hero-photo --hero-y`: depth/parallax analogue;
- `hero-copy --hero-copy-opacity`: copy yields to media during reveal;
- IntersectionObserver: section-level reveal;
- reduced motion: static photo and full copy preserved.

## Limits

Reference uses generated video/media between frames. AURELIA currently uses one approved external photo plus CSS scroll interpolation, so it is a motion prototype, not a frame-sequence production build.
