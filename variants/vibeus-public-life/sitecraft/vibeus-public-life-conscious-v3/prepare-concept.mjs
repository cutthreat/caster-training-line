import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const readJson = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const write = (name, value) => fs.writeFileSync(path.join(root, name), value);
const writeJson = (name, value) => write(name, `${JSON.stringify(value, null, 2)}\n`);
const sha = value => crypto.createHash('sha256').update(value).digest('hex').toUpperCase();

const data = readJson('site-brief.json');

data.stage = 'concept';
data.product_truth = 'VibeUs на собственных публичных поверхностях называет себя социальной платформой для вайбкодеров. Анонимному посетителю доступны каталог проектов, отдельные публичные записи, обсуждения и каталог AI-сервисов. Текущий каталог содержит ранний seed/demo-контент и подтверждает только существование публичных записей, а не масштаб активного сообщества, готовые решения, повторное использование или гарантированный отклик. Новая страница должна объяснять публичную жизнь проекта, показывать реальный продукт до регистрации и вести прямо в семантически проверенные маршруты.';
data.audience = 'Основная аудитория — человек, который собирает проекты с AI и закончил или почти закончил очередную работу, но пока хранит результат в личных ссылках, чатах и файлах. Вторичная — такой же практик, который сначала хочет посмотреть реальные публичные записи, обсуждения и инструменты без регистрации. Оба понимают базовые AI-инструменты, не доверяют громким обещаниям и быстро уходят, если продукт нельзя увидеть.';
data.primary_task = 'За первый экран понять, что VibeUs даёт AI-проекту публичный адрес и соседние маршруты, затем без регистрации открыть текущий каталог или конкретную публичную запись.';
data.page_kind = 'landing';
data.primary_action_id = 'act-catalog-hero';

data.evidence_items = [
  { id: 'ev-home', status: 'confirmed', source_type: 'owned_runtime', source: 'VibeUs public home', locator: 'https://vibeus.app/', scope: 'Owned category statement, public navigation and registration surface captured anonymously', evidence_ceiling: 'owned_runtime', rights_note: 'Owned product surface; use current screenshot and product vocabulary only' },
  { id: 'ev-catalog', status: 'confirmed', source_type: 'owned_runtime', source: 'VibeUs project catalog', locator: 'https://vibeus.app/catalog', scope: 'Anonymous public catalog and project-card destination', evidence_ceiling: 'owned_runtime', rights_note: 'Owned product surface; volatile inventory must not be restated as current without fresh receipt' },
  { id: 'ev-project', status: 'confirmed', source_type: 'owned_runtime', source: 'Launch Content Kit public record', locator: 'https://vibeus.app/works/launch-content-kit-df8941b5', scope: 'Public demo record with title, summary, description, tags/stack and discussion area', evidence_ceiling: 'owned_runtime', rights_note: 'Owned demo surface; label as a demonstration record and do not imply reusable payload' },
  { id: 'ev-discussions', status: 'confirmed', source_type: 'owned_runtime', source: 'VibeUs discussions', locator: 'https://vibeus.app/discussions', scope: 'Anonymous public questions and discussion route', evidence_ceiling: 'owned_runtime', rights_note: 'Owned product surface; do not claim activity volume or guaranteed response' },
  { id: 'ev-tools', status: 'confirmed', source_type: 'owned_runtime', source: 'VibeUs AI services catalog', locator: 'https://vibeus.app/ai-tools', scope: 'Anonymous public AI-service directory', evidence_ceiling: 'owned_runtime', rights_note: 'Owned product surface; do not freeze counts or endorse effectiveness' },
  { id: 'ev-baseline', status: 'confirmed', source_type: 'owned_artifact', source: 'Previous VibeUs public-life landing and cold audit', locator: '../../index.html + proof/project-defense/vibeus-public-life-fullpage.png', scope: 'Previous message stack, product screenshot treatment, long-page rhythm and documented P0 product-proof gap', evidence_ceiling: 'owned_artifact', rights_note: 'Owned prior version; preserve only validated mechanisms, not its section shell or motion signature' }
];

