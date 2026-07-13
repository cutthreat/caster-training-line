# Video Review — JIXS04GejZI

Source: https://www.youtube.com/watch?v=JIXS04GejZI  
Title: `Я создал ИИ-ассистента, который ведет все мои дела (сэкономил 100к)`  
Channel: `Михаил Тимочко`  
Evidence level: `transcript_and_thumbnail`

## Evidence gathered

- Russian captions: `video-intel/yt-JIXS04GejZI/transcripts/transcript.ru.vtt`
- Thumbnail: `video-intel/yt-JIXS04GejZI/frames/thumbnail.jpg`
- oEmbed title/channel proof via YouTube public endpoint

Limit: full metadata/media download timed out in the current runtime. This is not frame-by-frame visual proof.

## Time-aligned findings

| Time | Observed topic |
|---|---|
| 00:00 | Assistant handles planning, calendar, task lists and meeting notes |
| 02:00 | Core pain: tasks scattered across notes, chats, apps and memory |
| 04:00 | Repeated manual cleanup cycle fails after a few weeks |
| 06:00 | Assistant tracks follow-ups from calls and expected deliverables |
| 08:00 | Tool setup / ChatGPT-like interface context |
| 10:00 | Notion and Google Calendar as task/calendar storage |
| 12:00 | Project context vs generic chat: project remembers instructions and context |
| 14:00 | Voice intake is easier for large personal/work context |
| 16:00 | Multi-stage setup: projects, priorities, Notion, daily rhythm |
| 18:00 | Direction/project/task hierarchy from raw voice notes |
| 20:00 | Ongoing voice updates change tasks, add projects and update statuses |
| 22:00 | Call transcripts become tasks, deadlines and meeting notes |
| 24:00 | One-time context dump reduces future manual sorting |

## Useful patterns for Caster

### 1. Scattered-context problem

The main problem is not lack of AI, but scattered tasks across notes, chats, calls and memory.

Caster adaptation: our contour should treat chat messages, videos, Mobbin findings, copy notes and browser proof as source types entering one governed inbox.

### 2. Voice/call intake

Voice is useful for large context dumps, but only after normalization.

Caster adaptation: voice or transcript input must be converted into directions, projects, tasks, owners, deadlines and proof requirements.

### 3. Project context beats generic chat

The video distinguishes generic chat from a project that remembers instructions and context.

Caster adaptation: Caster execution should use project rules, memory and source refs instead of relying on the visible chat alone.

### 4. Daily rhythm

The recurring rhythm matters: review open tasks, stale items, calendar conflicts and suggested help.

Caster adaptation: use compact daily/periodic checks with 2-5 concrete next actions, not full backlog dumps.

## Integration decision

Status: `pattern_extracted`.

Promoted into Caster contour as [Assistant Operations Contour Method](../../../ASSISTANT_OPERATIONS_CONTOUR_METHOD.md).
