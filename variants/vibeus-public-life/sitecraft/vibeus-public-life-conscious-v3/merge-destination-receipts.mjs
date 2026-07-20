import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packetDir = path.dirname(fileURLToPath(import.meta.url));
const proofDir = path.join(packetDir, 'system-proof');
const canonicalPath = path.join(proofDir, 'destination-receipts.json');
const base = JSON.parse(fs.readFileSync(canonicalPath, 'utf8'));
const patches = fs.readdirSync(proofDir)
  .filter(name => /^destination-receipts-act-.+\.json$/.test(name))
  .map(name => JSON.parse(fs.readFileSync(path.join(proofDir, name), 'utf8')))
  .sort((a, b) => Date.parse(a.captured_at) - Date.parse(b.captured_at));

const byId = new Map(base.actions.map(item => [item.action_id, item]));
for (const patch of patches) {
  if (patch.source_sha256 !== base.source_sha256 || patch.validation?.status !== 'pass') continue;
  for (const action of patch.actions || []) byId.set(action.action_id, action);
}
base.actions = [...byId.values()];
const failures = base.actions.filter(item => item.final_url !== item.expected_url || item.http_status !== 200 || !item.expected_landmark_found || !item.recovery_verified || item.semantic_error);
base.captured_at = new Date().toISOString();
base.merged_from = ['destination-receipts.json', ...patches.map(item => item.captured_at)];
base.validation = { status: failures.length ? 'fail' : 'pass', failures: failures.map(item => item.action_id) };
fs.writeFileSync(canonicalPath, `${JSON.stringify(base, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ action_count: base.actions.length, validation: base.validation }, null, 2));
if (failures.length || base.actions.length !== 7) process.exit(1);