data.assumptions = [
  'Cold traffic benefits from a public browse action before authentication.',
  'The public-project author is the priority emotional entrance; the seeker receives an explicit catalog entrance in the same first screen.',
  'The product owner accepts the current owned wording “социальная платформа для вайбкодеров” as the category signal.'
];
data.unknowns = [
  'Whether the current seed/demo records are temporary onboarding fixtures or the intended public launch inventory.',
  'Which exact contribution fields and publishing controls are available after authentication.',
  'Traffic source, participant comprehension baseline, activation analytics and production conversion effect.',
  'Whether VibeUs has an owner-approved beta/early-access label; the landing therefore does not invent one.'
];
data.references = [
  { url: 'https://vibeus.app/', role: 'category + entrance', observed: 'Owned home calls VibeUs a social platform for vibe coders, exposes Projects and Discussions before account creation, and presents registration on the same public surface.', inference: 'The landing should lead with public project life rather than a ready-solution library or generic AI promise.', rights_note: 'Owned surface; transfer product vocabulary and real destinations, not the existing split-screen layout.', decision_layers_observed: ['system_job', 'audience_entrance', 'first_screen_contract', 'action_destination'] },
  { url: 'https://vibeus.app/catalog', role: 'primary proof + destination', observed: 'Anonymous catalog renders public project records and exact work links; current inventory is small and partly demo/test content.', inference: 'The strongest honest cold action is direct catalog inspection with an adjacent freshness and maturity boundary.', rights_note: 'Owned surface; screenshot is dated and volatile counts are cropped, suppressed or labelled.', decision_layers_observed: ['proof_object', 'risk_trust', 'action_destination', 'operating_layer'] },
  { url: 'https://vibeus.app/works/launch-content-kit-df8941b5', role: 'mechanism + limitation', observed: 'The public demo record exposes a title, short description, project narrative, tags/stack and discussion region but not the promised reusable kit payload.', inference: 'A public-address story is supportable; a reusable-solution story is not.', rights_note: 'Owned demo record; name the demo status and show only fields actually visible.', decision_layers_observed: ['mechanism', 'proof_object', 'risk_trust'] },
  { url: 'https://vibeus.app/discussions', role: 'adjacent continuation', observed: 'Anonymous visitors can see public question threads and topic navigation.', inference: 'Discussion is a real neighbouring route after the project concept is understood, but not evidence that every project receives feedback.', rights_note: 'Owned surface; no activity or response guarantee.', decision_layers_observed: ['value_ladder', 'action_destination', 'risk_trust'] },
  { url: 'https://vibeus.app/ai-tools', role: 'adjacent context', observed: 'Anonymous visitors can browse a directory of AI services with names, descriptions and external action affordances.', inference: 'The tools route broadens product context after project and discussion value, without proving that tools are tied to a given project.', rights_note: 'Owned surface; no frozen count or quality endorsement.', decision_layers_observed: ['value_ladder', 'action_destination'] },
  { url: 'https://cutthreat.github.io/caster-training-line/variants/vibeus-public-life/', role: 'negative fixture + retained mechanism', observed: 'The prior landing makes category, public-before-auth and a real product screen clear, but repeats its proposition across a long sequence and routes the Hero CTA to another explanatory chapter before the live catalog.', inference: 'Retain the public-before-auth and proof-bearing-object mechanisms; replace the shell with a shorter direct-to-destination narrative.', rights_note: 'Owned previous implementation; do not reuse its section order, sticky four-step scene or hero phenomenon.', decision_layers_observed: ['first_screen_contract', 'value_ladder', 'visual_expression_only', 'action_destination'] }
];
data.constraints = [
  'No claim of ready solutions, reusable payload, large active community, faster completion, guaranteed feedback, reputation growth or conversion effect.',
  'Every promoted route must render its expected semantic landmark, not merely HTTP 200.',
  'No fixed inventory counts or activity numbers in copy; current screenshots receive capture/freshness labels.',
  'The first screen contains category, benefit, real product object, direct catalog action and browsing condition without microtext dependence.',
  'Mobile is authored as one vertical decision route with proof directly after the primary action.',
  'Visual metaphor may connect only real public product surfaces and must remain removable without losing product truth.'
];

data.marketing_design = {
  system_job: {
    current_state: 'An AI-assisted project is finished or nearly finished but remains a loose set of chats, screenshots and links visible mainly to its author.',
    target_state: 'The maker understands how VibeUs can give that work a public record and a route to related discussions and tools, while a cold visitor can inspect current public content first.',
    success_signal: 'Without explanation, the visitor calls VibeUs a public/social space for vibe coders, understands that it can hold a project record, and opens the live catalog or a public project before any authentication boundary.'
  },
  priority_segment: 'AI-assisted maker after a first working result and before public sharing',
  decision_context: 'The work exists, but the author has no single public place that explains it; alternatively a peer wants to inspect what is already public before joining.',
  positioning: 'A public place where an AI-made project gains an address, readable context and neighbouring routes to discussion and tools.',
  reason_to_believe: 'Owned anonymous routes expose a real project catalog, public project records, discussions and AI-service directory before login.',
  traffic_intent: 'Direct/share/referral traffic from people who already build with AI and need either a public home for a result or a low-risk way to inspect the platform.',
  cta_consequence: '“Смотреть проекты” leaves the campaign page and opens the current VibeUs catalog; the visitor can browse without submitting data. “Показать свой” reaches the authentication boundary and stops the anonymous journey.',
  measurement_boundary: 'This redesign can prove rendered comprehension proxies, destination continuity and runtime quality only; no claim about participant behavior, adoption or conversion lift.',
  primary_entrance_id: 'entrance-maker',
  audience_entrances: [
    { id: 'entrance-maker', audience: 'AI-assisted maker with a result worth showing', decision_context: 'The project is understandable only inside the author’s private context.', need: 'See a concrete public-record mechanism and a safe path to inspect it before signing in.', first_chapter_id: 'ch-orient', route: ['ch-orient', 'ch-record', 'ch-proof', 'ch-routes', 'ch-join'] },
    { id: 'entrance-explorer', audience: 'Peer exploring public AI projects and creator context', decision_context: 'They want to know whether VibeUs contains inspectable public content now.', need: 'Reach the current catalog quickly and understand the honest evidence boundary.', first_chapter_id: 'ch-orient', route: ['ch-orient', 'ch-proof', 'ch-record', 'ch-routes', 'ch-join'] }
  ],
  first_screen_contract: {
    entrance_id: 'entrance-maker',
    category_signal: 'VibeUs — социальная платформа для вайбкодеров.',
    audience_signal: 'Для людей, которые уже делают проекты с AI и хотят показать результат или посмотреть чужую публичную запись.',
    outcome: 'Проект получает один публичный адрес с доступным контекстом; посетитель может сначала открыть текущий каталог.',
    reason_to_believe: 'В первом экране видна крупная реальная публичная запись VibeUs и прямой маршрут в live-каталог.',
    conditions_status: 'present',
    conditions: ['Текущий публичный каталог ранний и содержит demo/test записи.', 'Публичная запись не равна готовому или переиспользуемому решению.', 'Регистрация начинается только при попытке участия.'],
    primary_action_id: 'act-catalog-hero'
  }
};

