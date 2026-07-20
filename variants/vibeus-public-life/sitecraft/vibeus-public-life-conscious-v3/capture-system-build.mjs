import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const packetDir = path.dirname(fileURLToPath(import.meta.url));
const variantDir = path.resolve(packetDir, '..', '..');
const outputDir = path.join(packetDir, 'system-proof');
fs.mkdirSync(outputDir, { recursive: true });
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

const cases = [
  { id: 'hero-desktop', viewport: { width: 1440, height: 1000 }, motion: 'reduce' },
  { id: 'proof-desktop', viewport: { width: 1440, height: 1000 }, motion: 'reduce', target: '#proof' },
  { id: 'record-desktop', viewport: { width: 1440, height: 1000 }, motion: 'reduce', target: '#record' },
  { id: 'routes-desktop', viewport: { width: 1440, height: 1000 }, motion: 'reduce', target: '#routes' },
  { id: 'join-desktop', viewport: { width: 1440, height: 1000 }, motion: 'reduce', target: '#join' },
  { id: 'hero-mobile', viewport: { width: 390, height: 844 }, motion: 'reduce' },
  { id: 'routes-mobile', viewport: { width: 390, height: 844 }, motion: 'reduce', target: '#routes' },
  { id: 'desktop-full', viewport: { width: 1440, height: 1000 }, motion: 'no-preference', fullPage: true },
  { id: 'desktop-reduced-full', viewport: { width: 1440, height: 1000 }, motion: 'reduce', fullPage: true },
  { id: 'mobile-full', viewport: { width: 390, height: 844 }, motion: 'reduce', fullPage: true },
  { id: 'narrow-320-full', viewport: { width: 320, height: 720 }, motion: 'reduce', fullPage: true },
  { id: 'catalog-expired', viewport: { width: 1440, height: 1000 }, motion: 'reduce', query: '?catalog_state=expired', target: '#proof' },
  { id: 'catalog-loading', viewport: { width: 390, height: 844 }, motion: 'reduce', query: '?catalog_state=loading', target: '#proof' },
  { id: 'catalog-empty', viewport: { width: 390, height: 844 }, motion: 'reduce', query: '?catalog_state=empty', target: '#proof' },
  { id: 'catalog-error', viewport: { width: 390, height: 844 }, motion: 'reduce', query: '?catalog_state=error', target: '#proof' },
  { id: 'catalog-unavailable', viewport: { width: 390, height: 844 }, motion: 'reduce', query: '?catalog_state=unavailable', target: '#proof' },
  { id: 'catalog-no-js', viewport: { width: 390, height: 844 }, motion: 'reduce', noJs: true, expectedCatalogState: 'loading', target: '#proof' },
  { id: 'catalog-script-failure', viewport: { width: 390, height: 844 }, motion: 'reduce', scriptFailure: true, expectedCatalogState: 'loading', target: '#proof' },
  { id: 'media-off', viewport: { width: 390, height: 844 }, motion: 'reduce', mediaOff: true, fullPage: true },
  { id: 'text-spacing', viewport: { width: 390, height: 844 }, motion: 'reduce', textSpacing: true, fullPage: true },
  { id: 'content-stress', viewport: { width: 320, height: 720 }, motion: 'reduce', contentStress: true, fullPage: true },
  { id: 'forced-colors', viewport: { width: 1280, height: 900 }, motion: 'reduce', forcedColors: 'active', target: '#routes' }
];

const browser = await chromium.launch({
  headless: true,
  executablePath: edgePath,
  timeout: 20000,
  args: ['--headless=new', '--no-first-run', '--disable-extensions', '--disable-gpu']
});

