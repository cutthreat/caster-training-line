(() => {
  const body = document.body;
  const receiptNode = document.querySelector('#catalog-proof-receipt');
  const nonCurrentFixtures = new Set(['loading', 'empty', 'error', 'expired', 'unavailable']);
  const requestedFixture = new URLSearchParams(location.search).get('catalog_state');

  let receipt = null;
  try {
    receipt = JSON.parse(receiptNode?.textContent || 'null');
  } catch {
    receipt = null;
  }

  const now = Date.now();
  const receiptIsCurrent = Boolean(
    receipt &&
    receipt.verified === true &&
    Number.isFinite(Date.parse(receipt.verified_at)) &&
    Number.isFinite(Date.parse(receipt.expires_at)) &&
    Date.parse(receipt.verified_at) <= now &&
    now <= Date.parse(receipt.expires_at)
  );

  const state = nonCurrentFixtures.has(requestedFixture)
    ? requestedFixture
    : (receiptIsCurrent ? 'current' : 'expired');

  const stateCopy = {
    current: {
      label: 'live capture / 20.07.2026',
      message: '',
      boundary: 'Снимок показывает 4 публичные записи и 4 авторов на момент проверки, а не масштаб сообщества и не библиотеку готовых решений. Состав каталога меняется.'
    },
    loading: {
      label: 'проверяем снимок',
      message: 'Проверяем актуальность снимка. Текущий каталог можно открыть напрямую.',
      boundary: 'Пока проверка не завершена, сохранённый снимок и числовые показатели не показываются.'
    },
    empty: {
      label: 'нет подтверждённых записей',
      message: 'В подтверждённом снимке нет публичных записей. Проверьте текущий каталог на VibeUs.',
      boundary: 'Пустое состояние не заменяется старыми данными или выдуманными примерами.'
    },
    error: {
      label: 'ошибка проверки',
      message: 'Не удалось подтвердить актуальность снимка. Откройте текущий каталог напрямую.',
      boundary: 'При ошибке проверки сохранённый успех скрывается: страница не выдаёт старый снимок за текущее состояние.'
    },
    expired: {
      label: 'снимок устарел',
      message: 'Снимок каталога устарел. Откройте текущую версию на VibeUs.',
      boundary: 'После срока проверки снимок и числовые показатели скрываются до нового подтверждения.'
    },
    unavailable: {
      label: 'источник недоступен',
      message: 'Источник временно недоступен. Попробуйте открыть текущий каталог на VibeUs.',
      boundary: 'Недоступность источника показывается буквально и не маскируется прежним успешным состоянием.'
    }
  };

  body.dataset.catalogState = state;
  const copy = stateCopy[state];
  document.querySelectorAll('[data-state-label]').forEach(node => { node.textContent = copy.label; });
  document.querySelectorAll('[data-state-message]').forEach(node => { node.textContent = copy.message; });
  document.querySelectorAll('[data-boundary]').forEach(node => {
    const title = node.querySelector('strong')?.outerHTML || '<strong>Честная граница доказательства</strong>';
    node.innerHTML = `${title}${copy.boundary}`;
  });

  const routeSystem = document.querySelector('[data-route-system]');
  if (routeSystem) {
    const rows = [...routeSystem.querySelectorAll('[data-route]')];
    const panels = [...routeSystem.querySelectorAll('[data-route-panel]')];

    const activateRoute = routeName => {
      if (!rows.some(row => row.dataset.route === routeName)) return;
      routeSystem.dataset.activeRoute = routeName;
      rows.forEach(row => row.classList.toggle('is-active', row.dataset.route === routeName));
      panels.forEach(panel => {
        const active = panel.dataset.routePanel === routeName;
        panel.classList.toggle('is-active', active);
        panel.hidden = !active;
      });
    };

    rows.forEach(row => {
      row.addEventListener('pointerenter', () => activateRoute(row.dataset.route));
      row.addEventListener('focusin', () => activateRoute(row.dataset.route));
    });
    activateRoute(routeSystem.dataset.activeRoute || rows[0]?.dataset.route);
  }

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.dataset.entered = 'true';
        });
      }, { rootMargin: '-10% 0px -10% 0px', threshold: 0.08 })
    : null;

  document.querySelectorAll('[data-chapter]').forEach(chapter => {
    if (observer) observer.observe(chapter);
    else chapter.dataset.entered = 'true';
  });

  window.__VIBEUS_PUBLIC_LIFE_PROOF__ = Object.freeze({
    catalogState: state,
    receiptCurrent: receiptIsCurrent,
    claimId: receipt?.claim_id || null,
    expectedCatalogLandmark: receipt?.landmark || null
  });
})();