data.claims = [
  {
    id: 'clm-category', text: 'VibeUs — социальная платформа для вайбкодеров с публичными разделами проектов, обсуждений и AI-сервисов.', evidence_refs: ['ev-home', 'ev-catalog', 'ev-discussions', 'ev-tools'], evidence_scope: 'Owned anonymous runtime routes and owner-authored category copy; no active-community scale claim.', claim_ceiling: 'owned_runtime', volatility: 'static',
    mechanism: 'The public home and shared navigation expose projects, discussions and AI services under one VibeUs product identity.', claim_chapter_id: 'ch-orient',
    proof_object: { id: 'proof-public-surfaces', kind: 'owned_runtime_routes', inspectable_target: 'https://vibeus.app/ + /catalog + /discussions + /ai-tools', evidence_ref: 'ev-home' },
    risk: { status: 'present', description: 'The social-platform label may be read as proof of a large active community.', trust_object: 'Adjacent first-screen condition limits the claim to currently inspectable public surfaces and avoids scale/activity numbers.', trust_chapter_id: 'ch-orient' }
  },
  {
    id: 'clm-public-record', text: 'A VibeUs project can have a public record with a title, summary, description, tags or stack and a discussion area.', evidence_refs: ['ev-project'], evidence_scope: 'One owned public demo record; payload reuse, working result and universal field completeness are not claimed.', claim_ceiling: 'owned_runtime', volatility: 'static',
    mechanism: 'The work detail route renders project context and discussion in a single public URL.', claim_chapter_id: 'ch-record',
    proof_object: { id: 'proof-project-record', kind: 'owned_product_surface', inspectable_target: 'https://vibeus.app/works/launch-content-kit-df8941b5', evidence_ref: 'ev-project' },
    risk: { status: 'present', description: 'A polished cover can imply that the underlying kit or runnable result is available.', trust_object: 'The proof labels the record as demo/reference-level and explicitly states that no reusable payload is shown.', trust_chapter_id: 'ch-record' }
  },
  {
    id: 'clm-public-catalog', text: 'The current VibeUs project catalog can be opened anonymously before registration.', evidence_refs: ['ev-catalog'], evidence_scope: 'Current anonymous owned runtime; inventory and availability may change.', claim_ceiling: 'owned_runtime', volatility: 'static',
    mechanism: 'The primary action opens /catalog, where the “Каталог проектов” landmark and public project links render without account submission.', claim_chapter_id: 'ch-proof',
    proof_object: { id: 'proof-catalog-destination', kind: 'owned_runtime_destination', inspectable_target: 'https://vibeus.app/catalog', evidence_ref: 'ev-catalog' },
    risk: { status: 'present', description: 'A small seed/demo catalog can be mistaken for a mature library of ready solutions.', trust_object: 'The destination preview is dated, describes current records as public examples, suppresses counts and rejects reusable-solution wording.', trust_chapter_id: 'ch-proof' }
  },
  {
    id: 'clm-adjacent-routes', text: 'VibeUs exposes separate public routes for discussions and an AI-service directory alongside project records.', evidence_refs: ['ev-discussions', 'ev-tools'], evidence_scope: 'Owned anonymous runtime routes; no claim that each project automatically links to a discussion or tool.', claim_ceiling: 'owned_runtime', volatility: 'static',
    mechanism: 'Shared public navigation leads to /discussions and /ai-tools; each renders its own semantic landmark.', claim_chapter_id: 'ch-routes',
    proof_object: { id: 'proof-adjacent-destinations', kind: 'owned_runtime_routes', inspectable_target: 'https://vibeus.app/discussions + https://vibeus.app/ai-tools', evidence_ref: 'ev-discussions' },
    risk: { status: 'present', description: 'Neighbouring routes may be interpreted as a guaranteed workflow or active response loop.', trust_object: 'The chapter calls them separate continuation choices and makes no feedback, integration or activity promise.', trust_chapter_id: 'ch-routes' }
  }
];

