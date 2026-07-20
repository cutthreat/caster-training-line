import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const packetDir = path.dirname(fileURLToPath(import.meta.url));
const variantDir = path.resolve(packetDir, '..', '..');
const outputDir = path.join(packetDir, 'system-proof');
const sourcePath = path.join(variantDir, 'index.html');
const sourceUrl = pathToFileURL(sourcePath).href;
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
const moduleRoot = process.env.CASTER_NODE_MODULES || 'C:/Users/alexe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const playwrightPackage = moduleRoot.includes('.pnpm')
  ? path.join(moduleRoot, 'playwright', 'package.json')
  : path.join(moduleRoot, '.pnpm', 'playwright@1.61.1', 'node_modules', 'playwright', 'package.json');
const require = createRequire(playwrightPackage);
const { chromium } = require('playwright');
const edgePath = process.env.CASTER_BROWSER_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const actionFilter = process.env.DESTINATION_ACTION || '';
const actions = [
  { id: 'act-catalog-hero', selector: '[data-proof-action="catalog-hero"]', url: 'https://vibeus.app/catalog', landmark: /Каталог проектов/i },
  { id: 'act-auth-hero', selector: '.hero-auth-desktop', url: 'https://vibeus.app/auth', landmark: /Войти|Регистрац|Создать аккаунт/i },
  { id: 'act-open-record', selector: '.button-outline', url: 'https://vibeus.app/works/launch-content-kit-df8941b5', landmark: /Launch Content Kit/i },
  { id: 'act-catalog-proof', selector: '[data-proof-action="catalog-proof"]', url: 'https://vibeus.app/catalog', landmark: /Каталог проектов/i },
  { id: 'act-discussions', selector: '[data-route="discussions"]', url: 'https://vibeus.app/discussions', landmark: /Обсуждения/i },
  { id: 'act-tools', selector: '[data-route="tools"]', url: 'https://vibeus.app/ai-tools', landmark: /AI-инструменты|Каталог AI сервисов|AI сервис/i },
  { id: 'act-auth-final', selector: '.button-light', url: 'https://vibeus.app/auth', landmark: /Войти|Регистрац|Создать аккаунт/i }
].filter(action => !actionFilter || action.id === actionFilter);

const browser = await chromium.launch({ headless: true, executablePath: edgePath, args: ['--headless=new', '--no-first-run', '--disable-extensions'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'ru-RU', reducedMotion: 'reduce' });
const receipts = [];
for (const action of actions) {
  const page = await context.newPage();
  const consoleErrors = [];
  const requestFailures = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('requestfailed', request => requestFailures.push({ url: request.url(), error: request.failure()?.errorText || 'unknown' }));
  await page.goto(sourceUrl, { waitUntil: 'load', timeout: 20000 });
  await Promise.all([
    page.waitForURL(url => url.href.startsWith(action.url), { timeout: 25000 }),
    page.locator(action.selector).click()
  ]);
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(800);
  const bodyText = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
  const apiResponse = await context.request.get(action.url, { timeout: 20000 }).catch(() => null);
  const destinationUrl = page.url();
  const expectedLandmarkFound = action.landmark.test(bodyText);
  const semanticError = /страница не найдена|page not found|ошибка 404/i.test(bodyText);
  await page.goBack({ waitUntil: 'load', timeout: 20000 }).catch(() => null);
  const recoveryVerified = page.url().startsWith('file:') && await page.locator('#hero-title').isVisible().catch(() => false);
  receipts.push({
    action_id: action.id,
    expected_url: action.url,
    final_url: destinationUrl,
    http_status: apiResponse?.status() ?? null,
    expected_landmark_found: expectedLandmarkFound,
    recovery_verified: recoveryVerified,
    semantic_error: semanticError,
    title: await page.title(),
    body_excerpt: bodyText.slice(0, 900),
    console_errors: consoleErrors.filter(text => !/analytics|metrika/i.test(text)),
    failed_requests: requestFailures.filter(item => !/analytics|google|yandex|metrika/i.test(item.url))
  });
  await page.close();
}

const failures = receipts.filter(item => item.final_url !== item.expected_url || item.http_status !== 200 || !item.expected_landmark_found || !item.recovery_verified || item.semantic_error);
const receipt = {
  schema: 'vibeus_public_life_destination_receipts.v1',
  source: '../../index.html',
  source_sha256: sha(sourcePath),
  captured_at: new Date().toISOString(),
  actions: receipts,
  validation: { status: failures.length ? 'fail' : 'pass', failures: failures.map(item => item.action_id) }
};
const receiptName = actionFilter ? `destination-receipts-${actionFilter}.json` : 'destination-receipts.json';
fs.writeFileSync(path.join(outputDir, receiptName), `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(receipt, null, 2));
const browserClosed = await Promise.race([browser.close().then(() => true).catch(() => false), new Promise(resolve => setTimeout(() => resolve(false), 5000))]);
console.log(`BROWSER_CLOSED|${browserClosed}`);
process.exit(failures.length ? 1 : 0);
