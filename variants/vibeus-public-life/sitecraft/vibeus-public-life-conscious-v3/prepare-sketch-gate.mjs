import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const writeJson = (name, value) => fs.writeFileSync(path.join(root, name), `${JSON.stringify(value, null, 2)}\n`);
const shaFile = name => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, name))).digest('hex').toUpperCase();

const persona = {
  persona_id: 'maker-after-first-result',
  role_and_context: 'Самостоятельный разработчик или дизайнер, который собирает небольшие продукты с AI и недавно довёл один из них до состояния, которое уже можно показывать.',
  current_goal: 'Понять, есть ли здесь полезное публичное место для своей работы или чужих примеров, не регистрируясь до того, как станет ясна ценность.',
  frustrations_before_visit: [
    'Результат разложен по ссылкам, скриншотам и перепискам, поэтому его трудно объяснить другому человеку.',
    'AI умеет многое, но доведение проекта до понятного результата требует усилий и внешнего взгляда.',
    'Не доверяет пустым community-обещаниям, демо-каталогам и регистрации до показа продукта.'
  ],
  knowledge_before_visit: 'Перешёл по ссылке с названием VibeUs. Не знает функций, размера аудитории, содержания каталога и ожидаемого действия.',
  digital_confidence: 'high',
  time_pressure: 'medium',
  decision_style: 'skeptical'
};

const intent = {
  screen_id: 'semantic-sketch-first-screen',
  target_persona_id: persona.persona_id,
  user_goal: 'Понять категорию, реальную публичную пользу и безопасный первый шаг до регистрации.',
  business_goal: 'Довести подходящего холодного посетителя до текущего каталога; вклад автора оставить вторичным до продуктового доказательства.',
  must_notice_in_order: ['Социальная платформа для вайбкодеров', 'Сделали с AI? Дайте проекту публичную жизнь.', 'Смотреть проекты', 'Реальная публичная запись / demo', 'Каталог открывается без регистрации'],
  must_understand: ['VibeUs даёт AI-проекту публичную запись с контекстом.', 'Каталог можно посмотреть до регистрации.', 'Показанная запись демонстрационная и не является готовым переиспользуемым решением.'],
  desired_action: 'Нажать “Смотреть проекты” и перейти в текущий каталог.',
  acceptable_alternatives: ['Прокрутить к анатомии публичной записи.', 'Остановиться из-за раннего demo-состава после правильного понимания продукта.'],
  proof_needed_before_action: ['Крупный реальный продуктовый объект.', 'Явная demo/reference boundary.', 'Прямое условие просмотра без регистрации.'],
  intentional_disqualifiers: ['Посетитель ищет готовые downloadable решения.', 'Посетитель требует доказанный масштаб или гарантированный отклик.']
};

writeJson('TARGET-PERSONA.json', persona);
writeJson('DESIGN-INTENT-HIDDEN.json', intent);

