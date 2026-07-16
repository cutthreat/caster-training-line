import { readFile } from 'node:fs/promises';
const root = new URL('./', import.meta.url);

const [html, css, js] = await Promise.all([
  readFile(new URL('index.html', root), 'utf8'),
  readFile(new URL('styles.css', root), 'utf8'),
  readFile(new URL('app.js', root), 'utf8')
]);
const checks = [];
const check = (name, condition) => checks.push({ name, passed: Boolean(condition) });
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);

check('one H1', (html.match(/<h1\b/g) || []).length === 1);
check('unique IDs', new Set(ids).size === ids.length);
check('local anchors resolve', anchors.every(anchor => ids.includes(anchor)));
check('current catalogue route used', html.includes('https://vibeus.app/catalog') && !html.includes('vibeus.app/projects'));
check('three source-backed project links', ['ai-code-review-checklist-929d9281','launch-content-kit-df8941b5','prompt-sprint-planner-7cb8f67c'].every(key => html.includes(key) && js.includes(key)));
check('proof tabs are accessible', (html.match(/role="tab"/g) || []).length === 3 && html.includes('role="tabpanel"'));
check('keyboard tab navigation implemented', js.includes('ArrowLeft') && js.includes('ArrowRight'));
check('menu open and close states', js.includes("'Закрыть меню'") && js.includes("'Открыть меню'"));
check('real theme state implemented', js.includes("dataset.theme") && css.includes('body[data-theme="dark"]'));
check('no fake async or data transmission', !/fetch|XMLHttpRequest|localStorage/.test(js));
check('no invented marketing metrics', !/>[^<]*\b\d+[кkмm%]\+?\b[^<]*</i.test(html));
check('no generated visual dependency', !/<img\b/i.test(html));
check('mobile and 320 rules', css.includes('@media(max-width:620px)') && css.includes('@media(max-width:340px)'));
check('reduced motion supported', css.includes('@media(prefers-reduced-motion:reduce)'));
check('visible legal and support routes', ['terms','privacy','support'].every(route => html.includes(`vibeus.app/${route}`)));
check('no credential or personal data form', !/<input|<form/i.test(html));
check('process rationale absent from UI', !/>[^<]*(?:верификатор|source-bound|дизайн-система|AI-шаблон|прототип)[^<]*</i.test(html));

for (const result of checks) console.log(`${result.passed ? 'PASS' : 'FAIL'}  ${result.name}`);
const failed = checks.filter(result => !result.passed);
if (failed.length) { console.error(`\n${failed.length} check(s) failed.`); process.exitCode = 1; }
else console.log(`\n${checks.length}/${checks.length} checks passed.`);
