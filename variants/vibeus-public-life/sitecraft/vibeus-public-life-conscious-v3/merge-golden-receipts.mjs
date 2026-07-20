import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const packetDir = path.dirname(fileURLToPath(import.meta.url));
const proofDir = path.join(packetDir, 'golden-proof');
const sourcePath = path.join(packetDir, 'golden-slice.html');
const sourceSha = crypto.createHash('sha256').update(fs.readFileSync(sourcePath)).digest('hex').toUpperCase();
const requiredCases = [
  'hero-desktop',
  'hero-reduced-motion-desktop',
  'hero-mobile',
  'hero-320',
  'proof-desktop',
  'proof-mobile',
  'proof-320',
  'proof-expired-desktop'
];

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const candidates = fs.readdirSync(proofDir)
  .filter(name => name.startsWith('capture-receipt-') && name.endsWith('.json') && name !== 'capture-receipt-action.json')
  .map(name => ({ name, receipt: readJson(path.join(proofDir, name)) }))
  .filter(({ receipt }) => receipt.source_sha256 === sourceSha && requiredCases.every(id => receipt.cases?.some(item => item.id === id)))
  .sort((a, b) => Date.parse(b.receipt.captured_at) - Date.parse(a.receipt.captured_at));

if (!candidates.length) throw new Error(`No current eight-case receipt for ${sourceSha}`);
const visualReceipt = candidates[0].receipt;
const actionReceipt = readJson(path.join(proofDir, 'capture-receipt-action.json'));
if (actionReceipt.source_sha256 !== sourceSha) throw new Error('Action receipt is not bound to current source');

const cases = visualReceipt.cases;
const byId = new Map(cases.map(item => [item.id, item]));
const failures = [];
for (const id of requiredCases) {
  const item = byId.get(id);
  if (!item) failures.push(`${id}:missing`);
  else {
    if (item.overflow) failures.push(`${id}:overflow`);
    if (item.geometry?.fonts_status !== 'loaded') failures.push(`${id}:fonts`);
    if (item.console_errors?.length) failures.push(`${id}:console`);
    if (item.request_failures?.length) failures.push(`${id}:network`);
  }
}

const desktop = byId.get('hero-desktop');
const reduced = byId.get('hero-reduced-motion-desktop');
const mobile = byId.get('hero-mobile');
const narrow = byId.get('hero-320');
const currentProof = byId.get('proof-desktop');
const expiredProof = byId.get('proof-expired-desktop');
if (desktop?.viewport?.width < 1024 || desktop?.geometry?.reduced_motion_matches !== false || desktop?.geometry?.fragment_animation !== 'align') failures.push('desktop:motion-contract');
if (reduced?.reduced_motion !== 'reduce' || reduced?.geometry?.reduced_motion_matches !== true || reduced?.geometry?.fragment_animation !== 'none') failures.push('reduced-motion:contract');
if (mobile?.viewport?.width !== 390) failures.push('mobile:viewport');
if (narrow?.viewport?.width !== 320) failures.push('narrow:viewport');
if (currentProof?.geometry?.catalog_state !== 'current') failures.push('catalog:current-state');
if (expiredProof?.geometry?.catalog_state !== 'expired') failures.push('catalog:expired-state');

const actions = actionReceipt.action_receipts || [];
const catalogAction = actions.find(item => item.action_id === 'act-catalog-hero');
if (!catalogAction || catalogAction.final_url !== 'https://vibeus.app/catalog' || !catalogAction.landmark_matched || catalogAction.semantic_error) failures.push('action:catalog-destination');

const merged = {
  schema: 'sitecraft_golden_capture_receipt.v2',
  source: 'golden-slice.html',
  source_sha256: sourceSha,
  captured_at: new Date().toISOString(),
  merged_from: [candidates[0].name, 'capture-receipt-action.json'],
  cases,
  action_receipts: actions,
  required_case_ids: requiredCases,
  validation: {
    status: failures.length ? 'fail' : 'pass',
    failures
  }
};
fs.writeFileSync(path.join(proofDir, 'capture-receipt.json'), `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ source_sha256: sourceSha, merged_from: merged.merged_from, case_count: cases.length, action_count: actions.length, status: merged.validation.status, failures }, null, 2));
if (failures.length) process.exit(1);
