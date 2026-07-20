import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const outputDir = path.dirname(fileURLToPath(import.meta.url));
const variantPath = 'variants/vibeus-public-life';
const baseUrl = process.env.VIBEUS_LIVE_URL || 'https://cutthreat.github.io/caster-training-line/variants/vibeus-public-life/';
const commit = process.env.VIBEUS_DEPLOY_SHA;
const workflowRuns = (process.env.VIBEUS_PAGES_RUNS || '').split(',').map(value => Number(value.trim())).filter(Number.isInteger);

if (!commit || !/^[0-9a-f]{40}$/i.test(commit)) {
  throw new Error('VIBEUS_DEPLOY_SHA must be the 40-character deployed commit SHA');
}
if (workflowRuns.length < 2) {
  throw new Error('VIBEUS_PAGES_RUNS must contain the comma-separated deployment workflow IDs');
}

fs.mkdirSync(outputDir, { recursive: true });
const sha = value => crypto.createHash('sha256').update(value).digest('hex').toUpperCase();
const cacheKey = commit.slice(0, 12);
const live = suffix => `${baseUrl}${suffix ? suffix : ''}${suffix.includes('?') ? '&' : '?'}build=${cacheKey}`;

const moduleRoot = process.env.CASTER_NODE_MODULES || 'C:/Users/alexe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const playwrightPackage = moduleRoot.includes('.pnpm')
  ? path.join(moduleRoot, 'playwright', 'package.json')
  : path.join(moduleRoot, '.pnpm', 'playwright@1.61.1', 'node_modules', 'playwright', 'package.json');
const require = createRequire(playwrightPackage);
const { chromium } = require('playwright');
const edgePath = process.env.CASTER_BROWSER_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const browser = await chromium.launch({
  headless: true,
  executablePath: edgePath,
  args: ['--headless=new', '--no-first-run', '--disable-extensions']
});

const sourceFiles = [
  'index.html',
  'styles.css',
  'app.js',
  'assets/vibeus-record-2026-07-20.png',
  'assets/vibeus-catalog-2026-07-20.png',
  'assets/vibeus-discussions-2026-07-20.png',
  'assets/vibeus-ai-tools-2026-07-20.png',
  'assets/onest-400.ttf',
  'assets/onest-600.ttf',
  'assets/onest-800.ttf'
];

const identityContext = await browser.newContext();
const sourceIdentity = [];
for (const relativePath of sourceFiles) {
  const expected = execFileSync('git', ['show', `${commit}:${variantPath}/${relativePath}`], {
    encoding: null,
    maxBuffer: 12 * 1024 * 1024
  });
  const response = await identityContext.request.get(live(relativePath), { timeout: 30000 });
  const actual = await response.body();
  sourceIdentity.push({
    path: relativePath,
    status: response.status(),
    expected_sha256: sha(expected),
    live_sha256: sha(actual),
    byte_identical: expected.equals(actual)
  });
}
await identityContext.close();

const viewportCases = [
  { id: 'desktop-1440', viewport: { width: 1440, height: 1000 }, fullPage: true },
  { id: 'mobile-390', viewport: { width: 390, height: 844 }, fullPage: true },
  { id: 'narrow-320', viewport: { width: 320, height: 720 }, fullPage: true },
  { id: 'mobile-no-js', viewport: { width: 390, height: 844 }, fullPage: true, javaScriptEnabled: false },
  { id: 'mobile-script-failure', viewport: { width: 390, height: 844 }, fullPage: true, scriptFailure: true }
];

