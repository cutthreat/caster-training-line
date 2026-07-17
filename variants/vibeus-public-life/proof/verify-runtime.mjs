import { chromium } from 'file:///C:/Users/alexe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.61.1/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const base = process.argv[2] || 'http://127.0.0.1:8777/variants/vibeus-public-life/';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', args: ['--no-first-run', '--disable-extensions'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
const page = await context.newPage();
const consoleErrors = [], pageErrors = [], failedRequests = [];
page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
page.on('pageerror', error => pageErrors.push(error.message));
page.on('requestfailed', request => failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(900);
const heroMotion = await page.evaluate(() => ({
  bodyClass: document.body.className,
  canvas: { width: document.querySelector('[data-code-rain]')?.width, height: document.querySelector('[data-code-rain]')?.height },
  fragments: document.querySelectorAll('[data-code-foreground] span').length,
  reduced: matchMedia('(prefers-reduced-motion: reduce)').matches
}));
await page.locator('#path').evaluate(node => scrollTo(0, node.offsetTop + (node.offsetHeight - innerHeight) * .55));
await page.waitForTimeout(200);
const journey = await page.evaluate(() => ({
  transform: getComputedStyle(document.querySelector('[data-track]')).transform,
  progressWidth: getComputedStyle(document.querySelector('[data-progress]')).width,
  current: document.querySelector('[data-step-current]').textContent,
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
}));
const checks = [
  { name: 'code-engine-running', pass: heroMotion.bodyClass.includes('hero-code') && heroMotion.canvas.width > 0 && heroMotion.fragments === 7 && !heroMotion.reduced },
  { name: 'journey-transforms', pass: journey.transform !== 'none' && journey.current !== '01' },
  { name: 'no-horizontal-overflow', pass: journey.overflow === 0 },
  { name: 'clean-console', pass: !consoleErrors.length && !pageErrors.length && !failedRequests.length }
];
const report = { schema: 'vibeus_public_life_runtime_verifier.v1', generatedAt: new Date().toISOString(), base, heroMotion, journey, consoleErrors, pageErrors, failedRequests, checks, passed: checks.filter(x => x.pass).length, failed: checks.filter(x => !x.pass).length };
await fs.writeFile(path.join(here, 'final', 'motion-runtime.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close(), new Promise(resolve => setTimeout(resolve, 3000))]);
process.exit(report.failed ? 1 : 0);
