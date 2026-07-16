(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');

  const closeMenu = () => {
    if (!menuButton || !mobileNav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Меню';
    mobileNav.hidden = true;
  };

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    if (open) return closeMenu();
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.textContent = 'Закрыть';
    mobileNav.hidden = false;
  });

  mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const routeData = {
    projects: {
      title: 'Проекты и решения',
      copy: 'Откройте рабочую реализацию и адаптируйте её под свою задачу.',
      href: 'https://vibeus.app/projects'
    },
    discussions: {
      title: 'Разборы проблем',
      copy: 'Посмотрите, что уже пробовали другие и где нашли рабочий путь.',
      href: 'https://vibeus.app/discussions'
    },
    tools: {
      title: 'AI-инструменты',
      copy: 'Выберите инструмент, который расширит возможности вашей следующей попытки.',
      href: 'https://vibeus.app/ai-tools'
    }
  };

  const result = document.querySelector('[data-route-result]');
  const resultTitle = document.querySelector('[data-result-title]');
  const resultCopy = document.querySelector('[data-result-copy]');
  const resultLink = document.querySelector('[data-result-link]');
  const resultPanels = {
    empty: document.querySelector('.result-empty'),
    loading: document.querySelector('.result-loading'),
    success: document.querySelector('.result-success'),
    error: document.querySelector('.result-error')
  };
  let resultTimer;

  const setResultState = (state) => {
    result.dataset.state = state;
    Object.entries(resultPanels).forEach(([name, panel]) => {
      if (!panel) return;
      panel.hidden = name !== state;
      if (name === 'loading') panel.setAttribute('aria-hidden', String(name !== state));
    });
  };

  document.querySelectorAll('[data-route]').forEach((button) => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-route]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      const route = routeData[button.dataset.route];
      clearTimeout(resultTimer);
      setResultState('loading');
      resultTimer = window.setTimeout(() => {
        if (!route) {
          setResultState('error');
          return;
        }
        resultTitle.textContent = route.title;
        resultCopy.textContent = route.copy;
        resultLink.href = route.href;
        setResultState('success');
      }, reducedMotion ? 0 : 360);
    });
  });

  const preview = document.querySelector('[data-preview-image]');
  const previewFrame = document.querySelector('.route-preview');
  document.querySelectorAll('[data-preview]').forEach((link) => {
    const swapPreview = () => {
      if (!preview || preview.getAttribute('src') === link.dataset.preview) return;
      previewFrame?.classList.add('is-changing');
      window.setTimeout(() => {
        preview.setAttribute('src', link.dataset.preview);
        previewFrame?.classList.remove('is-changing');
      }, reducedMotion ? 0 : 180);
    };
    link.addEventListener('mouseenter', swapPreview);
    link.addEventListener('focus', swapPreview);
  });
})();
