# Video timecode ledger template

Копировать одну строку на каждый meaningful segment. Не объединять в одну строку длинный участок, где меняется экран, код или результат.

| ID | Timecode | Transcript ref / claim | Frame refs | Code / screen ref | Visible action | Result state | Failure / tradeoff | Reusable pattern | Caster adaptation | Anton risk | Proof required | Evidence level | Confidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| V-001 | 00:00–00:00 |  |  |  |  |  |  |  |  |  |  |  |  |

## Segment rules

- `Timecode`: exact `HH:MM:SS–HH:MM:SS`, not «примерно в середине»;
- `Transcript ref / claim`: короткая парафраза, не длинная цитата;
- `Frame refs`: before/during/after для motion или code/UI change;
- `Code / screen ref`: filename, component, visible prompt, command или `not_visible`;
- `Result state`: что реально изменилось в preview;
- `Evidence level`: `exact`, `category`, `inferred`, `promotion`, `opinion`;
- `Confidence`: `high`, `medium`, `low`;
- если поле неизвестно, писать `unknown`, не додумывать.

## End-of-video synthesis

```text
source:
segments_count:
chapters_covered:
code_events_count:
ui_state_events_count:
failure_events_count:
strongest_patterns:
patterns_rejected:
open_questions:
recommended_adaptations:
proof_gaps:
promotion_status:
```