data.actions = [
  { id: 'act-catalog-hero', label: 'Смотреть проекты', consequence: 'Open the current public project catalog without submitting data.', destination: 'https://vibeus.app/catalog', chapter_id: 'ch-orient', earned_by_delta_id: 'delta-orient-action', destination_receipt: { expected_landmark: 'Каталог проектов', recovery: 'Browser back returns to the VibeUs landing', owner: 'VibeUs product owner' } },
  { id: 'act-auth-hero', label: 'Показать свой', consequence: 'Reach the VibeUs authentication boundary; no credentials are entered during QA.', destination: 'https://vibeus.app/auth', chapter_id: 'ch-orient', earned_by_delta_id: 'delta-orient-contribution', destination_receipt: { expected_landmark: 'Войти or account creation surface', recovery: 'Browser back returns to the VibeUs landing', owner: 'VibeUs product owner' } },
  { id: 'act-open-record', label: 'Открыть пример записи', consequence: 'Open the public Launch Content Kit demo record.', destination: 'https://vibeus.app/works/launch-content-kit-df8941b5', chapter_id: 'ch-record', earned_by_delta_id: 'delta-record-proof', destination_receipt: { expected_landmark: 'Launch Content Kit', recovery: 'К каталогу or browser back', owner: 'VibeUs product owner' } },
  { id: 'act-catalog-proof', label: 'Открыть текущий каталог', consequence: 'Leave the proof preview for the live project catalog.', destination: 'https://vibeus.app/catalog', chapter_id: 'ch-proof', earned_by_delta_id: 'delta-proof-current', destination_receipt: { expected_landmark: 'Каталог проектов', recovery: 'Browser back returns to the proof chapter', owner: 'VibeUs product owner' } },
  { id: 'act-discussions', label: 'Открыть обсуждения', consequence: 'Open public VibeUs discussions.', destination: 'https://vibeus.app/discussions', chapter_id: 'ch-routes', earned_by_delta_id: 'delta-routes-discuss', destination_receipt: { expected_landmark: 'Обсуждения', recovery: 'Browser back returns to the routes chapter', owner: 'VibeUs product owner' } },
  { id: 'act-tools', label: 'Найти AI-инструмент', consequence: 'Open the public VibeUs AI-service directory.', destination: 'https://vibeus.app/ai-tools', chapter_id: 'ch-routes', earned_by_delta_id: 'delta-routes-tools', destination_receipt: { expected_landmark: 'Каталог AI сервисов', recovery: 'Browser back returns to the routes chapter', owner: 'VibeUs product owner' } },
  { id: 'act-auth-final', label: 'Дать проекту адрес', consequence: 'Reach authentication after the public product and limits have been shown.', destination: 'https://vibeus.app/auth', chapter_id: 'ch-join', earned_by_delta_id: 'delta-join-earned', destination_receipt: { expected_landmark: 'Войти or account creation surface', recovery: 'Browser back returns to the final chapter', owner: 'VibeUs product owner' } }
];

data.decision_spine = {
  chapters: [
    { id: 'ch-orient', entry_question: 'Что это и почему мне не стоит закрывать страницу?', role: 'first_screen_contract', decision_deltas: [
      { id: 'delta-orient-category', kind: 'orientation', statement: 'VibeUs is a social/public space for people who make projects with AI.' },
      { id: 'delta-orient-action', kind: 'action', statement: 'A cold visitor can inspect the current project catalog immediately and without form submission.' },
      { id: 'delta-orient-contribution', kind: 'condition', statement: 'Publishing is a separate contribution route that begins only after authentication.' }
    ], claim_ids: ['clm-category'], action_ids: ['act-catalog-hero', 'act-auth-hero'], exit_understanding: 'I can give an AI-made project a public place or first inspect what VibeUs currently exposes.', why_continue: 'I still need to see what a public record actually contains and whether the claim is real.' },
    { id: 'ch-record', entry_question: 'What becomes public besides a cover image?', role: 'mechanism', decision_deltas: [
      { id: 'delta-record-mechanism', kind: 'mechanism', statement: 'One public URL can keep the visible project title, summary, narrative, stack and discussion region together.' },
      { id: 'delta-record-proof', kind: 'proof', statement: 'A labelled demo record can be opened and inspected at exactly the evidence level the landing claims.' }
    ], claim_ids: ['clm-public-record'], action_ids: ['act-open-record'], exit_understanding: 'The mechanism is a public project record, not a downloadable ready solution.', why_continue: 'I want to verify that such records exist in the current catalog and understand its maturity.' },
    { id: 'ch-proof', entry_question: 'Can I inspect the current product before joining?', role: 'proof_object', decision_deltas: [
      { id: 'delta-proof-current', kind: 'proof', statement: 'The live anonymous catalog is the strongest current product proof and is reached directly.' },
      { id: 'delta-proof-boundary', kind: 'risk_reduction', statement: 'The current catalog is presented as changing early inventory rather than a mature library of reusable solutions.' }
    ], claim_ids: ['clm-public-catalog'], action_ids: ['act-catalog-proof'], exit_understanding: 'The catalog is real and publicly inspectable, but its current records have a limited evidence level.', why_continue: 'I can now decide whether adjacent discussions or tools add value to my situation.' },
    { id: 'ch-routes', entry_question: 'What can I do around a project besides view it?', role: 'value_ladder', decision_deltas: [
      { id: 'delta-routes-discuss', kind: 'value', statement: 'Public discussions provide a separate place to read questions and experience without promising a response to every project.' },
      { id: 'delta-routes-tools', kind: 'value', statement: 'The AI-service directory provides a separate route to discover tools without implying project-level integration.' }
    ], claim_ids: ['clm-adjacent-routes'], action_ids: ['act-discussions', 'act-tools'], exit_understanding: 'VibeUs is more than one catalog, but each adjacent route has an honest independent job.', why_continue: 'The public product is now visible, so I can make an informed contribution decision.' },
    { id: 'ch-join', entry_question: 'Why should I create an account now?', role: 'action_destination', decision_deltas: [
      { id: 'delta-join-earned', kind: 'risk_reduction', statement: 'Authentication is asked only after the visitor has seen the public product, its routes and its limits.' }
    ], claim_ids: [], action_ids: ['act-auth-final'], exit_understanding: 'I know what is public now and what the account boundary is for.', why_continue: 'The page ends at the real authentication handoff; no further persuasion is needed.' }
  ],
  desktop_sequence: ['ch-orient', 'ch-record', 'ch-proof', 'ch-routes', 'ch-join'],
  mobile_sequence: ['ch-orient', 'ch-record', 'ch-proof', 'ch-routes', 'ch-join'],
  mobile_reauthoring_reason: 'Mobile preserves the decision order but places the primary action before the proof preview, turns side-by-side anatomy into a single reading column, and reflows the route continuum vertically so no screenshot or CTA becomes a compressed desktop residue.'
};

