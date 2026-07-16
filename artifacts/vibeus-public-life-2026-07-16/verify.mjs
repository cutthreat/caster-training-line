import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve('variants/vibeus-public-life');
const [html, css, js] = await Promise.all([
  readFile(resolve(root, 'index.html'), 'utf8'),
  readFile(resolve(root, 'styles.css'), 'utf8'),
  readFile(resolve(root, 'app.js'), 'utf8')
]);

const checks = [
  ['one h1', (html.match(/<h1\b/g) || []).length === 1],
  ['Russian document language', /<html lang="ru">/.test(html)],
  ['real auth destination', (html.match(/https:\/\/vibeus\.app\/auth/g) || []).length >= 3],
  ['real catalog destination', /https:\/\/vibeus\.app\/catalog/.test(html)],
  ['all images have alt', !/<img(?![^>]*\balt=)[^>]*>/i.test(html)],
  ['self-hosted font', /@font-face/.test(css) && !/fonts\.googleapis/.test(css)],
  ['reduced motion fallback', /prefers-reduced-motion/.test(css) && /reducedMotion/.test(js)],
  ['mobile reflow', /max-width:900px/.test(css) && /journey-track/.test(css)],
  ['three hero modes', ['code','quantum','singularity'].every(mode => js.includes(`'${mode}'`))],
  ['decorative hero is inert', /aria-hidden="true"[^>]*>[\s\S]*data-code-rain/.test(html)],
  ['no visible em or en dash', !/[—–]/.test(html.replace(/<script[\s\S]*?<\/script>/g,''))],
  ['no fake metrics', !/\b\d+[KkМм]\+?\b/.test(html)],
  ['skip link present', /class="skip-link"/.test(html)],
  ['menu exposes state', /aria-expanded="false"/.test(html) && /setAttribute\('aria-expanded'/.test(js)]
];

const failed = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (failed.length) process.exit(1);
console.log(`PASS ${checks.length}/${checks.length} static contracts`);