const viewportResults = [];
for (const test of viewportCases) {
  const context = await browser.newContext({
    viewport: test.viewport,
    locale: 'ru-RU',
    reducedMotion: 'reduce',
    javaScriptEnabled: test.javaScriptEnabled !== false
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];
  const badResponses = [];

  page.on('console', message => {
    if (message.type() === 'error') {
      const location = message.location();
      consoleErrors.push({ text: message.text(), url: location.url || '', line: location.lineNumber ?? null });
    }
  });
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('requestfailed', request => {
    const expectedAbort = test.scriptFailure && /\/app\.js(?:\?|$)/.test(request.url());
    if (!expectedAbort) failedRequests.push({ url: request.url(), error: request.failure()?.errorText || 'unknown' });
  });
  page.on('response', response => {
    if (response.status() >= 400) badResponses.push({ url: response.url(), status: response.status() });
  });
  if (test.scriptFailure) {
    await page.route('**/app.js*', route => route.abort('failed'));
  }

  const response = await page.goto(live('?catalog_state=current'), { waitUntil: 'load', timeout: 30000 });
  if (test.javaScriptEnabled !== false && !test.scriptFailure) {
    await page.waitForFunction(() => document.body.dataset.catalogState !== 'loading', null, { timeout: 10000 });
  }
  await page.evaluate(() => document.fonts?.ready).catch(() => null);
  await page.evaluate(async () => {
    const step = Math.max(360, Math.floor(window.innerHeight * 0.75));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 70));
    }
    window.scrollTo(0, 0);
    const visibleImages = [...document.images].filter(image => image.getClientRects().length > 0);
    await Promise.race([
      Promise.all(visibleImages.map(image => image.decode?.().catch(() => null))),
      new Promise(resolve => setTimeout(resolve, 3000))
    ]);
  }).catch(() => null);
  await page.waitForTimeout(600);

  const metrics = await page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const images = [...document.images].map(image => ({
      src: image.currentSrc || image.src,
      complete: image.complete,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      visible: Boolean(image.offsetWidth || image.offsetHeight || image.getClientRects().length)
    }));
    const statePanel = document.querySelector('.catalog-degraded');
    const currentProofNodes = [...document.querySelectorAll('[data-catalog-current]')];
    return {
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.replace(/\s+/g, ' ').trim() || '',
      body_catalog_state: body.dataset.catalogState || null,
      client_width: root.clientWidth,
      scroll_width: Math.max(root.scrollWidth, body.scrollWidth),
      horizontal_overflow: Math.max(root.scrollWidth, body.scrollWidth) - root.clientWidth,
      document_height: Math.max(root.scrollHeight, body.scrollHeight),
      fonts_status: document.fonts?.status || 'unsupported',
      failed_images: images.filter(image => image.visible && (!image.complete || image.naturalWidth === 0)),
      image_count: images.length,
      state_panel_visible: statePanel ? Boolean(statePanel.offsetWidth || statePanel.offsetHeight || statePanel.getClientRects().length) : false,
      current_proof_visible: currentProofNodes.some(node => Boolean(node.offsetWidth || node.offsetHeight || node.getClientRects().length)),
      primary_catalog_cta_visible: Boolean(document.querySelector('[data-proof-action="catalog-hero"]')?.getClientRects().length)
    };
  });

  const screenshotPath = path.join(outputDir, `${test.id}-full.png`);
  await page.screenshot({ path: screenshotPath, fullPage: test.fullPage });
  viewportResults.push({
    id: test.id,
    url: page.url(),
    http_status: response?.status() ?? null,
    viewport: test.viewport,
    screenshot: path.basename(screenshotPath),
    screenshot_sha256: sha(fs.readFileSync(screenshotPath)),
    ...metrics,
    console_errors: consoleErrors,
    page_errors: pageErrors,
    failed_requests: failedRequests,
    bad_responses: badResponses
  });
  await context.close();
}

const actions = [
  { id: 'catalog-hero', selector: '[data-proof-action="catalog-hero"]', url: 'https://vibeus.app/catalog', landmark: /Каталог проектов/i },
  { id: 'auth-hero', selector: '.hero-auth-desktop', url: 'https://vibeus.app/auth', landmark: /Войти|Регистрац|Создать аккаунт/i },
  { id: 'open-record', selector: '.button-outline', url: 'https://vibeus.app/works/launch-content-kit-df8941b5', landmark: /Launch Content Kit/i },
  { id: 'catalog-proof', selector: '[data-proof-action="catalog-proof"]', url: 'https://vibeus.app/catalog', landmark: /Каталог проектов/i },
  { id: 'discussions', selector: '[data-route="discussions"]', url: 'https://vibeus.app/discussions', landmark: /Обсуждения/i },
  { id: 'tools', selector: '[data-route="tools"]', url: 'https://vibeus.app/ai-tools', landmark: /AI-инструменты|Каталог AI сервисов|AI сервис/i },
  { id: 'auth-final', selector: '.button-light', url: 'https://vibeus.app/auth', landmark: /Войти|Регистрац|Создать аккаунт/i }
];

const routeContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'ru-RU', reducedMotion: 'reduce' });
const routeResults = [];
for (const action of actions) {
  const page = await routeContext.newPage();
  await page.goto(live('?catalog_state=current'), { waitUntil: 'load', timeout: 30000 });
  await Promise.all([
    page.waitForURL(url => url.href.startsWith(action.url), { timeout: 30000 }),
    page.locator(action.selector).click()
  ]);
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => null);
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => null);
  await page.getByText(action.landmark).first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => null);
  await page.waitForTimeout(500);
  const destinationText = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
  const destinationResponse = await routeContext.request.get(action.url, { timeout: 30000 }).catch(() => null);
  const finalUrl = page.url();
  await page.goBack({ waitUntil: 'load', timeout: 30000 }).catch(() => null);
  const recoveryVerified = page.url().startsWith(baseUrl) && await page.locator('#hero-title').isVisible().catch(() => false);
  routeResults.push({
    action_id: action.id,
    expected_url: action.url,
    final_url: finalUrl,
    http_status: destinationResponse?.status() ?? null,
    expected_landmark_found: action.landmark.test(destinationText),
    semantic_error: /страница не найдена|page not found|ошибка 404/i.test(destinationText),
    recovery_verified: recoveryVerified
  });
  await page.close();
}
await routeContext.close();

const identityFailures = sourceIdentity.filter(item => item.status !== 200 || !item.byte_identical);
const viewportFailures = viewportResults.filter(item => {
  const normal = !/no-js|script-failure/.test(item.id);
  const degraded = !normal;
  return item.http_status !== 200
    || item.title !== 'VibeUs — дайте AI-проекту публичную жизнь'
    || item.h1 !== 'Сделали с AI? Дайте проекту публичную жизнь.'
    || item.horizontal_overflow > 0
    || item.fonts_status !== 'loaded'
    || item.failed_images.length > 0
    || item.console_errors.filter(error => !(item.id === 'mobile-script-failure' && (/app\.js/.test(error.url) || /ERR_FAILED/.test(error.text)))).length > 0
    || item.page_errors.length > 0
    || item.failed_requests.length > 0
    || item.bad_responses.length > 0
    || !item.primary_catalog_cta_visible
    || (normal && item.body_catalog_state !== 'current')
    || (normal && !item.current_proof_visible)
    || (degraded && item.current_proof_visible)
    || (degraded && !item.state_panel_visible);
});
const routeFailures = routeResults.filter(item => item.http_status !== 200
  || !item.final_url.startsWith(item.expected_url)
  || !item.expected_landmark_found
  || item.semantic_error
  || !item.recovery_verified);

const receipt = {
  schema: 'vibeus_public_life_post_deploy_receipt.v1',
  captured_at: new Date().toISOString(),
  public_url: baseUrl,
  deployed_commit: commit,
  pages_workflow_runs: workflowRuns,
  source_identity: sourceIdentity,
  viewports: viewportResults,
  destinations: routeResults,
  validation: {
    status: identityFailures.length || viewportFailures.length || routeFailures.length ? 'fail' : 'pass',
    source_identity: `${sourceIdentity.length - identityFailures.length}/${sourceIdentity.length}`,
    viewports: `${viewportResults.length - viewportFailures.length}/${viewportResults.length}`,
    destinations: `${routeResults.length - routeFailures.length}/${routeResults.length}`,
    failures: [
      ...identityFailures.map(item => `source:${item.path}`),
      ...viewportFailures.map(item => `viewport:${item.id}`),
      ...routeFailures.map(item => `destination:${item.action_id}`)
    ]
  },
  claim_ceiling: 'exact published GitHub Pages source identity plus headless Edge geometry/runtime/destination proof; no real-device, participant, conversion, cross-browser or post-auth claim'
};

fs.writeFileSync(path.join(outputDir, 'post-deploy-receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(receipt.validation, null, 2));
await browser.close();
process.exit(receipt.validation.status === 'pass' ? 0 : 1);