data.hypothesis = {
  visitor_change: 'For an AI-assisted maker with a finished or nearly finished project, the page will replace the vague idea of “community” with the concrete understanding that VibeUs can give the work one public address and can be inspected before login.',
  visual_law: 'A private fragment becomes a stable public address: every chapter may add only one inspectable layer of context, and every connecting line must terminate in a real VibeUs surface or action.',
  dramaturgy: 'Scattered private output enters the first screen, resolves into one readable public record, is verified against the live catalog, branches into two honest adjacent routes, and ends at an earned authentication boundary.',
  identity_deltas: [
    'Replace code rain and cosmic phenomena with a project-specific transformation from loose work fragments into one readable public address.',
    'Use an editorial evidence rail instead of the previous alternating campaign sections and four-step sticky carousel.',
    'Represent project, discussion and tool routes as one source-linked continuum whose motion follows destination meaning rather than decorative spectacle.',
    'Author mobile as an evidence-first vertical sequence with the real record immediately after the primary action.'
  ]
};

data.visual_foundations = {
  reading_order: 'Upper-left category and human consequence → four-line desktop H1 → direct public action → large readable product record → adjacent evidence condition. Later chapters alternate statement mass with one inspectable object, never two competing dominants.',
  axes: 'Twelve-column desktop shell with a persistent public-address rail; text aligns to columns 1–6 and proof may occupy 6–12. Mobile uses one content axis with route markers on the left edge.',
  grid: 'Desktop 12 columns, 24px gutters, 40–56px outer margin; tablet 8 columns; mobile 4 columns with 18–20px margin. No detached microcopy outside these anchors.',
  spacing_roles: '24px local grouping, 48–64px component separation, 112–160px chapter change. Quiet space must separate message from proof or mark a route transition, never create an empty screen.',
  type_geometry: 'Onest with compact 800-weight display, 600-weight labels and 400-weight body. The accepted H1 composes as four short desktop lines and a bounded mobile stack; body measure is 52–68 characters; operational conditions never fall below 14px on desktop or mobile.',
  mass_map: 'Hero 47/53 message-to-proof; record chapter 40/60; proof chapter is product-dominant; routes use three full-width editorial rows; final chapter returns to one dominant sentence and one action group.',
  media_direction: 'Only fresh owned VibeUs runtime screenshots and literal UI fragments. Every screenshot receives route, capture date and evidence-level label; no generated metaphor or fictional interface.',
  mobile_transform: 'Hero copy and primary action precede a 72–80vw readable record crop; anatomy fields become one sequence; route rows stack with direct labels; decorative rail becomes a static border; no horizontal sticky scene.'
};

