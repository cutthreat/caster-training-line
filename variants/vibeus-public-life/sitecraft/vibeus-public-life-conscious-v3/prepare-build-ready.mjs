import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const packetDir = path.dirname(fileURLToPath(import.meta.url));
const briefPath = path.join(packetDir, 'site-brief.json');
const patternBriefPath = path.join(packetDir, 'pattern-selection-brief.json');
const receiptPath = path.join(packetDir, 'pattern-selection-receipt.json');
const patternLibrary = 'C:/Users/alexe/OneDrive/Документы/Caster Training/site-pattern-library';
const selector = path.join(patternLibrary, 'selection', 'select_patterns.py');
const validator = 'C:/Users/alexe/.codex/skills/sitecraft-brief-to-proof/scripts/validate_site_packet.py';

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
const run = (command, args) => {
  const result = spawnSync(command, args, { cwd: packetDir, encoding: 'utf8' });
  if (result.status !== 0) {
    process.stderr.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    process.exit(result.status ?? 1);
  }
  return (result.stdout || '').trim();
};

const brief = readJson(briefPath);

for (const chapter of brief.composition.chapters) {
  chapter.mass = `Dominant: ${chapter.dominant_mass} Support: ${chapter.support_mass} Quiet: ${chapter.quiet_mass}`;
  chapter.transition = `Entry: ${chapter.entry_transition} Exit: ${chapter.exit_transition}`;
}
brief.composition.responsive_transform = 'Desktop uses asymmetry and one source-linked route ledger with three complete destination rows; mobile preserves the same DOM order as a vertical list with proof and actions available without lateral gesture. Motion may clarify source-to-destination relationships, but reduced motion keeps every route visible as a static line.';

const catalogClaim = brief.claims.find(item => item.id === 'clm-public-catalog');
catalogClaim.volatility = 'volatile';
catalogClaim.operations = {
  source_ref: 'ev-catalog',
  owner: 'VibeUs product owner',
  review_trigger: 'Before release and whenever the /catalog landmark, anonymous access or screenshot changes.',
  expiry_trigger: 'Expire the current state when the route cannot render the “Каталог проектов” landmark or the capture is older than the release review.',
  locale_policy: 'single_locale',
  fallback_mode: 'unavailable',
  states: {
    current: { status: 'current', message: 'Каталог проектов доступен без регистрации; снимок содержит 4 проекта и 4 автора.', source_verified: true, stale_success_visible: false, numeric_value: 4, verified_at: '2026-07-20' },
    loading: { status: 'loading', message: 'Проверяем доступность каталога.', source_verified: false, stale_success_visible: false, numeric_value: null },
    empty: { status: 'empty', message: 'Публичные проекты сейчас не показаны. Можно вернуться позже.', source_verified: false, stale_success_visible: false, numeric_value: null },
    error: { status: 'error', message: 'Не удалось подтвердить текущий каталог. Перейдите на VibeUs напрямую.', source_verified: false, stale_success_visible: false, numeric_value: null },
    expired: { status: 'expired', message: 'Снимок каталога устарел. Откройте текущую версию на VibeUs.', source_verified: false, stale_success_visible: false, numeric_value: null }
  }
};

brief.stage = 'concept';
writeJson(briefPath, brief);

const projectionOutput = run('python', [validator, packetDir, '--stage', 'concept', '--print-projection']);
const projectionSha = projectionOutput.split(/\r?\n/).find(line => /^[A-F0-9]{64}$/.test(line.trim()));
if (!projectionSha) throw new Error(`Unable to read projection SHA from: ${projectionOutput}`);

