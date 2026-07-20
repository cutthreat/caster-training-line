import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const packetDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(packetDir, 'golden-proof');
fs.mkdirSync(outputDir, { recursive: true });
const sourcePath = path.join(packetDir, 'golden-slice.html');
const sourceUrl = pathToFileURL(sourcePath).href;

const moduleRoot = process.env.CASTER_NODE_MODULES || 'C:/Users/alexe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const playwrightPackage = moduleRoot.includes('.pnpm')
  ? path.join(moduleRoot, 'playwright', 'package.json')
  : path.join(moduleRoot, '.pnpm', 'playwright@1.61.1', 'node_modules', 'playwright', 'package.json');
const require = createRequire(playwrightPackage);
const { chromium } = require('playwright');
const edgePath = process.env.CASTER_BROWSER_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();

const caseFilter = process.env.GOLDEN_CASE || '';
const requestedCases = new Set(caseFilter.split(',').map(item => item.trim()).filter(Boolean));
const cases = [
  { id: 'hero-desktop', viewport: { width: 1440, height: 1000 }, target: 'top', motion: 'no-preference' },
  { id: 'hero-reduced-motion-desktop', viewport: { width: 1440, height: 1000 }, target: 'top', motion: 'reduce' },
  { id: 'hero-mobile', viewport: { width: 390, height: 844 }, target: 'top', motion: 'reduce' },
  { id: 'hero-320', viewport: { width: 320, height: 720 }, target: 'top', motion: 'reduce' },
  { id: 'proof-desktop', viewport: { width: 1440, height: 1000 }, target: 'proof', motion: 'reduce' },
  { id: 'proof-mobile', viewport: { width: 390, height: 844 }, target: 'proof', motion: 'reduce' },
  { id: 'proof-320', viewport: { width: 320, height: 720 }, target: 'proof', motion: 'reduce' },
  { id: 'proof-expired-desktop', viewport: { width: 1440, height: 1000 }, target: 'proof', query: '?catalog_state=expired', motion: 'reduce' }
].filter(test => !caseFilter || requestedCases.has(test.id));