data.composition = {
  chapters: [
    { id: 'ch-orient', dominant_mass: 'Accepted four-line desktop outcome H1', support_mass: 'Real public project record at readable scale', quiet_mass: 'One short product condition beside the proof', entry_transition: 'Loose fragments align into the public-address rail', exit_transition: 'The record expands to reveal actual fields', mobile_transform: 'Copy → primary CTA → browse condition → record crop; secondary auth follows proof', failure_condition: 'The screenshot looks like decoration, the category is unclear, or auth outranks public inspection.' },
    { id: 'ch-record', dominant_mass: 'Public-record anatomy expressed as one structured editorial ledger', support_mass: 'One fresh project screenshot', quiet_mass: 'Adjacent evidence-level boundary', entry_transition: 'Hero record loses perspective and becomes a flat inspectable object', exit_transition: 'The object resolves into the current catalog route', mobile_transform: 'Fields and screenshot alternate in one column with the boundary immediately after the cover', failure_condition: 'The composition implies reusable content or makes the fields too small to inspect.' },
    { id: 'ch-proof', dominant_mass: 'Large current catalog surface and direct action', support_mass: 'Short maturity/freshness statement', quiet_mass: 'Capture date and demo/reference label', entry_transition: 'One record is located inside the broader live catalog', exit_transition: 'Catalog navigation becomes the route continuum', mobile_transform: 'Headline and condition precede a vertically cropped but labelled catalog view and direct button', failure_condition: 'Counts look current without a receipt, or the action still routes to an explanatory anchor.' },
    { id: 'ch-routes', dominant_mass: 'Three destination rows: project, discussion, tool', support_mass: 'Literal route preview for the active row', quiet_mass: 'One-line boundary for each route', entry_transition: 'The public-address rail branches only at verified destinations', exit_transition: 'Branches return to one contribution choice', mobile_transform: 'Rows stack as an ordered list and previews appear directly under their labels', failure_condition: 'The routes compete like generic feature cards or imply an automatic feedback loop.' },
    { id: 'ch-join', dominant_mass: 'Earned final statement and contribution action', support_mass: 'Low-commitment catalog alternative', quiet_mass: 'Authentication consequence and legal links', entry_transition: 'The separate routes converge at the account boundary', exit_transition: 'Normal product handoff with no cinematic promise', mobile_transform: 'One sentence, one primary contribution button, one catalog text link, then legal/footer', failure_condition: 'The final CTA pressures registration or repeats the Hero without a new reason.' }
  ],
  responsive_transform: 'Desktop uses asymmetry and one horizontal destination continuum controlled by native buttons; mobile reauthors it as a vertical list with all destinations and proof available without lateral gesture. Reduced motion keeps every source/destination relation visible as static lines.',
  proof_cadence: 'Hero product record → record anatomy and exact demo route → live catalog and direct route → public discussions/tools destinations → auth handoff. Every persuasive increase is followed by proof or a boundary before the next action.'
};

data.operating_layer = {
  content_owner: 'VibeUs product owner', measurement_owner: 'Unassigned; destination receipts only until owner is named', supported_locales: ['ru'], review_cadence: 'Before publication and whenever public route landmarks, screenshots or content model change', dynamic_missing_policy: 'Suppress counts and current-status assertions; show an explicit unavailable/freshness label instead of zero.', destination_receipt_policy: 'Require HTTP success, expected rendered landmark, absence of semantic error and a recovery route for every promoted destination.', degraded_state_fixture_policy: 'Media-off keeps literal route labels, project-field ledger, evidence boundary and real links; unavailable product screenshot may not be replaced by a fictional UI.'
};