const receipts = [];
for (const test of cases) {
  const context = await browser.newContext({
    viewport: test.viewport,
    locale: 'ru-RU',
    colorScheme: 'dark',
    reducedMotion: test.motion,
    forcedColors: test.forcedColors || 'none',
    javaScriptEnabled: !test.noJs
  });
  if (test.mediaOff) {
    await context.route('**/*', route => route.request().resourceType() === 'image' ? route.abort('blockedbyclient') : route.continue());
  }
  if (test.scriptFailure) {
    await context.route('**/app.js', route => route.abort('failed'));
  }
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  const consoleErrors = [];
  const expectedConsoleErrors = [];
  const pageErrors = [];
  const requestFailures = [];
  const expectedRequestFailures = [];
  page.on('console', message => {
    if (message.type() !== 'error') return;
    const text = message.text();
    if (test.mediaOff && /ERR_BLOCKED_BY_CLIENT/i.test(text)) return;
    if (test.scriptFailure && /ERR_FAILED|Failed to load resource/i.test(text)) {
      expectedConsoleErrors.push(text);
      return;
    }
    consoleErrors.push(text);
  });
  page.on('requestfailed', request => {
    const failure = { url: request.url(), error: request.failure()?.errorText || 'unknown' };
    if (test.scriptFailure && request.resourceType() === 'script' && /\/app\.js$/i.test(request.url())) {
      expectedRequestFailures.push(failure);
      return;
    }
    if (!test.mediaOff || request.resourceType() !== 'image') requestFailures.push(failure);
  });
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(`${sourceUrl}${test.query || ''}`, { waitUntil: 'load', timeout: 20000 });
  await Promise.race([page.evaluate(() => document.fonts.ready), new Promise(resolve => setTimeout(resolve, 5000))]);
  await page.evaluate(async () => {
    const essential = [...document.querySelectorAll('.record-window img, .catalog-window > img')];
    await Promise.all(essential.map(image => image.decode?.().catch(() => {}) || Promise.resolve()));
  });
  await page.waitForTimeout(180);

  if (test.textSpacing) {
    await page.addStyleTag({ content: 'body{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}' });
  }
  if (test.contentStress) {
    await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const route = document.querySelector('.route-name strong');
      const condition = document.querySelector('.action-condition');
      if (h1) h1.textContent = 'Сверхдлинное название проекта, сделанного вместе с искусственным интеллектом';
      if (route) route.textContent = 'Конкретный экспериментальный проект с очень длинным названием';
      if (condition) condition.append(' Дополнительное важное условие остаётся рядом с действием и не должно обрезаться.');
    });
  }
  if (test.target) {
    await page.locator(test.target).evaluate(node => node.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'instant' }));
    await page.waitForTimeout(120);
  }

  const screenshotPath = path.join(outputDir, `${test.id}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: Boolean(test.fullPage), animations: 'disabled', timeout: 30000 });
  const geometry = await page.evaluate(() => {
    const visible = node => Boolean(node) && getComputedStyle(node).display !== 'none' && getComputedStyle(node).visibility !== 'hidden' && node.getBoundingClientRect().width > 0 && node.getBoundingClientRect().height > 0;
    const primary = document.querySelector('.button-coral')?.getBoundingClientRect();
    const currentImage = document.querySelector('.catalog-window > img');
    const degraded = document.querySelector('.catalog-degraded');
    const materialSelectors = ['.action-condition', '.evidence-boundary', '.demo-boundary', '.route-boundary', '.availability-note'];
    const materialFonts = materialSelectors.map(selector => {
      const node = document.querySelector(selector);
      return { selector, px: node ? Number.parseFloat(getComputedStyle(node).fontSize) : null };
    });
    return {
      scroll_width: document.documentElement.scrollWidth,
      client_width: document.documentElement.clientWidth,
      body_scroll_width: document.body.scrollWidth,
      scroll_height: document.documentElement.scrollHeight,
      fonts_status: document.fonts.status,
      sections: [...document.querySelectorAll('[data-chapter]')].map(node => node.id),
      primary_action: primary ? { top: primary.top, bottom: primary.bottom, left: primary.left, right: primary.right } : null,
      catalog_state: document.body.dataset.catalogState,
      catalog_image_visible: visible(currentImage),
      degraded_visible: visible(degraded),
      degraded_message: document.querySelector('[data-state-message]')?.textContent.trim() || '',
      reduced_motion_matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
      fragment_animation: getComputedStyle(document.querySelector('.file-fragment')).animationName,
      forced_colors_matches: matchMedia('(forced-colors: active)').matches,
      material_fonts: materialFonts,
      route_links: [...document.querySelectorAll('[data-route]')].map(node => node.href),
      proof_state: window.__VIBEUS_PUBLIC_LIFE_PROOF__ || null
    };
  });
  receipts.push({
    id: test.id,
    route: `index.html${test.query || ''}${test.target || ''}`,
    viewport: test.viewport,
    reduced_motion: test.motion,
    forced_colors: test.forcedColors || 'none',
    screenshot: path.relative(packetDir, screenshotPath).replaceAll('\\', '/'),
    screenshot_sha256: sha(screenshotPath),
    geometry,
    overflow: geometry.scroll_width > geometry.client_width || geometry.body_scroll_width > geometry.client_width,
    console_errors: consoleErrors,
    expected_console_errors: expectedConsoleErrors,
    page_errors: pageErrors,
    request_failures: requestFailures,
    expected_request_failures: expectedRequestFailures
  });
  await context.close();
}

const interactionContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'ru-RU', reducedMotion: 'reduce' });
const interactionPage = await interactionContext.newPage();
await interactionPage.goto(sourceUrl, { waitUntil: 'load', timeout: 20000 });
await interactionPage.locator('[data-route="discussions"]').focus();
await interactionPage.waitForTimeout(100);
const routeInteraction = await interactionPage.evaluate(() => ({
  active_route: document.querySelector('[data-route-system]')?.dataset.activeRoute,
  discussions_panel_visible: !document.querySelector('[data-route-panel="discussions"]')?.hidden,
  focused_href: document.activeElement?.getAttribute('href') || null
}));
await interactionContext.close();

const actionContext = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'ru-RU', reducedMotion: 'reduce' });
const actionPage = await actionContext.newPage();
await actionPage.goto(sourceUrl, { waitUntil: 'load', timeout: 20000 });
await Promise.all([
  actionPage.waitForURL(url => url.href.startsWith('https://vibeus.app/catalog'), { timeout: 25000 }),
  actionPage.locator('[data-proof-action="catalog-hero"]').click()
]);
await actionPage.waitForLoadState('domcontentloaded', { timeout: 20000 }).catch(() => {});
await actionPage.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
await actionPage.getByText('Каталог проектов', { exact: false }).first().waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
await actionPage.waitForTimeout(1000);
const actionBody = (await actionPage.locator('body').innerText()).replace(/\s+/g, ' ').trim();
const actionScreenshot = path.join(outputDir, 'catalog-action-destination.png');
await actionPage.screenshot({ path: actionScreenshot, fullPage: false, animations: 'disabled' });
const actionReceipt = {
  action_id: 'act-catalog-hero',
  expected_url: 'https://vibeus.app/catalog',
  final_url: actionPage.url(),
  expected_landmark: 'Каталог проектов',
  landmark_matched: /Каталог проектов/i.test(actionBody),
  semantic_error: /страница не найдена|page not found|ошибка 404/i.test(actionBody),
  title: await actionPage.title(),
  screenshot: path.relative(packetDir, actionScreenshot).replaceAll('\\', '/'),
  screenshot_sha256: sha(actionScreenshot)
};
await actionContext.close();

const receipt = {
  schema: 'vibeus_public_life_system_capture.v1',
  captured_at: new Date().toISOString(),
  source_artifacts: ['index.html', 'styles.css', 'app.js'].map(file => ({
    path: `../../${file}`,
    sha256: sha(path.join(variantDir, file))
  })),
  cases: receipts,
  interaction_receipts: [routeInteraction],
  action_receipts: [actionReceipt]
};

const failures = [];
for (const item of receipts) {
  if (item.overflow) failures.push(`${item.id}:overflow`);
  if (item.geometry.fonts_status !== 'loaded') failures.push(`${item.id}:fonts`);
  if (item.console_errors.length) failures.push(`${item.id}:console`);
  if (item.page_errors.length) failures.push(`${item.id}:page-error`);
  if (item.request_failures.length) failures.push(`${item.id}:network`);
      if (item.geometry.sections.join('|') !== 'top|record|proof|routes|join') failures.push(`${item.id}:chapter-order`);
  if (item.geometry.material_fonts.some(entry => entry.px !== null && entry.px < 14)) failures.push(`${item.id}:material-font`);
  if (item.geometry.catalog_state === 'current' && (!item.geometry.catalog_image_visible || item.geometry.degraded_visible)) failures.push(`${item.id}:current-state`);
  if (item.geometry.catalog_state !== 'current' && (item.geometry.catalog_image_visible || !item.geometry.degraded_visible || !item.geometry.degraded_message)) failures.push(`${item.id}:fail-closed-state`);
  if (item.id === 'catalog-no-js' && (item.geometry.catalog_state !== 'loading' || item.geometry.proof_state !== null || item.expected_request_failures.length)) failures.push(`${item.id}:bootstrap-contract`);
  if (item.id === 'catalog-script-failure' && (item.geometry.catalog_state !== 'loading' || item.geometry.proof_state !== null || item.expected_request_failures.length !== 1)) failures.push(`${item.id}:bootstrap-contract`);
}
const normalMotion = receipts.find(item => item.id === 'desktop-full');
const reducedMotion = receipts.find(item => item.id === 'desktop-reduced-full');
if (normalMotion?.geometry.reduced_motion_matches !== false || normalMotion?.geometry.fragment_animation !== 'align-fragment') failures.push('motion:no-preference');
if (reducedMotion?.geometry.reduced_motion_matches !== true || reducedMotion?.geometry.fragment_animation !== 'none') failures.push('motion:reduce');
const forced = receipts.find(item => item.id === 'forced-colors');
if (forced?.geometry.forced_colors_matches !== true) failures.push('forced-colors:media');
if (routeInteraction.active_route !== 'discussions' || !routeInteraction.discussions_panel_visible || routeInteraction.focused_href !== 'https://vibeus.app/discussions') failures.push('route-preview:keyboard');
if (actionReceipt.final_url !== actionReceipt.expected_url || !actionReceipt.landmark_matched || actionReceipt.semantic_error) failures.push('action:catalog');

receipt.validation = { status: failures.length ? 'fail' : 'pass', failures };
fs.writeFileSync(path.join(outputDir, 'runtime-receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ cases: receipts.map(item => ({ id: item.id, overflow: item.overflow, state: item.geometry.catalog_state, screenshot_sha256: item.screenshot_sha256 })), routeInteraction, actionReceipt, validation: receipt.validation }, null, 2));
const browserClosed = await Promise.race([browser.close().then(() => true).catch(() => false), new Promise(resolve => setTimeout(() => resolve(false), 5000))]);
console.log(`BROWSER_CLOSED|${browserClosed}`);
process.exit(failures.length ? 1 : 0);
