import { chromium } from 'file:///C:/Users/alexe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.61.1/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const mode = process.argv[2] || 'baseline';
const output = path.join(here, mode);
const base = process.argv[3] || 'https://cutthreat.github.io/caster-training-line/variants/vibeus-public-life/';
await fs.mkdir(output, { recursive: true });
const cases = [];
const reportPath = path.join(output, 'runtime.json');
async function persist() {
  await fs.writeFile(reportPath, JSON.stringify({ schema: 'vibeus_public_life_capture.v2', generatedAt: new Date().toISOString(), mode, base, cases }, null, 2));
}

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  args: ['--no-first-run', '--no-default-browser-check', '--disable-extensions']
});

async function captureViewport(page, name) {
  const cdp = await page.context().newCDPSession(page);
  const image = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
  await cdp.detach();
  await fs.writeFile(path.join(output, `${name}.png`), Buffer.from(image.data, 'base64'));
}

async function open(page, url) {
  let last;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForTimeout(1800);
      return response;
    } catch (error) {
      last = error;
      await page.waitForTimeout(attempt * 1500);
    }
  }
  throw last;
}

async function inspectPage(page, url, id, screenshot = true) {
  const consoleErrors = [], pageErrors = [], failedRequests = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText || 'unknown' }));
  const response = await open(page, url);
  const receipt = await page.evaluate(() => ({
    url: location.href,
    title: document.title,
    h1: [...document.querySelectorAll('h1')].map(n => n.textContent.trim()),
    headings: [...document.querySelectorAll('h1,h2,h3')].map(n => n.textContent.trim()).slice(0, 40),
    links: [...document.querySelectorAll('a[href]')].map(n => ({ text: n.textContent.trim(), href: n.href })).filter(n => n.text).slice(0, 60),
    landmarkText: document.body.innerText.replace(/\s+/g, ' ').trim().slice(0, 2400),
    bodyClass: document.body.className,
    viewport: { width: innerWidth, height: innerHeight },
    document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches
  }));
  if (screenshot) await captureViewport(page, id);
  return { id, requestedUrl: url, status: response?.status() || null, receipt, consoleErrors, pageErrors, failedRequests };
}

for (const hero of ['default', 'quantum', 'singularity']) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const url = hero === 'default' ? base : `${base}?hero=${hero}`;
  cases.push(await inspectPage(page, url, `hero-${hero}-desktop`));
  await persist();
  await Promise.race([context.close(), new Promise(resolve => setTimeout(resolve, 3000))]);
}

for (const size of [{ name: 'tablet', width: 820, height: 1060 }, { name: 'mobile', width: 390, height: 844 }, { name: 'narrow', width: 320, height: 720 }]) {
  for (const hero of ['default', 'quantum', 'singularity']) {
    const context = await browser.newContext({ viewport: { width: size.width, height: size.height }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const url = hero === 'default' ? base : `${base}?hero=${hero}`;
    cases.push(await inspectPage(page, url, `hero-${hero}-${size.name}`));
    await persist();
    await Promise.race([context.close(), new Promise(resolve => setTimeout(resolve, 3000))]);
  }
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await open(page, base);
  for (const [id, selector] of [['section-orientation', '#about'], ['section-record', '#record'], ['section-journey', '#path'], ['section-reasons', '#projects'], ['section-collective', '#people'], ['section-final', '.final-cta']]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await captureViewport(page, id);
  }
  const accessibility = await page.evaluate(() => ({
    h1Count: document.querySelectorAll('h1').length,
    unnamedButtons: [...document.querySelectorAll('button')].filter(n => !(n.getAttribute('aria-label') || n.innerText.trim() || n.querySelector('.sr-only')?.textContent.trim())).length,
    duplicateIds: [...document.querySelectorAll('[id]')].map(n => n.id).filter((id, i, all) => all.indexOf(id) !== i)
  }));
  cases.push({ id: 'section-and-a11y-receipt', accessibility });
  await persist();
  await Promise.race([context.close(), new Promise(resolve => setTimeout(resolve, 3000))]);
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await open(page, base);
  const button = page.locator('[data-menu-button]');
  await button.focus();
  await button.click();
  const openState = await button.getAttribute('aria-expanded');
  await page.keyboard.press('Escape');
  const closedState = await button.getAttribute('aria-expanded');
  const focusRestored = await button.evaluate(node => document.activeElement === node);
  cases.push({ id: 'mobile-menu-receipt', openState, closedState, focusRestored });
  await persist();
  await Promise.race([context.close(), new Promise(resolve => setTimeout(resolve, 3000))]);
}

for (const target of [
  ['vibeus-home', 'https://vibeus.app/'],
  ['vibeus-catalog', 'https://vibeus.app/catalog'],
  ['vibeus-auth', 'https://vibeus.app/auth'],
  ['vibeus-project', 'https://vibeus.app/works/launch-content-kit-df8941b5']
]) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  try {
    cases.push(await inspectPage(page, target[1], target[0]));
  } catch (error) {
    cases.push({ id: target[0], requestedUrl: target[1], error: error.message });
  }
  await persist();
  await Promise.race([context.close(), new Promise(resolve => setTimeout(resolve, 3000))]);
}

await persist();
await Promise.race([browser.close(), new Promise(resolve => setTimeout(resolve, 4000))]);
console.log(JSON.stringify(cases.map(c => ({ id: c.id, status: c.status, final: c.receipt?.url, h1: c.receipt?.h1, overflow: c.receipt?.overflow, console: c.consoleErrors?.length, page: c.pageErrors?.length, failed: c.failedRequests?.length, error: c.error })), null, 2));
process.exit(0);
