(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const header = $('[data-header]');
  const menuButton = $('[data-menu-button]');
  const nav = $('[data-nav]');
  const journey = $('[data-journey]');
  const track = $('[data-track]');
  const progress = $('[data-progress]');
  const currentStep = $('[data-step-current]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = window.matchMedia('(max-width: 900px)');

  const variants = {
    code: {
      kicker: 'Публичное место для AI-проектов',
      lineOne: 'Сделали с AI?',
      lineTwo: 'Покажите, что получилось.',
      lead: 'VibeUs собирает задачу, описание, изображения, стек и ссылку проекта в одной публичной карточке — чтобы её можно было понять, открыть и обсудить.',
      note: 'Код становится не концом работы, а понятной публичной записью.'
    },
    quantum: {
      kicker: 'Одна работа — много продолжений',
      lineOne: 'Покажите проект.',
      lineTwo: 'Запустите реакцию.',
      lead: 'Соберите результат и его контекст в одной публичной карточке. Точный вопрос даёт другим людям основу для предметного ответа — без обещания, что ответ обязательно появится.',
      note: 'Одна публичная работа может открыть несколько следующих направлений.'
    },
    singularity: {
      kicker: 'Не дайте готовому исчезнуть',
      lineOne: 'Проект не должен',
      lineTwo: 'пропасть после «готово».',
      lead: 'Когда результат остаётся в чате, вкладке или архиве, его трудно найти и понять. VibeUs даёт проекту публичный адрес вместе с задачей, материалами и ссылкой.',
      note: 'Публичная карточка удерживает контекст рядом с самой работой.'
    }
  };

  const requested = new URLSearchParams(location.search).get('hero') || 'code';
  const active = Object.hasOwn(variants, requested) ? requested : 'code';
  const copy = variants[active];
  document.body.classList.add(`hero-${active}`);
  $('[data-hero-kicker]').textContent = copy.kicker;
  $('[data-hero-line-one]').textContent = copy.lineOne;
  $('[data-hero-line-two]').textContent = copy.lineTwo;
  $('[data-hero-lead]').textContent = copy.lead;
  $('[data-hero-note]').textContent = copy.note;

  const setHeader = () => header.classList.toggle('is-scrolled', scrollY > 36);
  setHeader();
  addEventListener('scroll', setHeader, { passive: true });

  let menuOpen = false;
  const setMenu = (open, restoreFocus = false) => {
    menuOpen = open;
    menuButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const label = $('.sr-only', menuButton);
    if (label) label.textContent = open ? 'Закрыть меню' : 'Открыть меню';
    if (open) $('a', nav)?.focus();
    if (!open && restoreFocus) menuButton.focus();
  };
  menuButton.addEventListener('click', () => setMenu(!menuOpen));
  nav.addEventListener('click', event => {
    if (event.target.closest('a') && menuOpen) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuOpen) setMenu(false, true);
  });

  const updateJourney = () => {
    if (!journey || !track || reduced.matches || narrow.matches) return;
    const rect = journey.getBoundingClientRect();
    const scrollable = Math.max(1, journey.offsetHeight - innerHeight);
    const ratio = Math.min(1, Math.max(0, -rect.top / scrollable));
    track.style.transform = `translate3d(${-ratio * 300}%,0,0)`;
    progress.style.width = `${ratio * 100}%`;
    currentStep.textContent = String(Math.min(4, Math.floor(ratio * 4) + 1)).padStart(2, '0');
  };
  const resetJourney = () => {
    if (reduced.matches || narrow.matches) {
      track.style.transform = '';
      progress.style.width = '';
    } else updateJourney();
  };
  addEventListener('scroll', updateJourney, { passive: true });
  addEventListener('resize', resetJourney, { passive: true });
  reduced.addEventListener?.('change', resetJourney);
  narrow.addEventListener?.('change', resetJourney);
  resetJourney();

  const canvas = $('[data-code-rain]');
  const foreground = $('[data-code-foreground]');
  let animationFrame = 0;
  let columns = [];
  const glyphs = '01<>/{}[]AI';

  const seedForeground = () => {
    if (!foreground || reduced.matches || active !== 'code') return;
    const fragments = ['01 / PUBLIC', 'RESULT →', '{ context }', 'AI + PEOPLE', 'vibeus.app', 'STACK[]', 'LINK ↗'];
    foreground.replaceChildren(...fragments.map((fragment, index) => {
      const span = document.createElement('span');
      span.textContent = fragment;
      span.style.left = `${58 + (index % 3) * 13}%`;
      span.style.top = `${12 + index * 11}%`;
      return span;
    }));
  };

  const resizeCanvas = () => {
    if (!canvas) return;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * ratio);
    canvas.height = Math.round(innerHeight * ratio);
    canvas.style.width = `${innerWidth}px`;
    canvas.style.height = `${innerHeight}px`;
    const size = 17 * ratio;
    columns = Array.from({ length: Math.ceil(canvas.width / size) }, () => Math.random() * -80);
  };

  const drawCode = () => {
    if (!canvas || reduced.matches || active !== 'code' || document.hidden) return;
    const ctx = canvas.getContext('2d');
    const ratio = Math.min(devicePixelRatio || 1, 2);
    const size = 17 * ratio;
    ctx.fillStyle = 'rgba(2,5,3,.11)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${size}px monospace`;
    columns.forEach((row, index) => {
      const x = index * size;
      const y = row * size;
      const fade = Math.max(.08, Math.min(.85, (x / canvas.width) * 1.1));
      ctx.fillStyle = `rgba(184,255,61,${fade})`;
      ctx.fillText(glyphs[Math.floor(Math.random() * glyphs.length)], x, y);
      columns[index] = y > canvas.height && Math.random() > .975 ? Math.random() * -30 : row + .55;
    });
    animationFrame = requestAnimationFrame(drawCode);
  };

  const setAnimation = () => {
    cancelAnimationFrame(animationFrame);
    if (!reduced.matches && active === 'code' && !document.hidden) {
      resizeCanvas();
      drawCode();
      seedForeground();
    } else {
      canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
      foreground?.replaceChildren();
    }
  };
  addEventListener('resize', () => {
    if (!reduced.matches && active === 'code') resizeCanvas();
  }, { passive: true });
  document.addEventListener('visibilitychange', setAnimation);
  reduced.addEventListener?.('change', setAnimation);
  setAnimation();
})();
