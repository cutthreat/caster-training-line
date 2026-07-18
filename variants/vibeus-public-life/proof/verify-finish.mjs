import { chromium } from 'file:///C:/Users/alexe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.61.1/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const base = process.argv[2] || 'http://127.0.0.1:8791/variants/vibeus-public-life/';
const output = path.join(here, process.argv[3] || 'finish-proof');
await fs.mkdir(output, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  args: ['--no-first-run', '--no-default-browser-check', '--disable-extensions']
});

const checks = [];
const issues = [];
const check = (name, pass, detail) => checks.push({ name, pass: Boolean(pass), detail });

async function createPage(viewport, reducedMotion = 'no-preference') {
  const context = await browser.newContext({ viewport, reducedMotion });
  const page = await context.newPage();
  page.on('console', message => { if (message.type() === 'error') issues.push(`console: ${message.text()}`); });
  page.on('pageerror', error => issues.push(`page: ${error.message}`));
  page.on('requestfailed', request => issues.push(`request: ${request.url()} ${request.failure()?.errorText || ''}`));
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(700);
  return { context, page };
}

{
  const { context, page } = await createPage({ width: 1440, height: 1000 });
  const order = await page.evaluate(() => ['projects', 'record', 'path', 'people'].map(id => ({ id, top: document.getElementById(id).offsetTop })));
  check('proof-before-mechanism', order.every((item, index) => index === 0 || item.top > order[index - 1].top), order);

  const primary = page.locator('.hero .button-primary');
  check('hero-primary-targets-on-page-proof', await primary.getAttribute('href') === '#projects', await primary.getAttribute('href'));
  await primary.click();
  await page.waitForTimeout(900);
  const anchorReceipt = await page.evaluate(() => {
    const section = document.getElementById('projects').getBoundingClientRect();
    const catalog = document.querySelector('#projects .catalog-window').getBoundingClientRect();
    return { hash: location.hash, sectionTop: section.top, catalogTop: catalog.top, heading: document.querySelector('#projects h2')?.innerText };
  });
  check('hero-action-arrives-at-proof', anchorReceipt.hash === '#projects' && anchorReceipt.sectionTop < 100 && anchorReceipt.heading, anchorReceipt);
  await page.screenshot({ path: path.join(output, 'catalog-after-hero-action.png') });

  const journeyMetrics = await page.evaluate(() => {
    const node = document.getElementById('path');
    return { height: node.offsetHeight, viewport: innerHeight, ratio: node.offsetHeight / innerHeight, top: node.offsetTop };
  });
  check('journey-bounded-length', journeyMetrics.ratio >= 2.5 && journeyMetrics.ratio <= 2.7, journeyMetrics);

  const ratios = [0.08, 0.3, 0.56, 0.84];
  const forward = [];
  for (let index = 0; index < ratios.length; index += 1) {
    const state = await page.evaluate(({ ratio, index }) => {
      const section = document.getElementById('path');
      const scrollable = section.offsetHeight - innerHeight;
      scrollTo({ top: section.offsetTop + scrollable * ratio, behavior: 'instant' });
      return { target: index + 1 };
    }, { ratio: ratios[index], index });
    await page.waitForTimeout(750);
    Object.assign(state, await page.evaluate(() => {
      const active = document.querySelector('.journey-track .step.is-active');
      const heading = active?.querySelector('h3')?.getBoundingClientRect();
      const windowBox = document.querySelector('.journey-window')?.getBoundingClientRect();
      return {
        current: Number(document.querySelector('[data-step-current]')?.textContent),
        label: active?.querySelector('h3')?.innerText.replace(/\s+/g, ' ').trim(),
        fullyVisible: Boolean(heading && windowBox && heading.left >= windowBox.left && heading.right <= windowBox.right && heading.top >= 0 && heading.bottom <= innerHeight),
        transform: getComputedStyle(document.querySelector('[data-track]')).transform
      };
    }));
    forward.push(state);
    await page.screenshot({ path: path.join(output, `journey-step-${String(index + 1).padStart(2, '0')}.png`) });
  }
  check('journey-four-stable-keyframes', forward.every((state, index) => state.current === index + 1 && state.fullyVisible && state.label), forward);

  await page.evaluate(() => {
    const section = document.getElementById('path');
    scrollTo({ top: section.offsetTop + (section.offsetHeight - innerHeight) * 0.3, behavior: 'instant' });
  });
  await page.waitForTimeout(750);
  const reverse = await page.locator('[data-step-current]').textContent();
  check('journey-reverse-recovers', reverse.trim() === '02', reverse.trim());
  check('desktop-zero-overflow', await page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth), await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
  await context.close();
}

{
  const { context, page } = await createPage({ width: 390, height: 844 });
  await page.locator('.final-cta').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const finalReceipt = await page.evaluate(() => {
    const viewport = innerHeight;
    const box = selector => document.querySelector(selector)?.getBoundingClientRect().toJSON();
    const visible = rect => rect && rect.top >= 0 && rect.bottom <= viewport;
    const heading = box('.final-cta h2');
    const explanation = box('.final-row>p');
    const action = box('.final-actions .button');
    return { heading, explanation, action, allVisible: visible(heading) && visible(explanation) && visible(action) };
  });
  check('mobile-final-decision-co-visible', finalReceipt.allVisible, finalReceipt);
  check('mobile-zero-overflow', await page.evaluate(() => document.documentElement.scrollWidth === document.documentElement.clientWidth), await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
  await page.screenshot({ path: path.join(output, 'mobile-final-decision.png') });
  await context.close();
}

{
  const { context, page } = await createPage({ width: 1440, height: 1000 }, 'reduce');
  await page.locator('#path').scrollIntoViewIfNeeded();
  const reducedReceipt = await page.evaluate(() => ({
    height: document.getElementById('path').offsetHeight,
    sticky: getComputedStyle(document.querySelector('.journey-sticky')).position,
    transform: getComputedStyle(document.querySelector('[data-track]')).transform,
    steps: [...document.querySelectorAll('.journey-track .step')].filter(node => node.getBoundingClientRect().height > 0).length
  }));
  check('reduced-motion-preserves-four-steps', reducedReceipt.sticky === 'relative' && reducedReceipt.transform === 'none' && reducedReceipt.steps === 4, reducedReceipt);
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${base}?hero=quantum`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(500);
  const quantum = await page.evaluate(() => ({ bodyClass: document.body.className, h1: document.querySelector('h1')?.innerText, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
  check('quantum-runtime-available', quantum.bodyClass.includes('hero-quantum') && quantum.h1.includes('Откройте продолжения') && quantum.overflow === 0, quantum);
  await context.close();
}

check('runtime-clean', issues.length === 0, issues);
const failed = checks.filter(item => !item.pass);
const result = { schema: 'vibeus_public_life_finish_verifier.v1', generatedAt: new Date().toISOString(), base, passed: checks.length - failed.length, failed: failed.length, checks };
await fs.writeFile(path.join(output, 'finish-verification.json'), JSON.stringify(result, null, 2));
await Promise.race([browser.close(), new Promise(resolve => setTimeout(resolve, 4000))]);
console.log(JSON.stringify(result, null, 2));
process.exit(failed.length ? 1 : 0);
