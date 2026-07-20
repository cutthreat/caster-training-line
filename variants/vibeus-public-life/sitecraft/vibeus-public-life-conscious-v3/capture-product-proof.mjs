import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const packetDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(packetDir, 'product-proof', '2026-07-20');
fs.mkdirSync(outputDir, { recursive: true });

const moduleRoot = process.env.CASTER_NODE_MODULES || 'C:/Users/alexe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const playwrightPackage = moduleRoot.includes('.pnpm')
  ? path.join(moduleRoot, 'playwright', 'package.json')
  : path.join(moduleRoot, '.pnpm', 'playwright@1.61.1', 'node_modules', 'playwright', 'package.json');
const require = createRequire(playwrightPackage);
const { chromium } = require('playwright');
const edgePath = process.env.CASTER_BROWSER_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const routes = [
  { id: 'home', url: 'https://vibeus.app/', landmark: /социальная платформа|VibeUs/i },
  { id: 'catalog', url: 'https://vibeus.app/catalog', landmark: /Каталог проектов/i },
  { id: 'record', url: 'https://vibeus.app/works/launch-content-kit-df8941b5', landmark: /Launch Content Kit/i },
  { id: 'discussions', url: 'https://vibeus.app/discussions', landmark: /Обсуждения/i },
  { id: 'ai-tools', url: 'https://vibeus.app/ai-tools', landmark: /Каталог AI сервисов|AI сервис/i }
];

const browser = await chromium.launch({ headless: true, executablePath: edgePath });
const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1, locale: 'ru-RU', colorScheme: 'light', reducedMotion: 'reduce' });
const receipts = [];

for (const route of routes) {
  const page = await context.newPage();
  const consoleErrors = [];
  const requestFailures = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('requestfailed', request => requestFailures.push({ url: request.url(), error: request.failure()?.errorText || 'unknown' }));
  const response = await page.goto(route.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(800);
  const bodyText = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
  const landmarkMatched = route.landmark.test(bodyText);
  const semanticError = /страница не найдена|page not found|ошибка 404/i.test(bodyText);
  const screenshotPath = path.join(outputDir, `${route.id}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: false, animations: 'disabled' });
  const screenshotSha256 = crypto.createHash('sha256').update(fs.readFileSync(screenshotPath)).digest('hex').toUpperCase();
  receipts.push({
    id: route.id,
    requested_url: route.url,
    final_url: page.url(),
    http_status: response?.status() ?? null,
    title: await page.title(),
    landmark_matched: landmarkMatched,
    semantic_error: semanticError,
    body_excerpt: bodyText.slice(0, 900),
    screenshot: path.relative(packetDir, screenshotPath).replaceAll('\\', '/'),
    screenshot_sha256: screenshotSha256,
    viewport: { width: 1440, height: 960 },
    console_errors: consoleErrors,
    request_failures: requestFailures.filter(item => !/analytics|google|yandex|metrika/i.test(item.url))
  });
  await page.close();
}

await browser.close();
fs.writeFileSync(path.join(outputDir, 'runtime-receipts.json'), `${JSON.stringify({ captured_at: new Date().toISOString(), routes: receipts }, null, 2)}\n`, 'utf8');

const failed = receipts.filter(item => item.http_status !== 200 || !item.landmark_matched || item.semantic_error);
console.log(JSON.stringify({ outputDir, routes: receipts.map(({ id, http_status, landmark_matched, semantic_error, screenshot_sha256 }) => ({ id, http_status, landmark_matched, semantic_error, screenshot_sha256 })), failed: failed.map(item => item.id) }, null, 2));
process.exitCode = failed.length ? 1 : 0;
