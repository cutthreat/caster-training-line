import fs from 'node:fs';

const html = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('./app.js', import.meta.url), 'utf8');
const checks = [];
const check = (name, pass, detail = '') => checks.push({ name, pass: Boolean(pass), detail });

check('one-semantic-h1', (html.match(/<h1\b/g) || []).length === 1);
check('catalog-proof-is-primary', /button-primary[^>]+href="#projects"/.test(html) && /id="projects"[\s\S]+href="https:\/\/vibeus\.app\/catalog"/.test(html));
check('auth-is-secondary', /text-link[^>]+href="https:\/\/vibeus\.app\/auth"/.test(html));
check('honest-registration-receipt', html.includes('Смотреть можно без регистрации'));
check('availability-boundary', html.includes('Посмотреть, перейти, скопировать или запустить можно только то'));
check('all-hero-variants', ['code:', 'quantum:', 'singularity:'].every(token => js.includes(token)));
check('variant-specific-product-copy', ['с пустого чата.', 'Откройте продолжения.', 'исчезнуть после «готово».'].every(token => js.includes(token)));
check('real-product-proof-in-hero', /hero-proof[\s\S]+assets\/vibeus-project\.png/.test(html));
check('variant-semantic-routes', ['ЧУЖОЙ ОПЫТ', 'ОБСУДИТЬ · РАЗВИТЬ', 'ПУБЛИЧНЫЙ СЛЕД'].every(token => js.includes(token)));
check('reduced-motion-path', css.includes('@media(prefers-reduced-motion:reduce)') && js.includes("prefers-reduced-motion: reduce"));
check('escape-and-focus-return', js.includes("event.key === 'Escape'") && js.includes('menuButton.focus()'));
check('no-hidden-overflow-on-body', !/body\s*\{[^}]*overflow-x\s*:\s*hidden/i.test(css));
check('no-inventory-count-claim', !/\b\d{2,}\s+(проект|автор)/i.test(html));
check('catalog-snapshot-labelled', html.includes('состав и счётчики не являются текущими'));
check('no-guaranteed-reaction', !/гарант|обязательно получите|получите реакцию|репутаци/i.test(html + js));
check('real-product-screens', html.includes('assets/vibeus-project.png') && html.includes('assets/vibeus-catalog.png'));
check('source-and-rights', fs.existsSync(new URL('./SOURCE_AND_RIGHTS.md', import.meta.url)));

const failed = checks.filter(item => !item.pass);
console.log(JSON.stringify({ schema: 'vibeus_public_life_static_verifier.v1', passed: checks.length - failed.length, failed: failed.length, checks }, null, 2));
if (failed.length) process.exit(1);