const browser = await chromium.launch({
  headless: true,
  executablePath: edgePath,
  timeout: 20000,
  args: ['--headless=new', '--no-first-run', '--disable-extensions', '--disable-gpu']
});
const browserPid = browser._channel?._connection?._transport?._proc?.pid || browser._connection?._transport?._proc?.pid || null;
console.log(`BROWSER_PID|${browserPid || 'unknown'}`);
const receipts = [];
for (const test of cases) {
  console.log(`START|${test.id}`);
  const context = await browser.newContext({ viewport: test.viewport, locale: 'ru-RU', colorScheme: 'dark', reducedMotion: test.motion || 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  page.setDefaultNavigationTimeout(15000);
  const consoleErrors = [];
  const requestFailures = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('requestfailed', request => requestFailures.push({ url: request.url(), error: request.failure()?.errorText || 'unknown' }));
  await page.goto(`${sourceUrl}${test.query || ''}`, { waitUntil: 'load', timeout: 20000 });
  console.log(`LOADED|${test.id}`);
  await Promise.race([page.evaluate(() => document.fonts.ready), new Promise(resolve => setTimeout(resolve, 5000))]);
  if (test.target === 'proof') {
    await page.locator('#proof').evaluate(element => element.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'instant' }));
    await page.waitForTimeout(100);
  }
  const screenshotPath = path.join(outputDir, `${test.id}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: false, animations: test.motion === 'reduce' ? 'allow' : 'disabled', timeout: 20000 });
  console.log(`SHOT|${test.id}`);
  const geometry = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.getBoundingClientRect();
    const action = document.querySelector('.button')?.getBoundingClientRect();
    const proof = document.querySelector('.record')?.getBoundingClientRect();
    return {
      scroll_width: document.documentElement.scrollWidth,
      client_width: document.documentElement.clientWidth,
      body_scroll_width: document.body.scrollWidth,
      h1: h1 ? { top: h1.top, bottom: h1.bottom, left: h1.left, right: h1.right } : null,
      primary_action: action ? { top: action.top, bottom: action.bottom, left: action.left, right: action.right } : null,
      record: proof ? { top: proof.top, bottom: proof.bottom, left: proof.left, right: proof.right } : null,
      fonts_status: document.fonts.status,
      reduced_motion_matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      fragment_animation: getComputedStyle(document.querySelector('.fragment.one')).animationName,
      catalog_state: document.body.dataset.catalogState
    };
  });
  receipts.push({
    id: test.id,
    route: test.target === 'proof' ? `golden-slice.html${test.query || ''}#proof` : 'golden-slice.html',
    viewport: test.viewport,
    reduced_motion: test.motion || 'reduce',
    screenshot: path.relative(packetDir, screenshotPath).replaceAll('\\', '/'),
    screenshot_sha256: sha(screenshotPath),
    geometry,
    overflow: geometry.scroll_width > geometry.client_width || geometry.body_scroll_width > geometry.client_width,
    console_errors: consoleErrors,
    request_failures: requestFailures
  });
  await context.close();
  console.log(`DONE|${test.id}`);
}
const actionReceipts = [];
if (!caseFilter || caseFilter === 'action') {
  const actionContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'ru-RU', reducedMotion: 'reduce' });
  const actionPage = await actionContext.newPage();
  await actionPage.goto(sourceUrl, { waitUntil: 'load', timeout: 20000 });
  await Promise.all([
    actionPage.waitForURL(url => url.href.startsWith('https://vibeus.app/catalog'), { timeout: 25000 }),
    actionPage.locator('a.button').click()
  ]);
  await actionPage.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
  await actionPage.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  await actionPage.getByText('Каталог проектов', { exact: false }).first().waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
  await actionPage.waitForTimeout(1200);
  const actionBody = (await actionPage.locator('body').innerText()).replace(/\s+/g, ' ').trim();
  const actionScreenshotPath = path.join(outputDir, 'action-catalog-destination.png');
  await actionPage.screenshot({ path: actionScreenshotPath, fullPage: false, animations: 'disabled', timeout: 20000 });
  actionReceipts.push({
    action_id: 'act-catalog-hero',
    visible_text: 'Смотреть проекты',
    expected_url: 'https://vibeus.app/catalog',
    final_url: actionPage.url(),
    expected_landmark: 'Каталог проектов',
    landmark_matched: /Каталог проектов/i.test(actionBody),
    semantic_error: /страница не найдена|page not found|ошибка 404/i.test(actionBody),
    title: await actionPage.title(),
    body_excerpt: actionBody.slice(0, 900),
    screenshot: path.relative(packetDir, actionScreenshotPath).replaceAll('\\', '/'),
    screenshot_sha256: sha(actionScreenshotPath)
  });
  await actionContext.close();
}
const receipt = { source: 'golden-slice.html', source_sha256: sha(sourcePath), captured_at: new Date().toISOString(), cases: receipts, action_receipts: actionReceipts };
const receiptName = caseFilter ? `capture-receipt-${caseFilter.replace(/[^a-z0-9-]+/gi, '_')}.json` : 'capture-receipt.json';
fs.writeFileSync(path.join(outputDir, receiptName), `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
const failed = receipts.filter(item => item.overflow || item.console_errors.length || item.request_failures.length || item.geometry.fonts_status !== 'loaded');
if (actionReceipts.some(item => !item.landmark_matched || item.semantic_error)) failed.push({ id: 'action-destination' });
console.log(JSON.stringify({ source_sha256: receipt.source_sha256, cases: receipts.map(({ id, viewport, overflow, geometry, screenshot_sha256 }) => ({ id, viewport, overflow, fonts: geometry.fonts_status, screenshot_sha256 })), failed: failed.map(item => item.id) }, null, 2));
const browserClosed = await Promise.race([
  browser.close().then(() => true).catch(() => false),
  new Promise(resolve => setTimeout(() => resolve(false), 5000))
]);
console.log(`BROWSER_CLOSED|${browserClosed}`);
if (!browserClosed && browserPid) spawnSync('taskkill.exe', ['/PID', String(browserPid), '/T', '/F'], { timeout: 5000, windowsHide: true });
process.exit(failed.length ? 1 : 0);