const patternBrief = {
  schema: 'site_pattern_selection_brief.v1',
  brief_id: 'vibeus-public-life-conscious-v3',
  page_kind: brief.page_kind,
  primary_job: brief.marketing_design.system_job.target_state,
  primary_task: brief.primary_task,
  visual_law: brief.hypothesis.visual_law,
  composition_defined: true,
  identity_deltas: brief.hypothesis.identity_deltas,
  needs: [
    { id: 'orient-first-screen', critical: true, fallback: 'block' },
    { id: 'state-specific-value', critical: true, fallback: 'custom' },
    { id: 'bind-visual-to-product-proof', critical: true, fallback: 'block' },
    { id: 'claim-to-source-continuity', critical: true, fallback: 'block' },
    { id: 'show-transformation', critical: false, fallback: 'custom' },
    { id: 'orient-across-destinations', critical: true, fallback: 'custom' },
    { id: 'support-multiple-top-level-routes', critical: true, fallback: 'custom' },
    { id: 'consequential-next-step', critical: true, fallback: 'block' },
    { id: 'cross-process-boundary', critical: true, fallback: 'block' }
  ],
  evidence_available: [
    'confirmed-offer', 'truthful-mechanism', 'primary-action',
    'proof-bearing-product-object', 'visual-semantic-role',
    'inspectable-artifact', 'reuse-boundary', 'artifact-destination',
    'owned-information-architecture', 'stable-route-map', 'truthful-current-route',
    'primary-route', 'semantic-destination-receipts',
    'earned-proof', 'commitment-boundary', 'semantic-destination-plan'
  ],
  avoid_flags: ['static-artifact-sufficient', 'primary-navigation'],
  source_refs: [
    'semantic-sketch.html',
    'https://vibeus.app/catalog',
    'https://vibeus.app/works/launch-content-kit-df8941b5',
    'https://vibeus.app/discussions',
    'https://vibeus.app/ai-tools'
  ],
  site_brief_projection_sha256: projectionSha
};
writeJson(patternBriefPath, patternBrief);

run('python', [selector, patternBriefPath, '--output', receiptPath]);
const receipt = readJson(receiptPath);
if (!['pass', 'pass_with_custom_composition_required'].includes(receipt.status)) {
  throw new Error(`Pattern selector blocked: ${receipt.status}`);
}

brief.patterns.accepted = receipt.selected_patterns;
brief.patterns.foundation_gate = receipt.foundation_patterns;
brief.patterns.rejected = [
  { id: 'product-demo-evidence', reason: 'The page proves a static public record and route; it has no representative input/output demo contract.' },
  { id: 'horizontal-evidence-sequence', reason: 'The three rows are primary destinations, not ordered evidence; the route ledger must remain complete without lateral mechanics.' },
  { id: 'catalog-card-decision', reason: 'The landing hands off to the live catalog and must not imitate a catalog decision surface.' }
];
brief.patterns.custom_resolutions = (receipt.custom_composition_requirements || []).map(item => ({
  need: item.need,
  resolution: item.need === 'show-transformation'
    ? 'Loose private fragments may align into a public-address rail around current owned screenshots, but no interactive before/after, generated result or product transformation is claimed. Copy, proof object, route labels and links remain complete with motion and media disabled.'
    : `Resolve ${item.need} with a project-specific composition before build.`
}));
brief.stage = 'build_ready';
writeJson(briefPath, brief);

const selectionMarkdown = `# Pattern selection\n\n` +
  `Selector status: **${receipt.status}**.\n\n` +
  `Accepted: ${receipt.selected_patterns.map(item => `\`${item}\``).join(', ')}.\n\n` +
  `Foundations: ${receipt.foundation_patterns.map(item => `\`${item}\``).join(', ')}.\n\n` +
  `Custom composition: the loose-fragment → public-address transformation is a visual law only; it may not imply a product demo, reusable payload or generated result.\n\n` +
  `Rejected: product demo (no input/output contract), horizontal evidence sequence (primary navigation), catalog cards (the live catalog owns that task).\n`;
fs.writeFileSync(path.join(packetDir, 'PATTERN-SELECTION.md'), selectionMarkdown, 'utf8');

console.log(JSON.stringify({ projectionSha, selectorStatus: receipt.status, selected: receipt.selected_patterns, foundations: receipt.foundation_patterns }, null, 2));
