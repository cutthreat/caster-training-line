const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('#mobile-menu');

const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 28);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

const closeMenu = () => {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
};

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  if (open) return closeMenu();
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Закрыть меню');
  mobileMenu.hidden = false;
  document.body.classList.add('menu-open');
});

mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const featureContent = {
  publish: {
    kicker: 'Готовая точка старта',
    count: '01—03',
    code: 'solution',
    context: 'goal / stack / limits',
    sheet: 'START_HERE',
    status: 'готово к адаптации',
    title: 'Не пустой экран.<br>Рабочая точка старта.',
    copy: 'Возьмите решение, которое уже довели до результата, и адаптируйте его под свою задачу.'
  },
  discuss: {
    kicker: 'Следующая версия',
    count: '02—03',
    code: 'improve',
    context: 'attempt / insight / boundary',
    sheet: 'VERSION_02',
    status: 'опыт добавлен',
    title: 'Не повторение.<br>Следующий шаг.',
    copy: 'Проверьте подход в своём контексте, добавьте находку и покажите, где решение стало сильнее.'
  },
  grow: {
    kicker: 'Общий прогресс',
    count: '03—03',
    code: 'share',
    context: 'solution / context / result',
    sheet: 'FOR_EVERYONE',
    status: 'доступно следующим',
    title: 'Не личная находка.<br>Общая сила.',
    copy: 'Верните улучшенное решение сообществу, чтобы следующий человек начинал уже с вашего результата.'
  }
};

const panel = document.querySelector('#feature-panel');
const featureButtons = document.querySelectorAll('[data-feature]');
const field = (name) => panel?.querySelector(`[data-feature-${name}]`);

featureButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const key = button.dataset.feature;
    const content = featureContent[key];
    if (!content || !panel) return;

    featureButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });

    Object.entries(content).forEach(([name, value]) => {
      const target = field(name);
      if (!target) return;
      if (name === 'title') target.innerHTML = value;
      else target.textContent = value;
    });
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      panel.animate?.([{ opacity: 0.5, transform: 'translateY(7px)' }, { opacity: 1, transform: 'none' }], { duration: 280, easing: 'cubic-bezier(.2,.75,.2,1)' });
    }
  });
});

document.querySelectorAll('.faq-list article').forEach((item) => {
  const button = item.querySelector('button');
  button?.addEventListener('click', () => {
    const open = item.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
    const icon = button.querySelector('i');
    if (icon) icon.textContent = open ? '−' : '+';
  });
});

const targets = document.querySelectorAll('.reveal, [data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -35px' });
  targets.forEach((target) => observer.observe(target));
} else {
  targets.forEach((target) => target.classList.add('visible'));
}

const hero = document.querySelector('.hero');
hero?.addEventListener('pointermove', (event) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = hero.getBoundingClientRect();
  hero.style.setProperty('--mx', `${((event.clientX - rect.left) / rect.width) * 100}%`);
  hero.style.setProperty('--my', `${((event.clientY - rect.top) / rect.height) * 100}%`);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) closeMenu();
});
