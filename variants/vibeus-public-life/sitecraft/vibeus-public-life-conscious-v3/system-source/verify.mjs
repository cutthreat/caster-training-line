import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const visibleHtml = html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const checks = [];
const check = (name, pass, detail = '') => checks.push({ name, pass: Boolean(pass), detail });

const chapterIds = ['top', 'record', 'proof', 'routes', 'join'];
const chapterPositions = chapterIds.map(id => html.indexOf(`id="${id}"`));
const imageAssets = [
  'assets/vibeus-record-2026-07-20.png',
  'assets/vibeus-catalog-2026-07-20.png',
  'assets/vibeus-discussions-2026-07-20.png',
  'assets/vibeus-ai-tools-2026-07-20.png'
];

check('one-semantic-h1', (html.match(/<h1\b/g) || []).length === 1);
check('first-screen-contract', html.includes('Социальная платформа для вайбкодеров') && html.includes('Сделали с AI?') && html.includes('Дайте проекту публичную жизнь.'));
check('five-chapter-value-ladder', chapterPositions.every(position => position >= 0) && chapterPositions.every((position, index) => index === 0 || position > chapterPositions[index - 1]), chapterPositions.join(','));
check('catalog-is-primary-action', /class="button button-coral"[^>]+href="https:\/\/vibeus\.app\/catalog"/.test(html));
check('mobile-auth-after-record-proof', /<div class="record-shell">[\s\S]+class="text-link hero-auth-mobile"[^>]+href="https:\/\/vibeus\.app\/auth"/.test(html));
check('catalog-before-auth-condition', html.includes('Каталог открыт без регистрации.') && html.includes('Аккаунт понадобится, когда решите продолжить.'));
check('real-product-proof-in-hero', /hero-record[\s\S]+assets\/vibeus-record-2026-07-20\.png/.test(html));
check('fresh-dated-product-assets', imageAssets.every(asset => fs.existsSync(path.join(root, asset)) && html.includes(asset)), imageAssets.filter(asset => !fs.existsSync(path.join(root, asset))).join(','));
check('catalog-claim-owned-and-expiring', /"owner":"VibeUs product owner"/.test(html) && /"expires_at":"2026-07-21T23:59:59Z"/.test(html) && /"captured_projects":4/.test(html) && /"captured_authors":4/.test(html));
check('initial-html-fails-closed', /<body data-catalog-state="loading">/.test(html) && html.includes('снимок не подтверждён') && html.includes('Пока актуальность снимка не подтверждена') && html.includes('Снимок не подтверждён на этой странице') && !/<body data-catalog-state="current">/.test(html));
check('dynamic-counts-bound-to-current-state', /class="live-metrics" data-catalog-current/.test(html) && /body:not\(\[data-catalog-state="current"\]\) \[data-catalog-current\]/.test(css));
check('current-only-after-valid-receipt', js.includes("receiptIsCurrent ? 'current' : 'expired'") && js.indexOf('body.dataset.catalogState = state') > js.indexOf('const receiptIsCurrent'));
check('fail-closed-state-family', ['loading', 'empty', 'error', 'expired', 'unavailable'].every(state => js.includes(`'${state}'`)) && js.includes("receiptIsCurrent ? 'current' : 'expired'"));
check('fail-closed-recovery-route', /class="catalog-degraded"[\s\S]+href="https:\/\/vibeus\.app\/catalog"/.test(html));
check('evidence-boundaries', html.includes('Честная граница доказательства') && html.includes('Уровень доказательства:') && html.includes('Состав и доступность публичных страниц меняются.'));
check('no-false-scale-or-library-claim', !/(600\s*000|600k|тысяч\s+пример|готов(?:ая|ые)\s+(?:база|решени)|эконом(?:ит|ьте)\s+время)/i.test(html + js));
check('no-guaranteed-feedback-claim', !/(получите\s+реакци|гарантированн(?:ый|ую)\s+(?:отклик|реакци)|обязательно\s+ответят)/i.test(html + js) && html.includes('без обещания гарантированной реакции'));
check('direct-public-routes', [
  'https://vibeus.app/works/launch-content-kit-df8941b5',
  'https://vibeus.app/discussions',
  'https://vibeus.app/ai-tools'
].every(url => html.includes(`href="${url}"`)));
check('route-preview-keyboard-parity', js.includes("row.addEventListener('pointerenter'") && js.includes("row.addEventListener('focusin'"));
check('no-horizontal-scroll-contract', !/(?:html|body)\s*\{[^}]*overflow-x\s*:\s*(?:hidden|clip)/i.test(css) && !/scroll-snap-type\s*:\s*x/i.test(css));
check('reduced-motion-contract', css.includes('@media(prefers-reduced-motion:reduce)') && css.includes('.file-fragment{animation:align-fragment'));
check('forced-colors-contract', css.includes('@media(forced-colors:active)'));
check('local-fonts-and-display-swap', ['onest-400.ttf', 'onest-600.ttf', 'onest-800.ttf'].every(font => css.includes(font)) && (css.match(/font-display:swap/g) || []).length === 3);
check('skip-link-and-live-state', /class="skip-link" href="#main"/.test(html) && /aria-live="polite"/.test(html));
check('no-legacy-spectacle-engine', !/(quantum-field|singularity|code-rain|hero=quantum|hero=singularity)/i.test(html + css + js));
check('timeless-boundary-near-auth', /class="join-actions"[\s\S]+class="availability-note"/.test(html) && html.includes('<strong>Без входа:</strong> каталог и публичные страницы.') && html.includes('<strong>Вход:</strong> когда захотите продолжить со своим проектом.') && !html.includes('Сейчас VibeUs обновляется'));
check('no-proof-contour-jargon-in-visible-copy', !/(receipt|claim_id|stale_success|за пределами этой проверки)/i.test(visibleHtml));
check('source-and-rights', fs.existsSync(path.join(root, 'SOURCE_AND_RIGHTS.md')));

const failed = checks.filter(item => !item.pass);
console.log(JSON.stringify({ schema: 'vibeus_public_life_static_verifier.v2', passed: checks.length - failed.length, failed: failed.length, checks }, null, 2));
if (failed.length) process.exit(1);