const desktopSketch = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1440" height="2860" viewBox="0 0 1440 2860" role="img" aria-labelledby="title desc">
  <title id="title">VibeUs semantic sketch, desktop</title>
  <desc id="desc">Grayscale click-through sketch with five decision chapters and real draft copy.</desc>
  <style>
    text{font-family:Arial,sans-serif;fill:#151515}.label{font-size:15px;font-weight:700;letter-spacing:1.4px}.h1{font-size:74px;font-weight:800}.h2{font-size:50px;font-weight:800}.body{font-size:22px}.small{font-size:16px}.micro{font-size:13px}.button{font-size:18px;font-weight:700;fill:#fff}.line{stroke:#292929;stroke-width:2}.muted{fill:#6c6c6c}.panel{fill:#efefef;stroke:#202020;stroke-width:2}.dark{fill:#191919}.white{fill:#fff}.chip{fill:#d7d7d7;stroke:#555}
  </style>
  <rect width="1440" height="2860" fill="#f7f7f4"/>
  <rect x="0" y="0" width="1440" height="760" fill="#e5e5e2"/>
  <text x="60" y="55" class="label">VIBEUS</text><text x="1120" y="55" class="small">Проекты   Обсуждения   AI-сервисы   Войти</text>
  <text x="60" y="145" class="label">СОЦИАЛЬНАЯ ПЛАТФОРМА ДЛЯ ВАЙБКОДЕРОВ</text>
  <text x="60" y="235" class="h1">Сделали с AI?</text><text x="60" y="320" class="h1">Дайте проекту</text><text x="60" y="405" class="h1">публичную жизнь.</text>
  <text x="60" y="470" class="body">Покажите работу, соберите её контекст по одному адресу</text><text x="60" y="502" class="body">и откройте разговор. Или сначала посмотрите, что уже публикуют.</text>
  <a xlink:href="https://vibeus.app/catalog"><rect x="60" y="540" width="215" height="58" class="dark"/><text x="88" y="577" class="button">Смотреть проекты ↗</text></a>
  <a xlink:href="https://vibeus.app/auth"><text x="310" y="577" class="small">Показать свой →</text></a>
  <text x="60" y="635" class="small">Каталог открывается без регистрации. Текущий состав меняется.</text>
  <rect x="755" y="105" width="620" height="525" class="panel"/>
  <text x="785" y="140" class="label">РЕАЛЬНАЯ ПУБЛИЧНАЯ ЗАПИСЬ / DEMO</text>
  <rect x="785" y="170" width="560" height="320" fill="#fff" stroke="#777"/>
  <text x="820" y="220" class="small">Launch Content Kit</text><text x="820" y="255" class="body">Контент-набор для первого</text><text x="820" y="285" class="body">публичного показа проекта.</text>
  <rect x="820" y="325" width="490" height="110" fill="#d3d3d3"/><text x="840" y="380" class="small">ОПИСАНИЕ / СТЕК / ОБСУЖДЕНИЕ</text>
  <text x="785" y="535" class="small">Публичная запись, не готовое решение.</text><text x="785" y="565" class="small">Переиспользуемый payload не показан.</text>
  <line x1="720" y1="80" x2="720" y2="2780" class="line" stroke-dasharray="7 10"/>

  <text x="60" y="850" class="label">ЧТО ДЕРЖИТ ОДИН ПУБЛИЧНЫЙ АДРЕС</text>
  <text x="60" y="930" class="h2">Не только обложку.</text><text x="60" y="990" class="h2">Контекст вокруг работы.</text>
  <text x="60" y="1055" class="body">Текущая demo-запись показывает ровно тот уровень,</text><text x="60" y="1087" class="body">который можно проверить публично.</text>
  <rect x="790" y="820" width="560" height="390" class="panel"/>
  <text x="820" y="865" class="label">ПУБЛИЧНАЯ ЗАПИСЬ</text>
  <line x1="820" y1="900" x2="1320" y2="900" class="line"/><text x="820" y="935" class="small">Название и краткое описание</text>
  <line x1="820" y1="965" x2="1320" y2="965" class="line"/><text x="820" y="1000" class="small">Описание идеи проекта</text>
  <line x1="820" y1="1030" x2="1320" y2="1030" class="line"/><text x="820" y="1065" class="small">Теги и стек</text>
  <line x1="820" y1="1095" x2="1320" y2="1095" class="line"/><text x="820" y="1130" class="small">Обсуждение и публичные действия</text>
  <a xlink:href="https://vibeus.app/works/launch-content-kit-df8941b5"><text x="790" y="1255" class="small">Открыть пример записи ↗</text></a>
  <text x="60" y="1225" class="small">Граница: на странице нет доказанного файла набора или reusable payload.</text>

  <rect x="0" y="1340" width="1440" height="640" fill="#d8d8d5"/>
  <text x="60" y="1420" class="label">СНАЧАЛА ПРОВЕРЬТЕ ПРОДУКТ</text>
  <text x="60" y="1500" class="h2">Текущий каталог.</text><text x="60" y="1560" class="h2">Без мифа о масштабе.</text>
  <text x="60" y="1625" class="body">Публичные записи открываются без аккаунта.</text><text x="60" y="1657" class="body">Состав ранний и меняется.</text><text x="60" y="1689" class="body">Он не обещает готовых решений.</text>
  <rect x="620" y="1400" width="755" height="425" class="panel"/><text x="650" y="1440" class="label">LIVE / CATALOG / СНИМОК ДАТИРОВАН</text>
  <rect x="650" y="1470" width="695" height="295" fill="#fff" stroke="#777"/><text x="680" y="1525" class="h2">Каталог проектов</text><rect x="680" y="1570" width="200" height="145" class="chip"/><rect x="900" y="1570" width="200" height="145" class="chip"/><rect x="1120" y="1570" width="200" height="145" class="chip"/>
  <a xlink:href="https://vibeus.app/catalog"><rect x="60" y="1735" width="270" height="58" class="dark"/><text x="88" y="1772" class="button">Открыть текущий каталог ↗</text></a>

  <text x="60" y="2080" class="label">ПОСЛЕ ПРОЕКТА / ТРИ ОТДЕЛЬНЫХ МАРШРУТА</text>
  <text x="60" y="2160" class="h2">Показать. Обсудить.</text><text x="60" y="2220" class="h2">Найти инструмент.</text>
  <line x1="60" y1="2290" x2="1375" y2="2290" class="line"/>
  <text x="60" y="2340" class="label">ПРОЕКТЫ</text><text x="300" y="2340" class="body">Публичные записи и их контекст</text><a xlink:href="https://vibeus.app/catalog"><text x="1180" y="2340" class="small">Каталог ↗</text></a>
  <line x1="60" y1="2380" x2="1375" y2="2380" class="line"/>
  <text x="60" y="2430" class="label">ОБСУЖДЕНИЯ</text><text x="300" y="2430" class="body">Отдельные публичные вопросы и опыт</text><a xlink:href="https://vibeus.app/discussions"><text x="1180" y="2430" class="small">Обсуждения ↗</text></a>
  <line x1="60" y1="2470" x2="1375" y2="2470" class="line"/>
  <text x="60" y="2520" class="label">AI-СЕРВИСЫ</text><text x="300" y="2520" class="body">Каталог инструментов без обещания эффективности</text><a xlink:href="https://vibeus.app/ai-tools"><text x="1180" y="2520" class="small">Найти инструмент ↗</text></a>
  <line x1="60" y1="2560" x2="1375" y2="2560" class="line"/>

  <rect x="0" y="2640" width="1440" height="220" fill="#191919"/>
  <text x="60" y="2710" class="label white">СНАЧАЛА ПОСМОТРИТЕ. ПОТОМ РЕШИТЕ, ЧТО ДОБАВИТЬ.</text>
  <text x="60" y="2780" class="h2 white">Дайте проекту адрес.</text>
  <a xlink:href="https://vibeus.app/auth"><rect x="1045" y="2720" width="280" height="62" fill="#fff"/><text x="1080" y="2760" class="small">Перейти к VibeUs ↗</text></a>
</svg>`;

write('semantic-sketch.svg', desktopSketch);
const semanticHtml = fs.readFileSync(path.join(root, 'semantic-sketch.html'));
data.attention.semantic.source_artifact_path = 'semantic-sketch.html';
data.attention.semantic.source_sha256 = sha(semanticHtml);
data.attention.semantic.width = 1440;
data.attention.semantic.height = 900;
data.attention.desktop_route = 'category → outcome → public catalog action → real demo record → honest catalog proof → separate discussion/tool routes → earned auth';
data.attention.mobile_route = 'category → outcome → primary public action → browse condition → record proof → catalog proof → vertical routes → earned auth';

write('CONCEPT-ROUTES.md', `# Concept routes locked before styling\n\n## A — Public trace (selected)\n\nA finished AI-assisted work moves from private fragments into one public record, then into inspectable catalog, discussion and tool routes. Strongest fit with owned product truth and mobile sequence.\n\n## B — Three honest entrances\n\nThe Hero branches immediately into Projects, Discussions and AI tools. Rejected as the primary composition because three equal choices dilute the public-project system job before it is understood. Retained as the route chapter mechanism.\n\n## C — Open index\n\nThe current catalog begins in the Hero as an editorial index. Truthful, but the early seed/demo inventory would dominate the emotional proposition and reduce the author entrance to a directory. Retained as the proof chapter mechanism.\n\n## Selection matrix\n\n| Route | Clarity | Truth | Distinctiveness | Mobile | Total |\n|---|---:|---:|---:|---:|---:|\n| Public trace | 9 | 9 | 9 | 9 | 36 |\n| Three entrances | 8 | 9 | 8 | 8 | 33 |\n| Open index | 9 | 10 | 7 | 9 | 35 |\n\nThe selected route is blocked from visual design until semantic Attention and blind Human-QA pass.\n`);

write('BRIEF.md', `# VibeUs conscious redesign — autonomous brief\n\n## Product truth\n\nVibeUs publicly exposes projects, discussions and AI services for vibe coders. Current records prove a public reference layer, not a library of ready reusable solutions or a large active community.\n\n## System job\n\nPrivate AI-assisted result → one public project record and inspectable product route → visitor opens catalog before authentication.\n\n## Primary task\n\nUnderstand the public-project mechanism and open the current catalog without registration.\n\n## Unknowns\n\nAuthenticated publishing fields, demo intent, acquisition source, analytics and participant evidence remain unknown.\n`);
write('REFERENCE-MAP.md', `# Reference map\n\nOnly owned product surfaces are used as mechanism and proof sources: home, project catalog, one labelled demo record, discussions, AI services and the previous landing as a negative fixture. No third-party donor supplies the shell, sequence, palette or motion. See canonical references in site-brief.json.\n`);
write('MARKETING-DESIGN-CONTRACT.md', `# Marketing to design contract\n\nThe Hero earns a direct anonymous catalog action with a real product record and an adjacent maturity boundary. “Ready solutions”, scale, time saving, guaranteed feedback and conversion effect are outside the claim ceiling.\n`);
write('DESIGN-HYPOTHESIS.md', `# Design hypothesis\n\nA private fragment becomes a stable public address. Every chapter adds one inspectable context layer, and every connecting line terminates in a real VibeUs surface or action. Visual spectacle cannot create an independent proof lane.\n`);
write('VISUAL-FOUNDATIONS.md', `# Visual foundations\n\nThe concept uses a 12-column editorial rail, evidence-sized media, semantic spacing and an independently authored one-column mobile route. These are hypotheses only until the sketch, golden slice and runtime gates pass.\n`);
write('COMPOSITION-CONTRACT.md', `# Composition and Decision Spine contract\n\nFive chapters map one-to-one: orientation, public-record mechanism, current-catalog proof, separate adjacent routes, earned authentication. Each has one decision delta and a declared mobile transform/failure condition in site-brief.json.\n`);
write('HUMAN-QA-ALIGNMENT.md', `# Human-QA alignment\n\nBlocked until the rendered grayscale sketch completes independent target-user traces. Hidden intent and predicted attention route must not enter the observer packet.\n`);
write('PATTERN-SELECTION.md', `# Pattern selection\n\nBlocked until semantic sketch and composition pass. The selected concept is custom; library patterns may support foundations and bounded route/proof mechanics only.\n`);
write('PROOF-PLAN.md', `# Proof plan\n\nNot yet active. Proof checks will be bound after the golden slice preserves the concept and direct destination contract.\n`);

writeJson('site-brief.json', data);
console.log(JSON.stringify({ stage: data.stage, siteBrief: path.join(root, 'site-brief.json'), semanticSketchSha256: data.attention.semantic.source_sha256 }, null, 2));
