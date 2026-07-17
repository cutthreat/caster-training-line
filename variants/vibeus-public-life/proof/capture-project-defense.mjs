import { chromium } from 'file:///C:/Users/alexe/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.61.1/node_modules/playwright/index.mjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(here, 'project-defense');
const target = process.argv[2] || 'https://cutthreat.github.io/caster-training-line/variants/vibeus-public-life/';
const screenshotPath = path.join(output, 'vibeus-public-life-fullpage.png');
const receiptPath = path.join(output, 'capture-receipt.json');

await fs.mkdir(output, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  args: ['--no-first-run', '--no-default-browser-check', '--disable-extensions']
});

const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
  colorScheme: 'dark',
  reducedMotion: 'reduce'
});
const page = await context.newPage();
const consoleErrors = [];
const pageErrors = [];
const failedRequests = [];

page.on('console', message => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});
page.on('pageerror', error => pageErrors.push(error.message));
page.on('requestfailed', request => failedRequests.push({
  url: request.url(),
  error: request.failure()?.errorText || 'unknown'
}));

const response = await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(1800);
for (const image of await page.locator('img').all()) {
  await image.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
}
await page.evaluate(async () => {
  await document.fonts.ready;
  await Promise.race([
    Promise.all([...document.images].map(image => image.complete
      ? Promise.resolve()
      : new Promise(resolve => {
          image.addEventListener('load', resolve, { once: true });
          image.addEventListener('error', resolve, { once: true });
        }))),
    new Promise(resolve => setTimeout(resolve, 10000))
  ]);
  scrollTo(0, 0);
});
await page.waitForTimeout(500);

const receipt = await page.evaluate(() => ({
  schema: 'vibeus_project_defense_capture.v1',
  generatedAt: new Date().toISOString(),
  url: location.href,
  title: document.title,
  status: null,
  viewport: { width: innerWidth, height: innerHeight },
  document: {
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight
  },
  horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
  fonts: document.fonts.status,
  images: {
    total: document.images.length,
    loaded: [...document.images].filter(image => image.complete && image.naturalWidth > 0).length
  },
  sections: [...document.querySelectorAll('main > section')].map(section => ({
    id: section.id || section.className,
    heading: section.querySelector('h1,h2')?.textContent.trim().replace(/\s+/g, ' ') || null
  }))
}));
receipt.status = response?.status() || null;
receipt.consoleErrors = consoleErrors;
receipt.pageErrors = pageErrors;
receipt.failedRequests = failedRequests;

await page.screenshot({
  path: screenshotPath,
  type: 'png',
  fullPage: true,
  animations: 'disabled'
});
await fs.writeFile(receiptPath, JSON.stringify(receipt, null, 2));

await context.close();
await browser.close();

if (
  receipt.status !== 200 ||
  receipt.horizontalOverflow !== 0 ||
  receipt.fonts !== 'loaded' ||
  receipt.images.loaded !== receipt.images.total ||
  consoleErrors.length ||
  pageErrors.length ||
  failedRequests.length
) {
  console.error(JSON.stringify(receipt, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ screenshotPath, receiptPath, receipt }, null, 2));
