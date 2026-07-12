# Motion Intelligence Method

Версия: `1.0`  
Назначение: видеть, разбирать и воспроизводить динамические hero/scroll-интерфейсы на уровне transition system, а не отдельных красивых кадров.

## 1. Motion is a state transition

Разбираем не «анимацию», а переход:

```text
trigger → start state → moving layers → timing/easing → end state → user meaning
```

Для video-led hero это обычно:

```text
close-up → approach → reveal → wide context → next action
```

## 2. Three synchronized tracks

Каждая motion-сцена получает три параллельных трека:

### Speech track

Что автор говорит в этот момент: intent, instruction, claim, failure, decision.

### Visual track

Что реально меняется: crop, camera, scale, opacity, mask, text, cursor, layer order, object identity.

### Implementation track

Что автор делает: prompt, code/file, media generation, component change, browser preview, optimization, deploy.

Если один трек отсутствует, confidence снижается.

## 3. Motion sampling

Для каждой сцены используем:

- `before` — минимум за 1–2 секунды до изменения;
- `dense sequence` — 5–15 кадров внутри перехода;
- `after` — устойчивое конечное состояние;
- `trigger frame` — момент scroll/hover/click/load;
- `code frame` — видимый implementation surface, если он показан.

Периодический кадр раз в 10–20 секунд подходит для общей карты, но не для motion analysis.

## 4. Motion grammar

Записываем:

```text
trigger: load | scroll | hover | cursor | click | drag
camera: static | push-in | pull-out | pan | orbit
crop: wide | medium | close | reframed
layers: background / subject / text / UI / atmosphere
transform: translate / scale / rotate / opacity / blur / mask
timing: duration, stagger, hold
easing: linear / ease / spring / unknown
continuity: seamless | cut | jump | lag
meaning: what user understands or feels
fallback: reduced-motion / poster / low-bandwidth / missing-media
```

## 5. Code-to-motion correlation

Кодовый кадр связываем с визуальным delta:

```text
code/prompt event
→ previous visual state
→ changed property or asset
→ observed result
→ failure/tradeoff
→ implementation contract for our stack
```

Не переносим snippets. Переносим функцию: например, «scroll progress управляет crop и scale hero-media, а текст меняет opacity после reveal threshold».

## 6. Motion storyboard

До реализации строим 4–6 keyframes:

```text
K0 context: hero object readable
K1 approach: camera/crop moves toward object
K2 reveal: detail becomes dominant
K3 context: wider scene or product meaning returns
K4 action: CTA becomes primary
```

Каждый keyframe имеет acceptance: что должно быть видно, что должно исчезнуть и что пользователь должен понять.

## 7. Browser proof

Проверяем motion в четырёх режимах:

1. slow scroll — видно ли намерение;
2. fast scroll — нет ли jump/blank/lag;
3. mobile — не теряется ли subject/CTA;
4. reduced motion — сохраняется ли смысл без движения.

Для hero proof сохраняем K0, K1, K2, K3, K4, а не только full-page screenshot.

## 8. Motion score

Оцениваем `0–3`:

- `identity`: объект узнаваем во время перехода;
- `continuity`: переход не ломается;
- `narrative`: движение меняет понимание;
- `implementation`: реалистично для stack/performance;
- `mobile`: отдельный crop/fallback;
- `accessibility`: reduced motion и keyboard semantics;
- `proof`: before/during/after captured.

Для high-level pass нужно `18/21` и не менее `2` по каждому пункту.

## 9. AURELIA adaptation

В reference hero из ADp4isXOva4 наблюдается последовательность `mountain close-up → forest/lake reveal → wide aerial → page composition`. Для AURELIA это переводится в собственный контракт:

```text
scroll progress 0.00: full island photo, copy readable
scroll progress 0.35: crop approaches shoreline
scroll progress 0.65: water/house detail becomes dominant
scroll progress 0.90: wide route context returns
scroll progress 1.00: CTA/next section is clear
```

Не копируются исходные frames, text, brand или exact layout.