const audit = {
  schema: 'attention_architecture_audit.v1',
  run_id: 'vibeus-public-life-conscious-v3-semantic-20260720',
  surface: { name: 'VibeUs conscious semantic sketch', stage: 'sketch', width: 1440, height: 900 },
  evidence: {
    level: 'expert_proxy',
    method: 'Rendered grayscale HTML inspection plus browser geometry at 1440x900 and 390x844',
    source: 'semantic-sketch.html',
    limitations: ['Not eye tracking or participant evidence', 'Media remains a literal placeholder at this stage', 'Mobile and desktop predictions require blind Human-QA comparison']
  },
  intent: {
    user_goal: intent.user_goal,
    business_goal: intent.business_goal,
    decision_moment: 'Decide whether to inspect the current public catalog before any authentication boundary.',
    intended_route: intent.must_notice_in_order,
    desired_action: intent.desired_action
  },
  predicted_route: [
    { id: 'category', label: 'Социальная платформа для вайбкодеров', x: 0.18, y: 0.17, semantic_job: 'Name the product category and audience', channels: ['position', 'type', 'isolation'], amplitude: 'emphasis', relevance: 'high', attention_receipt: 'This is a social/public product for people who build with AI.' },
    { id: 'headline', label: 'Сделали с AI? Дайте проекту публичную жизнь.', x: 0.22, y: 0.42, semantic_job: 'Turn the private-result problem into the promised public state', channels: ['size', 'position', 'type'], amplitude: 'dominant_interruption', relevance: 'high', attention_receipt: 'A finished AI project can receive a public life/address.' },
    { id: 'primary-action', label: 'Смотреть проекты', x: 0.12, y: 0.86, semantic_job: 'Offer a low-risk product inspection route', channels: ['contrast', 'shape', 'grouping'], amplitude: 'emphasis', relevance: 'high', attention_receipt: 'I can inspect current public projects now.' },
    { id: 'product-proof', label: 'Реальная публичная запись / demo', x: 0.75, y: 0.48, semantic_job: 'Make the product and evidence level visible before commitment', channels: ['detail', 'contrast', 'grouping'], amplitude: 'emphasis', relevance: 'high', attention_receipt: 'The mechanism is a real demo project record, not a generic community metaphor.' },
    { id: 'browse-condition', label: 'Каталог открывается без регистрации', x: 0.18, y: 0.93, semantic_job: 'Reduce authentication risk and disclose changing inventory', channels: ['grouping', 'position'], amplitude: 'nuance', relevance: 'high', attention_receipt: 'Browsing is public; current inventory changes.' }
  ],
  zones: [
    { kind: 'dominant', label: 'Outcome headline', x: 0.04, y: 0.19, width: 0.43, height: 0.50, role: 'Primary semantic change' },
    { kind: 'support', label: 'Public record proof', x: 0.53, y: 0.26, width: 0.43, height: 0.56, role: 'Product-bearing reason to believe' },
    { kind: 'support', label: 'Public catalog action', x: 0.04, y: 0.82, width: 0.22, height: 0.07, role: 'Low-risk next step' },
    { kind: 'quiet', label: 'Browse and maturity condition', x: 0.04, y: 0.91, width: 0.40, height: 0.05, role: 'Trust boundary' }
  ],
  spatial_grammar: {
    axes_grid: { status: 'pass', note: 'Two aligned masses share the same upper and lower bands; no detached center void.' },
    alignment: { status: 'pass', note: 'Category, H1, lead, actions and condition use one left anchor; proof elements share one contained right anchor.' },
    spacing: { status: 'pass', note: 'Meaning, explanation, action and condition remain separate without pushing the CTA below 900px after repair.' },
    grouping: { status: 'pass', note: 'The proof boundary is inside the proof object; the browse condition stays adjacent to the public action.' },
    typography: { status: 'pass', note: 'H1 remains three desktop lines and five compact mobile lines; condition text stays at readable sketch size.' },
    affordance: { status: 'pass', note: 'One filled primary action and one text contribution action are visually distinct and use literal labels.' },
    fold: { status: 'pass', note: 'At 1440x900 the primary CTA and condition are visible; at 390x844 the proof container begins at the fold after CTA and condition.' },
    density_rhythm: { status: 'pass', note: 'The first viewport carries category, outcome, action, proof and condition without a decorative empty field.' },
    whitespace: { status: 'pass', note: 'Whitespace separates message and proof; every large quiet area has a grouping or transition job.' },
    responsive: { status: 'pass', note: '390px route reorders copy, action, condition and proof vertically with zero horizontal overflow; it is not a compressed two-column layout.' }
  },
  accent_budget: { simultaneous_high_amplitude: 2, competing_targets: [], channel_stacking: ['headline:size+position+weight', 'product-proof:mass+border+detail'], business_hijack: false },
  findings: [
    { code: 'AAA-SKETCH-REPAIRED-FOLD', severity: 'note', evidence: 'Initial 1440x900 render clipped the primary CTA; H1 geometry and vertical spacing were repaired and browser geometry now places the button at y=750..804.', user_impact: 'The main public action is fully visible during the first decision moment.', fix: 'Keep the accepted three-line desktop headline and current action band through the golden slice.', acceptance: 'Golden-slice 1440x900 capture keeps category, H1, primary action, condition and meaningful product proof in the first viewport.' },
    { code: 'AAA-SKETCH-PROOF-COMPETITION', severity: 'minor', evidence: 'Headline and proof are both high-mass objects, but they answer promise and reason-to-believe rather than separate tasks.', user_impact: 'Attention may alternate between the two, which is acceptable only if both lead to the public catalog interpretation.', fix: 'Do not add a third high-amplitude object or cinematic metaphor in the Hero.', acceptance: 'Blind trace recalls the product category, public-project benefit and catalog action without treating the proof as an unrelated dashboard.' }
  ],
  status: 'pass'
};

writeJson('ATTENTION-AUDIT.json', audit);

const briefPath = path.join(root, 'site-brief.json');
const brief = JSON.parse(fs.readFileSync(briefPath, 'utf8'));
brief.attention.semantic.source_artifact_path = 'semantic-sketch.html';
brief.attention.semantic.source_sha256 = shaFile('semantic-sketch.html');
brief.attention.semantic.width = 1440;
brief.attention.semantic.height = 900;
fs.writeFileSync(briefPath, `${JSON.stringify(brief, null, 2)}\n`);

console.log(JSON.stringify({ audit: 'ATTENTION-AUDIT.json', persona: 'TARGET-PERSONA.json', hiddenIntentSha256: shaFile('DESIGN-INTENT-HIDDEN.json'), sourceSha256: brief.attention.semantic.source_sha256 }, null, 2));
