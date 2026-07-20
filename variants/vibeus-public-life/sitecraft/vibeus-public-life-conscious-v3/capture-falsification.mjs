import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const packetDir = path.dirname(fileURLToPath(import.meta.url));
const controlDir = path.join(packetDir, 'falsification');
const sourcePath = path.join(controlDir, 'plausible-semantic.html');
const sourceUrl = pathToFileURL(sourcePath).href;
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
const moduleRoot = process.env.CASTER_NODE_MODULES || 'C:/Users/alexe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const playwrightPackage = moduleRoot.includes('.pnpm')
  ? path.join(moduleRoot, 'playwright', 'package.json')
  : path.join(moduleRoot, '.pnpm', 'playwright@1.61.1', 'node_modules', 'playwright', 'package.json');
const require = createRequire(playwrightPackage);
const { chromium } = require('playwright');
const edgePath = process.env.CASTER_BROWSER_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const browser = await chromium.launch({ headless: true, executablePath: edgePath, args: ['--headless=new', '--no-first-run', '--disable-extensions'] });
const cases = [
  { id: 'desktop', viewport: { width: 1440, height: 1000 } },
  { id: 'mobile', viewport: { width: 390, height: 844 } }
];
const receipts = [];
for (const test of cases) {
  const context = await browser.newContext({ viewport: test.viewport, locale: 'ru-RU', reducedMotion: 'reduce' });
  const page = await context.newPage();
  const consoleErrors = [];
  const requestFailures = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('requestfailed', request => requestFailures.push({ url: request.url(), error: request.failure()?.errorText || 'unknown' }));
  await page.goto(sourceUrl, { waitUntil: 'load', timeout: 20000 });
  await Promise.race([page.evaluate(() => document.fonts.ready), new Promise(resolve => setTimeout(resolve, 5000))]);
  await page.evaluate(async () => Promise.all([...document.querySelectorAll('.record-window img')].map(image => image.decode?.().catch(() => {}) || Promise.resolve())));
  const output = path.join(controlDir, `plausible-${test.id}.png`);
  await page.screenshot({ path: output, fullPage: false, animations: 'disabled' });
  const geometry = await page.evaluate(() => ({
    scroll_width: document.documentElement.scrollWidth,
    client_width: document.documentElement.clientWidth,
    fonts_status: document.fonts.status,
    h1: document.querySelector('h1')?.textContent.trim(),
    primary_action: document.querySelector('.button-coral')?.textContent.replace(/\s+/g, ' ').trim(),
    primary_href: document.querySelector('.button-coral')?.href
  }));
  receipts.push({
    id: test.id,
    viewport: test.viewport,
    screenshot: `falsification/plausible-${test.id}.png`,
    screenshot_sha256: sha(output),
    geometry,
    overflow: geometry.scroll_width > geometry.client_width,
    console_errors: consoleErrors,
    request_failures: requestFailures
  });
  await context.close();
}
const receipt = { schema: 'sitecraft_plausible_semantic_capture.v1', source: 'falsification/plausible-semantic.html', source_sha256: sha(sourcePath), captured_at: new Date().toISOString(), cases: receipts };
const failures = receipts.filter(item => item.overflow || item.geometry.fonts_status !== 'loaded' || item.console_errors.length || item.request_failures.length);
receipt.validation = { status: failures.length ? 'fail' : 'pass', failures: failures.map(item => item.id) };
fs.writeFileSync(path.join(controlDir, 'capture-receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(receipt, null, 2));
const browserClosed = await Promise.race([browser.close().then(() => true).catch(() => false), new Promise(resolve => setTimeout(() => resolve(false), 5000))]);
console.log(`BROWSER_CLOSED|${browserClosed}`);
process.exit(failures.length ? 1 : 0);
