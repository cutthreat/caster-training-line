import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packetDir = path.dirname(fileURLToPath(import.meta.url));
const variantDir = path.resolve(packetDir, '..', '..');
const sourceDir = path.join(packetDir, 'system-source');
const sourceAssetsDir = path.join(sourceDir, 'assets');
const controlDir = path.join(packetDir, 'falsification');
fs.mkdirSync(sourceAssetsDir, { recursive: true });
fs.mkdirSync(controlDir, { recursive: true });

for (const file of ['index.html', 'styles.css', 'app.js', 'verify.mjs', 'SOURCE_AND_RIGHTS.md']) {
  fs.copyFileSync(path.join(variantDir, file), path.join(sourceDir, file));
}
for (const file of [
  'onest-400.ttf',
  'onest-600.ttf',
  'onest-800.ttf',
  'vibeus-record-2026-07-20.png',
  'vibeus-catalog-2026-07-20.png',
  'vibeus-discussions-2026-07-20.png',
  'vibeus-ai-tools-2026-07-20.png'
]) {
  fs.copyFileSync(path.join(variantDir, 'assets', file), path.join(sourceAssetsDir, file));
}

let control = fs.readFileSync(path.join(variantDir, 'index.html'), 'utf8');
control = control
  .replace('<link rel="stylesheet" href="styles.css">', '<meta name="robots" content="noindex"><link rel="stylesheet" href="../system-source/styles.css">')
  .replaceAll('src="assets/', 'src="../system-source/assets/')
  .replace('<script src="app.js" defer></script>', '<script src="../system-source/app.js" defer></script>')
  .replace('Сделали с AI? <em>Дайте проекту публичную жизнь.</em>', 'Сделали с AI? <em>Пора вступить в сообщество.</em>')
  .replace('Покажите работу и её контекст по одному адресу. Или сначала посмотрите, что уже публикуют.', 'Создайте аккаунт, опубликуйте работу и станьте частью сообщества AI-мейкеров.')
  .replace('href="https://vibeus.app/catalog" data-proof-action="catalog-hero">Смотреть проекты', 'href="https://vibeus.app/auth" data-proof-action="catalog-hero">Войти и опубликовать')
  .replace('<strong>Каталог открыт без регистрации.</strong> Аккаунт понадобится, когда решите продолжить.', '<strong>Регистрация займёт минуту.</strong> После входа вы сможете начать публикацию.');
fs.writeFileSync(path.join(controlDir, 'plausible-semantic.html'), control, 'utf8');

console.log(JSON.stringify({ source_snapshot: sourceDir, control: path.join(controlDir, 'plausible-semantic.html') }, null, 2));
