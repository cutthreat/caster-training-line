# Video Review — _rTPBC3RnRI

Source: https://www.youtube.com/watch?v=_rTPBC3RnRI  
Title: `I Made Fable 5 and GPT 5.6 Build the Same App (RAW RESULTS)`  
Channel: `Jay E | RoboNuggets`  
Duration: `22:14`  
Upload date from metadata: `2026-07-11`

## Evidence gathered

- Metadata: `video-intel/yt-rTPBC3RnRI/sources/metadata.json`
- Captions: `video-intel/yt-rTPBC3RnRI/transcripts/transcript.en-orig.vtt`
- Local video: `video-intel/yt-rTPBC3RnRI/media/source.webm`
- Frames/contact sheet: `video-intel/yt-rTPBC3RnRI/frames/contact-sheet.jpg`

Media, raw captions, frames and metadata are local evidence and are intentionally ignored by git.

## Chapter map

| Time | Segment | Observed topic |
|---|---|---|
| 00:00 | Intro | Same prompts to Fable 5 and GPT 5.6 across app/site/game tasks |
| 00:22 | New Models | Model family naming and role framing |
| 01:02 | Benchmark Results | Independent benchmark framing, then practical test preference |
| 02:18 | Test 1 | Same prompt, same effort level, one-pass comparison |
| 06:25 | Test 2 | SaaS / static website output, design quality and AI-copy issues |
| 14:28 | Test 3 | 3D game as code + visual taste test |
| 18:09 | Bonus Test | Rule-based game test |
| 19:14 | Thoughts, Tips | Nuanced verdict: depends on task, design, coding and steering |

## Useful patterns for Caster

### 1. Same-task model bake-off

The useful move is not the model ranking. The useful move is the evaluation structure:

```text
same prompt
same effort level
one raw pass
side-by-side output
task-specific verdict
```

Caster adaptation: before a high-stakes visual/product build, compare candidate agents or strategies on the same source-bound task packet.

Anton risk: a visually stronger result can still fail if it lacks trust, states, CTA consequence or truthful receipt.

### 2. Raw output as diagnostic evidence

The author treats one-prompt output as a way to see baseline capability. That is useful for us only as a diagnostic pass, not as production proof.

Caster adaptation: mark first-pass outputs as `raw_once`, score them, then run one controlled steering pass only if the raw result is promising.

Anton risk: raw demos often hide fake actions, weak forms, generic claims and missing recovery paths.

### 3. Steering cost matters

The final segment says the answer depends on what you are after and that some outputs can get there with more steering. This is directly useful for our contour.

Caster adaptation: add `steering_cost` to agent/model selection. A more impressive first screen loses if it takes too many corrections to become source-bound and verified.

Anton risk: steering can improve visuals while leaving product integrity broken unless trust and action states are part of the scoring.

### 4. Design and code must be scored separately

The game tests are useful because they expose that a system can be stronger in coding while another may have stronger visual flare.

Caster adaptation: do not collapse verdict into one score. Score `visual_taste`, `product_fit`, `implementation_quality`, `motion_judgment`, `mobile_reauthoring`, `truthfulness`, and `proofability`.

Anton risk: a technically working build is still not ready if the user cannot understand the route or outcome.

## What not to import

- Do not import the exact UI designs shown in the video.
- Do not import the author's model ranking as a universal rule.
- Do not treat benchmark claims in the video as our source truth for model procurement or production routing.
- Do not treat one-shot generation as acceptable delivery quality.

## Integration decision

Status: `pattern_extracted`.

Promoted into Caster contour as `Model Bake-off Method`:

- same task packet;
- raw pass;
- scoring matrix;
- steering cost;
- Caster/Anton split;
- promotion threshold.

Production use requires running the bake-off on our own task packet and verifying outputs in browser.
