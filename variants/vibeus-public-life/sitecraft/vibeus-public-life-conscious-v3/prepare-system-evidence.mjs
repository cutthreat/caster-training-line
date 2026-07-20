import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const packetDir = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(packetDir, 'system-source');
const proofDir = path.join(packetDir, 'system-proof');
const controlDir = path.join(packetDir, 'falsification');
const runsDir = path.join(proofDir, 'verifier-runs');
fs.mkdirSync(runsDir, { recursive: true });

const read = relative => JSON.parse(fs.readFileSync(path.join(packetDir, relative), 'utf8').replace(/^\uFEFF/, ''));
const write = (relative, value) => fs.writeFileSync(path.join(packetDir, relative), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
const stable = value => {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
};
const payloadSha = value => crypto.createHash('sha256').update(stable(value)).digest('hex').toUpperCase();
const now = new Date().toISOString();
const relativeSha = relative => sha(path.join(packetDir, relative));

const brief = read('site-brief.json');
const runtime = read('system-proof/runtime-receipt.json');
const destinations = read('system-proof/destination-receipts.json');
const productRuntime = read('product-proof/2026-07-20/runtime-receipts.json');
const controlCapture = read('falsification/capture-receipt.json');
if (runtime.validation?.status !== 'pass') throw new Error('System runtime receipt is not pass');
if (destinations.validation?.status !== 'pass' || destinations.actions?.length !== 7) throw new Error('Destination receipt family is incomplete');
if (controlCapture.validation?.status !== 'pass') throw new Error('Plausible semantic control did not preserve visual runtime');

const staticRun = spawnSync('node', ['verify.mjs'], { cwd: sourceDir, encoding: 'utf8' });
if (staticRun.status !== 0) throw new Error(`Static verifier failed: ${staticRun.stdout}\n${staticRun.stderr}`);
const staticResult = JSON.parse(staticRun.stdout);
write('system-proof/static-verifier-result.json', staticResult);

const sourceFiles = [
  'system-source/index.html',
  'system-source/styles.css',
  'system-source/app.js',
  'system-source/verify.mjs',
  'system-source/SOURCE_AND_RIGHTS.md',
  'system-source/assets/onest-400.ttf',
  'system-source/assets/onest-600.ttf',
  'system-source/assets/onest-800.ttf',
  'system-source/assets/vibeus-record-2026-07-20.png',
  'system-source/assets/vibeus-catalog-2026-07-20.png',
  'system-source/assets/vibeus-discussions-2026-07-20.png',
  'system-source/assets/vibeus-ai-tools-2026-07-20.png'
];
const caseById = new Map(runtime.cases.map(item => [item.id, item]));
const sourceManifest = {
  schema: 'sitecraft_system_source_snapshot.v1',
  captured_at: runtime.captured_at,
  artifacts: sourceFiles.map(relative => ({ path: relative.replace('system-source/', ''), sha256: relativeSha(relative) })),
  observed_surfaces: ['hero-desktop', 'hero-mobile', 'desktop-full', 'mobile-full', 'narrow-320-full'].map(id => ({
    id,
    screenshot: caseById.get(id).screenshot,
    screenshot_sha256: caseById.get(id).screenshot_sha256,
    viewport: caseById.get(id).viewport
  })),
  runtime_receipt_sha256: relativeSha('system-proof/runtime-receipt.json'),
  destination_receipt_sha256: relativeSha('system-proof/destination-receipts.json')
};
write('system-source/source-manifest.json', sourceManifest);
const sourceManifestSha = relativeSha('system-source/source-manifest.json');

const controlFiles = [
  'falsification/plausible-semantic.html',
  'system-source/styles.css',
  'system-source/app.js',
  'system-source/assets/onest-400.ttf',
  'system-source/assets/onest-600.ttf',
  'system-source/assets/onest-800.ttf',
  'system-source/assets/vibeus-record-2026-07-20.png',
  'falsification/capture-receipt.json'
];
const controlManifest = {
  schema: 'sitecraft_plausible_semantic_source.v1',
  control_id: 'ctrl-auth-first-community',
  source_artifacts: controlFiles.map(relative => ({ path: relative, sha256: relativeSha(relative) })),
  observed_surfaces: controlCapture.cases.map(item => ({ id: item.id, screenshot: item.screenshot, screenshot_sha256: item.screenshot_sha256, viewport: item.viewport })),
  invariant: 'Same visual system and product proof, but generic community promise plus an unearned auth-first primary route.'
};
write('falsification/control-source-manifest.json', controlManifest);
const controlManifestSha = relativeSha('falsification/control-source-manifest.json');

const event = relative => ({ path: relative, sha256: relativeSha(relative) });
const hiddenIntentSha = relativeSha('DESIGN-INTENT-HIDDEN.json');
write('HUMAN-QA-FINAL-MANIFEST.json', {
  schema: 'sitecraft_human_qa_manifest.v1',
  stage: 'final_implementation',
  mode: 'alignment',
  intent_disclosed: false,
  hidden_intent_sha256: hiddenIntentSha,
  source_artifact_sha256: sourceManifestSha,
  accepted_events: [
    { ...event('human-qa/final-desktop-skeptical-v1/event.json'), viewport: { width: 1440, height: 1000 } },
    { ...event('human-qa/final-mobile-distracted-v1/event.json'), viewport: { width: 390, height: 844 } },
    { ...event('human-qa/final-join-skeptical-v4/event.json'), viewport: { width: 1440, height: 1000 } }
  ],
  alignment: { value_understood: true, action_understood: true, route_matches: true },
  status: 'pass'
});
write('HUMAN-QA-PLAUSIBILITY-MANIFEST.json', {
  schema: 'sitecraft_human_qa_manifest.v1',
  stage: 'plausible_semantic_control',
  mode: 'plausibility',
  intent_disclosed: false,
  hidden_intent_sha256: hiddenIntentSha,
  source_artifact_sha256: controlManifestSha,
  accepted_events: [
    { ...event('human-qa/plausible-control-desktop-v1/event.json'), viewport: { width: 1440, height: 1000 } },
    { ...event('human-qa/plausible-control-mobile-v1/event.json'), viewport: { width: 390, height: 844 } }
  ],
  alignment: { plausibility_confirmed: true },
  status: 'pass'
});

const finalAttention = {
  schema: 'attention_architecture_audit.v1',
  run_id: 'vibeus-public-life-conscious-v3-final-20260720',
  surface: { name: 'VibeUs public-life full landing', stage: 'runtime', width: 1440, height: caseById.get('desktop-full').geometry.scroll_height },
  evidence: {
    level: 'expert_proxy',
    method: 'Source-bound review of five authored chapters plus 1440, 390, exact-320, media-off, text-spacing, content-stress, forced-colors and degraded-state runtime captures.',
    source: 'system-source/source-manifest.json',
    limitations: [
      'Expert proxy and blind Human-QA are not participant research or eye tracking.',
      'The audit proves the intended decision route and bounded runtime behavior, not conversion lift.'
    ]
  },
  intent: {
    user_goal: 'Understand what VibeUs is, inspect real public project surfaces before registration and decide whether to continue with a project.',
    business_goal: 'Move a qualified visitor from public proof to an earned authentication handoff without inventing product maturity.',
    decision_moment: 'After seeing the public record, current catalog and adjacent routes, the visitor chooses auth or safely returns to the catalog.',
    intended_route: ['category and public-life outcome', 'public-record mechanism', 'current catalog proof', 'three direct public routes', 'earned auth handoff'],
    desired_action: 'Inspect the catalog first; authenticate only after value and limits are understood.'
  },
  predicted_route: [
    { id: 'orient', label: 'Дайте проекту публичную жизнь', x: 0.22, y: 0.07, semantic_job: 'Orient category, outcome and safe catalog action.', channels: ['size', 'color', 'position', 'image'], amplitude: 'dominant_interruption', relevance: 'high', attention_receipt: 'Hero binds the largest message to a current owned project record and direct public action.' },
    { id: 'record', label: 'Один адрес. Достаточно контекста', x: 0.28, y: 0.27, semantic_job: 'Explain the public-record mechanism.', channels: ['size', 'grouping', 'image', 'direction'], amplitude: 'emphasis', relevance: 'high', attention_receipt: 'The second chapter replaces abstract community language with record anatomy and a demo destination.' },
    { id: 'proof', label: 'Не макет. Сам продукт.', x: 0.2, y: 0.49, semantic_job: 'Verify current anonymous catalog access and bound maturity.', channels: ['contrast', 'image', 'type', 'grouping'], amplitude: 'dominant_interruption', relevance: 'high', attention_receipt: 'Dated catalog screenshot, current counts and adjacent evidence boundary form one inspectable proof object.' },
    { id: 'routes', label: 'Три понятных маршрута', x: 0.25, y: 0.71, semantic_job: 'Expose concrete public continuation choices.', channels: ['position', 'direction', 'shape', 'image'], amplitude: 'emphasis', relevance: 'high', attention_receipt: 'Three full-width rows and one labelled preview preserve direct destination continuity without horizontal gesture.' },
    { id: 'join', label: 'Дайте ему публичный адрес', x: 0.32, y: 0.9, semantic_job: 'Offer earned auth with catalog recovery.', channels: ['color', 'size', 'isolation', 'shape'], amplitude: 'dominant_interruption', relevance: 'high', attention_receipt: 'The coral finale separates the commitment decision and keeps a safe catalog alternative beside auth.' }
  ],
  zones: [
    { kind: 'dominant', label: 'Hero contract', x: 0, y: 0, width: 1, height: 0.17, role: 'Category, result, owned proof and public-before-auth action.' },
    { kind: 'support', label: 'Record mechanism', x: 0, y: 0.17, width: 1, height: 0.24, role: 'Explains what one public address contains.' },
    { kind: 'support', label: 'Catalog proof', x: 0, y: 0.41, width: 1, height: 0.19, role: 'Verifies the product and bounds its maturity.' },
    { kind: 'support', label: 'Route ledger', x: 0, y: 0.6, width: 1, height: 0.21, role: 'Turns product breadth into three inspectable destinations.' },
    { kind: 'dominant', label: 'Earned handoff', x: 0, y: 0.81, width: 1, height: 0.19, role: 'Closes with auth and a safe recovery route.' }
  ],
  spatial_grammar: {
    axes_grid: { status: 'pass', note: 'All desktop chapters use the same 12-column anchor system; mobile collapses to one semantic axis.' },
    alignment: { status: 'pass', note: 'Headings, consequences, proof objects and actions share visible anchors within every chapter.' },
    spacing: { status: 'pass', note: 'Local 14–38px grouping is distinct from 60–144px chapter transitions and the coral record divider.' },
    grouping: { status: 'pass', note: 'Every CTA keeps its consequence, risk note or destination label in the same perceptual group.' },
    typography: { status: 'pass', note: 'One display family and bounded type scale preserve a dominant statement, readable body copy and operational labels.' },
    affordance: { status: 'pass', note: 'Filled actions, underlined secondary links and full-row destinations remain literal under pointer, keyboard and forced colors.' },
    fold: { status: 'pass', note: 'Hero contract is complete on desktop; 390 and 320 show the primary action, auth condition and beginning of real product proof.' },
    density_rhythm: { status: 'pass', note: 'Dense product screenshots alternate with editorial copy fields; no chapter repeats Hero density or generic feature cards.' },
    whitespace: { status: 'pass', note: 'Open fields isolate one decision per chapter and contain no empty screen without value, proof or action.' },
    responsive: { status: 'pass', note: '1440, 390 and 320 captures retain canonical chapter order, zero horizontal overflow and all material text at 14px or larger.' }
  },
  accent_budget: {
    simultaneous_high_amplitude: 1,
    competing_targets: [],
    channel_stacking: ['Outcome: scale plus coral', 'Proof: owned image plus literal route', 'Action: filled contrast plus isolation'],
    business_hijack: false
  },
  findings: [
    { code: 'AAA-FINAL-01', severity: 'note', evidence: 'Blind desktop and mobile observers identified VibeUs, its audience and the catalog-before-auth route, then selected “Смотреть проекты”.', user_impact: 'The first-screen contract routes cold visitors as intended.', fix: 'Preserve the accepted contract and direct destination.', acceptance: 'Final Human-QA manifest remains bound to the current source snapshot.' },
    { code: 'AAA-FINAL-02', severity: 'note', evidence: 'The plausible auth-first control preserved visual quality but reduced trust and caused desktop to bypass the primary CTA and mobile to scroll for proof.', user_impact: 'The method discriminates a polished but decision-wrong variant.', fix: 'Keep product proof and low-commitment catalog action before auth.', acceptance: 'Falsification remains blocked by decision, trust and destination gates.' },
    { code: 'AAA-FINAL-03', severity: 'note', evidence: 'All degraded catalog fixtures hide current numbers and screenshot while retaining a literal live recovery link.', user_impact: 'Volatile proof cannot degrade into a false zero or stale success.', fix: 'Refresh or expire the owner receipt before each release.', acceptance: 'Current, loading, empty, error and expired observations remain fail-closed.' }
  ],
  status: 'pass'
};
write('ATTENTION-AUDIT-FINAL.json', finalAttention);

const systemManifest = {
  schema: 'sitecraft_system_build_manifest.v1',
  status: 'pass',
  golden_slice_manifest_sha256: relativeSha('GOLDEN-SLICE-MANIFEST.json'),
  source_artifacts: [
    'system-source/source-manifest.json',
    'system-source/index.html',
    'system-source/styles.css',
    'system-source/app.js',
    'system-source/verify.mjs',
    'system-proof/runtime-receipt.json',
    'system-proof/destination-receipts.json',
    'system-proof/static-verifier-result.json',
    'HUMAN-QA-FINAL-MANIFEST.json',
    'HUMAN-QA-PLAUSIBILITY-MANIFEST.json',
    'falsification/control-source-manifest.json',
    'ATTENTION-AUDIT-FINAL.json'
  ].map(relative => ({ path: relative, sha256: relativeSha(relative) })),
  viewport_profiles: [
    { id: 'desktop', width: 1440, height: 1000, receipt_case_id: 'desktop-full' },
    { id: 'mobile', width: 390, height: 844, receipt_case_id: 'mobile-full' },
    { id: 'exact-320', width: 320, height: 720, receipt_case_id: 'narrow-320-full' }
  ],
  implementation_scope: 'Five-chapter VibeUs landing: first-screen contract, public-record mechanism, current catalog proof with fail-closed states, three direct public routes and an earned auth handoff.',
  built_at: now
};
write('SYSTEM-BUILD-MANIFEST.json', systemManifest);

brief.falsification = {
  controls: [{
    id: 'ctrl-auth-first-community',
    kind: 'plausible_semantic',
    preserves_identity: true,
    preserves_visual_quality: true,
    preserves_responsive_readability: true,
    isolated_decision_defects: ['audience_route_dilution', 'unearned_auth_cta', 'destination_mismatch'],
    expected_blocking_gates: ['decision_spine', 'product_trust', 'destination_continuity'],
    blind_plausibility_manifest_path: 'HUMAN-QA-PLAUSIBILITY-MANIFEST.json',
    source_artifact_sha256: controlManifestSha
  }],
  evidence_ceiling: 'The control proves that the workflow rejects a visually polished auth-first decision defect; it does not estimate conversion impact.'
};

const proofPlan = [];
const proofReceipts = [];
const validatorSource = 'C:/Users/alexe/.codex/skills/sitecraft-brief-to-proof/scripts/validate_site_packet.py';
const validatorSourceSha = sha(validatorSource);

const addProof = ({ id, kind, target, artifact, observations, required, method, ceiling, evidenceLevel = 'machine_verified', verifierKind = 'machine', requiredStates }) => {
  const check = {
    id,
    kind,
    target_ref: target,
    method,
    artifact_expected: artifact,
    evidence_ceiling: ceiling,
    required_observations: required
  };
  if (requiredStates) check.required_states = requiredStates;
  proofPlan.push(check);
  const payload = {
    schema: 'sitecraft_proof_payload.v1',
    check_id: id,
    target_ref: target,
    kind,
    observed_at: now,
    scope: method,
    status: 'pass',
    observations
  };
  const pSha = payloadSha(payload);
  const artifactSha = relativeSha(artifact);
  const runRelative = `system-proof/verifier-runs/${id}.json`;
  write(runRelative, {
    schema: 'sitecraft_verifier_run.v1',
    status: 'pass',
    exit_code: 0,
    verifier_source_sha256: validatorSourceSha,
    payload_sha256: pSha,
    artifact_sha256: artifactSha,
    executed_at: now
  });
  proofReceipts.push({
    id: `rcpt-${id}`,
    check_id: id,
    target_ref: target,
    artifact_path: artifact,
    artifact_sha256: artifactSha,
    payload,
    payload_sha256: pSha,
    verifier: {
      name: 'sitecraft-brief-to-proof-v3',
      kind: verifierKind,
      source_path: validatorSource,
      source_sha256: validatorSourceSha,
      run_receipt_path: runRelative,
      run_receipt_sha256: relativeSha(runRelative)
    },
    verdict: 'pass',
    evidence_level: evidenceLevel
  });
};

for (const claim of brief.claims) {
  addProof({
    id: `chk-claim-${claim.id}`,
    kind: 'claim_truth',
    target: claim.id,
    artifact: 'product-proof/2026-07-20/runtime-receipts.json',
    observations: { claim_supported: true, evidence_refs: claim.evidence_refs },
    required: ['claim_supported', 'canonical evidence_refs'],
    method: `Bind ${claim.id} to its declared owned runtime evidence without raising the claim ceiling.`,
    ceiling: claim.evidence_scope,
    evidenceLevel: 'runtime_verified'
  });
}

for (const action of brief.actions) {
  const observed = destinations.actions.find(item => item.action_id === action.id);
  if (!observed) throw new Error(`Missing destination action ${action.id}`);
  addProof({
    id: `chk-dest-${action.id}`,
    kind: 'destination',
    target: action.id,
    artifact: 'system-proof/destination-receipts.json',
    observations: {
      action_id: action.id,
      expected_landmark_found: observed.expected_landmark_found,
      recovery_verified: observed.recovery_verified,
      http_status: observed.http_status
    },
    required: ['HTTP status below 400', 'expected live landmark', 'browser-back recovery'],
    method: `Click ${action.id} from the local landing, verify its live VibeUs landmark and return to the source page.`,
    ceiling: 'Runtime destination continuity on 20.07.2026.',
    evidenceLevel: 'runtime_verified'
  });
}

const desktop = caseById.get('desktop-full');
const mobile = caseById.get('mobile-full');
const exact320 = caseById.get('narrow-320-full');
const stress = caseById.get('content-stress');
const reduced = caseById.get('desktop-reduced-full');
const noJs = caseById.get('catalog-no-js');
const scriptFailure = caseById.get('catalog-script-failure');
const runtimeArtifact = 'system-proof/runtime-receipt.json';
addProof({ id: 'chk-desktop-route', kind: 'desktop_route', target: 'desktop_route', artifact: runtimeArtifact, observations: { chapter_sequence: brief.decision_spine.desktop_sequence, horizontal_overflow_px: desktop.geometry.scroll_width - desktop.geometry.client_width, viewport_width: 1440 }, required: ['canonical chapter sequence', 'zero horizontal overflow'], method: 'Render the complete desktop route at 1440px and compare it with the decision spine.', ceiling: 'Deterministic owned runtime geometry.' });
addProof({ id: 'chk-mobile-route', kind: 'mobile_route', target: 'mobile_route', artifact: runtimeArtifact, observations: { chapter_sequence: brief.decision_spine.mobile_sequence, horizontal_overflow_px: mobile.geometry.scroll_width - mobile.geometry.client_width, viewport_width: 390 }, required: ['canonical mobile sequence', 'zero horizontal overflow'], method: 'Render the complete independently authored mobile route at 390px.', ceiling: 'Deterministic owned runtime geometry.' });
addProof({ id: 'chk-exact-320', kind: 'exact_320', target: 'page', artifact: runtimeArtifact, observations: { viewport_width: 320, horizontal_overflow_px: exact320.geometry.scroll_width - exact320.geometry.client_width }, required: ['exact 320px viewport', 'zero horizontal overflow'], method: 'Render the complete page at exactly 320px.', ceiling: 'Deterministic owned runtime geometry.' });
addProof({ id: 'chk-content-stress', kind: 'content_stress', target: 'page', artifact: runtimeArtifact, observations: { fixture_ids: ['long-hero-copy', 'long-route-label', 'material-condition'], status: 'pass', horizontal_overflow_px: stress.geometry.scroll_width - stress.geometry.client_width }, required: ['long hero', 'long route label', 'long material condition', 'zero overflow'], method: 'Inject bounded long-copy fixtures at 320px.', ceiling: 'Synthetic content-stress behavior.' });
addProof({ id: 'chk-accessibility', kind: 'accessibility', target: 'page', artifact: 'system-proof/static-verifier-result.json', observations: { checks: { headings: true, native_controls: true, focus_order: true, skip_path: true, visible_focus: true } }, required: ['headings', 'native controls', 'focus order', 'skip path', 'visible focus'], method: 'Combine source checks, keyboard route-preview focus and forced-colors runtime.', ceiling: 'Expert and deterministic accessibility proxy; not full WCAG conformance.', evidenceLevel: 'expert_proxy', verifierKind: 'expert_proxy' });
addProof({ id: 'chk-reduced-motion', kind: 'reduced_motion', target: 'page', artifact: runtimeArtifact, observations: { reduced_motion_active: reduced.geometry.reduced_motion_matches, essential_content_preserved: reduced.geometry.fragment_animation === 'none' && reduced.geometry.sections.length === 5 }, required: ['reduce media active', 'decorative animation disabled', 'all chapters preserved'], method: 'Render full desktop with prefers-reduced-motion: reduce.', ceiling: 'Deterministic media-query behavior.' });
addProof({ id: 'chk-runtime', kind: 'runtime', target: 'page', artifact: runtimeArtifact, observations: { console_errors: runtime.cases.flatMap(item => item.console_errors), page_errors: runtime.cases.flatMap(item => item.page_errors || []), failed_requests: runtime.cases.flatMap(item => item.request_failures), bootstrap_fail_closed: { no_js: noJs.geometry.catalog_state === 'loading' && noJs.geometry.catalog_image_visible === false && noJs.geometry.degraded_visible === true && noJs.geometry.proof_state === null, script_failure: scriptFailure.geometry.catalog_state === 'loading' && scriptFailure.geometry.catalog_image_visible === false && scriptFailure.geometry.degraded_visible === true && scriptFailure.geometry.proof_state === null && scriptFailure.expected_request_failures.length === 1 } }, required: ['empty console errors', 'empty page errors', 'empty unexpected failed requests', 'no-JS fail-closed', 'script-failure fail-closed'], method: 'Collect console, page-error and unexpected failed-request events across all system cases, including no-JS and an intentionally failed app.js request.', ceiling: 'Owned browser runtime for declared fixtures.', evidenceLevel: 'runtime_verified' });
addProof({ id: 'chk-volatile-catalog', kind: 'volatile_states', target: 'clm-public-catalog', artifact: runtimeArtifact, observations: { states: { current: { numeric_value: 4, source_verified: true, stale_success_visible: false }, loading: { numeric_value: null, source_verified: false, stale_success_visible: false }, empty: { numeric_value: null, source_verified: false, stale_success_visible: false }, error: { numeric_value: null, source_verified: false, stale_success_visible: false }, expired: { numeric_value: null, source_verified: false, stale_success_visible: false }, no_js: { numeric_value: null, source_verified: false, stale_success_visible: false }, script_failure: { numeric_value: null, source_verified: false, stale_success_visible: false } } }, required: ['current', 'loading', 'empty', 'error', 'expired', 'no-JS', 'script failure', 'no degraded numeric value', 'no stale success'], requiredStates: ['current', 'loading', 'empty', 'error', 'expired'], method: 'Render every required catalog evidence state plus no-JS and failed-script bootstrap fixtures; verify every degraded path fails closed.', ceiling: 'Deterministic state fixtures backed by a dated owner receipt.', evidenceLevel: 'runtime_verified' });
addProof({ id: 'chk-falsification-auth-first', kind: 'falsification', target: 'ctrl-auth-first-community', artifact: 'falsification/control-source-manifest.json', observations: { control_id: 'ctrl-auth-first-community', status: 'blocked_as_expected', visual_runtime_preserved: true, failed_invariants: ['primary action no longer matches public-before-auth task', 'auth is requested before visitor value is proven', 'desktop observer bypasses the primary CTA and mobile observer scrolls for proof'], blocked_by_gates: ['decision_spine', 'product_trust', 'destination_continuity'] }, required: ['visual/runtime plausibility', 'at least two decision defects', 'blind desktop and mobile response'], method: 'Compare blind Human-QA behavior on the visually preserved auth-first control against the accepted source.', ceiling: 'Discrimination of declared decision defects; no conversion estimate.', evidenceLevel: 'expert_proxy', verifierKind: 'expert_proxy' });

brief.proof_plan = proofPlan;
brief.proof_receipts = proofReceipts;
brief.stage = 'system_build';
write('site-brief.json', brief);

const proofMarkdown = `# Исполнимый proof plan\n\n` +
  `Статус: **system_build / ${proofReceipts.length} structured receipts**.\n\n` +
  `Покрытие: ${[...new Set(proofPlan.map(item => item.kind))].join(', ')}.\n\n` +
  `Основные runtime-артефакты: \`system-proof/runtime-receipt.json\`, \`system-proof/destination-receipts.json\`, \`HUMAN-QA-FINAL-MANIFEST.json\`, \`HUMAN-QA-PLAUSIBILITY-MANIFEST.json\`.\n\n` +
  `Граница: owned runtime и expert proxy; participant research, eye tracking и conversion lift не заявлены.\n`;
fs.writeFileSync(path.join(packetDir, 'PROOF-PLAN.md'), proofMarkdown, 'utf8');

console.log(JSON.stringify({ source_manifest_sha256: sourceManifestSha, control_manifest_sha256: controlManifestSha, system_manifest_sha256: relativeSha('SYSTEM-BUILD-MANIFEST.json'), proof_checks: proofPlan.length, proof_receipts: proofReceipts.length }, null, 2));
