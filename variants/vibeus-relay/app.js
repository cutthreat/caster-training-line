const proofs = {
  code: {
    tab: 'tab-code', category: 'Инструменты разработчика', rank: '#03',
    title: 'AI Code Review Checklist',
    description: 'Практичный чеклист для проверки AI-assisted pull request перед слиянием.',
    author: 'Борис Левин · @demo_boris',
    url: 'https://vibeus.app/works/ai-code-review-checklist-929d9281'
  },
  content: {
    tab: 'tab-content', category: 'Контент и маркетинг', rank: '#02',
    title: 'Launch Content Kit',
    description: 'Контент-набор для подготовки страницы проекта к первому публичному показу.',
    author: 'Мира Соколова · @demo_mira',
    url: 'https://vibeus.app/works/launch-content-kit-df8941b5'
  },
  prompt: {
    tab: 'tab-prompt', category: 'Продуктивность', rank: '#04',
    title: 'Prompt Sprint Planner',
    description: 'Шаблон помогает быстро собрать понятное описание идеи и проверить первый пользовательский сценарий.',
    author: 'Ада Морозова · @demo_ada',
    url: 'https://vibeus.app/works/prompt-sprint-planner-7cb8f67c'
  }
};

const panel = document.querySelector('.proof-panel');
const tabs = [...document.querySelectorAll('[data-proof]')];

function selectProof(key, focus = false) {
  const proof = proofs[key];
  if (!proof) return;
  tabs.forEach(tab => {
    const active = tab.dataset.proof === key;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
  panel.setAttribute('aria-labelledby', proof.tab);
  panel.querySelector('[data-proof-category]').textContent = proof.category;
  panel.querySelector('[data-proof-rank]').textContent = proof.rank;
  panel.querySelector('[data-proof-title]').textContent = proof.title;
  panel.querySelector('[data-proof-description]').textContent = proof.description;
  panel.querySelector('[data-proof-author]').textContent = proof.author;
  panel.querySelector('[data-proof-link]').href = proof.url;
  panel.classList.remove('is-changing');
  requestAnimationFrame(() => panel.classList.add('is-changing'));
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectProof(tab.dataset.proof));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
    const next = (index + direction + tabs.length) % tabs.length;
    selectProof(tabs[next].dataset.proof, true);
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? 'Закрыть' : 'Меню';
  menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  mobileNav.hidden = !open;
}
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
mobileNav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });

const themeToggle = document.querySelector('.theme-toggle');
function setTheme(dark) {
  document.body.dataset.theme = dark ? 'dark' : 'light';
  themeToggle.setAttribute('aria-label', dark ? 'Включить светлую тему' : 'Включить тёмную тему');
}
setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
themeToggle.addEventListener('click', () => setTheme(document.body.dataset.theme !== 'dark'));

const revealItems = document.querySelectorAll('.manifesto p, .relay-steps li, .route-links a');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.animate([{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
}
