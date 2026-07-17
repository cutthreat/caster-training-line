import { chromium } from 'file:///C:/Users/alexe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.61.1/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const base = process.argv[2] || 'http://127.0.0.1:8788/variants/vibeus-public-life/';
const output = path.join(here, process.argv[3] || 'refresh-v3');
await fs.mkdir(output, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  args: ['--no-first-run', '--no-default-browser-check', '--disable-extensions']
});

const checks = [];
const failures = [];
const check = (name, pass, detail = null) => checks.push({ name, pass: Boolean(pass), detail });

async function inspect(url, viewport, options = {}) {
  const context = await browser.newContext({ viewport, reducedMotion: options.reducedMotion || 'reduce', forcedColors: options.forcedColors || 'none' });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => failures.push(error.message));
  page.on('requestfailed', request => failures.push(`${request.url()} ${request.failure()?.errorText || 'failed'}`));
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(900);
  if (options.textSpacing) {
    await page.addStyleTag({ content: '*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}' });
  }
  const receipt = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    const proof = document.querySelector('[data-hero-proof]');
    const primary = document.querySelector('.button-primary');
    const secondary = document.querySelector('.hero-actions .text-link');
    const box = node => node ? node.getBoundingClientRect().toJSON() : null;
    const overlaps = (a, b) => a && b && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    const proofBox = box(proof);
    const primaryBox = box(primary);
    const secondaryBox = box(secondary);
    return {
      bodyClass: document.body.className,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelector('h1')?.innerText,
      hero: box(hero), proof: proofBox, primary: primaryBox, secondary: secondaryBox,
      proofOverPrimary: overlaps(proofBox, primaryBox),
      proofOverSecondary: overlaps(proofBox, secondaryBox),
      fragments: document.querySelectorAll('[data-code-foreground] span').length,
      activeElement: document.activeElement?.tagName
    };
  });
  if (options.screenshot) await page.screenshot({ path: path.join(output, options.screenshot), fullPage: false });
  await context.close();
  return { ...receipt, consoleErrors };
}

const active = await inspect(base, { width: 1440, height: 1000 }, { reducedMotion: 'no-preference', screenshot: 'hero-default-active-desktop.png' });
check('active-code-has-semantic-fragments', active.bodyClass.includes('hero-code') && active.fragments === 7, active);
check('active-code-clean', !active.consoleErrors.length && !failures.length, active.consoleErrors);

const tablet = await inspect(base, { width: 820, height: 1060 });
check('tablet-proof-does-not-cover-actions', !tablet.proofOverPrimary && !tablet.proofOverSecondary, tablet);
check('tablet-zero-overflow', tablet.overflow === 0, tablet.overflow);

for (const hero of ['code', 'quantum', 'singularity']) {
  const url = hero === 'code' ? base : `${base}?hero=${hero}`;
  const narrow = await inspect(url, { width: 320, height: 720 }, { textSpacing: true });
  check(`${hero}-text-spacing-zero-overflow`, narrow.overflow === 0, narrow);
  check(`${hero}-text-spacing-actions-clear`, !narrow.proofOverPrimary && !narrow.proofOverSecondary, narrow);
}

const forced = await inspect(base, { width: 390, height: 844 }, { forcedColors: 'active' });
check('forced-colors-zero-overflow', forced.overflow === 0, forced);

const result = {
  schema: 'vibeus_public_life_refresh_verifier.v1',
  generatedAt: new Date().toISOString(),
  base,
  checks,
  failures,
  passed: checks.filter(item => item.pass).length,
  failed: checks.filter(item => !item.pass).length
};
await fs.writeFile(path.join(output, 'refresh-verification.json'), JSON.stringify(result, null, 2));
await browser.close();
console.log(JSON.stringify(result, null, 2));
process.exit(result.failed || failures.length ? 1 : 0);
