import { readFile } from 'node:fs/promises';

const [html, css, js] = await Promise.all([
  readFile('index.html', 'utf8'),
  readFile('styles.css', 'utf8'),
  readFile('app.js', 'utf8')
]);

const checks = [];
const check = (name, condition) => checks.push({ name, passed: Boolean(condition) });
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);

check('one H1', (html.match(/<h1\b/g) || []).length === 1);
check('unique IDs', new Set(ids).size === ids.length);
check('local anchors resolve', anchors.every((anchor) => ids.includes(anchor)));
check('Caster and Anton roles are explicit', html.includes('Форма и ритм.') && html.includes('Логика и доверие.'));
check('primary CTA is consistent', (html.match(/Проверить на задаче/g) || []).length >= 3 && html.includes('Собрать бриф'));
check('no invented performance metrics', !/>[^<]*\d+%[^<]*</.test(html));
check('no local data transmission', !/\b(?:fetch|XMLHttpRequest|localStorage)\b/.test(js));
check('no empty or fake mail action', !/mailto:/i.test(html));
check('brief builder is real and local', html.includes('id="brief-dialog"') && js.includes("navigator.clipboard?.writeText") && js.includes("document.execCommand('copy')"));
check('brief fields are constrained', (html.match(/minlength="10"/g) || []).length === 2 && (html.match(/required/g) || []).length >= 2);
check('accordion accessibility state exists', js.includes("setAttribute('aria-expanded'"));
check('mobile menu has open and close labels', js.includes('Открыть меню') && js.includes('Закрыть меню'));
check('mobile layout and overflow constraints exist', css.includes('@media(max-width:620px)') && css.includes('overflow-wrap:break-word'));
check('reduced motion is supported', css.includes('@media(prefers-reduced-motion:reduce)'));
check('anchor offset is supported', css.includes('scroll-margin-top'));

for (const result of checks) console.log(`${result.passed ? 'PASS' : 'FAIL'}  ${result.name}`);
const failed = checks.filter((result) => !result.passed);
if (failed.length) {
  console.error(`\n${failed.length} check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log(`\n${checks.length}/${checks.length} checks passed.`);
}
