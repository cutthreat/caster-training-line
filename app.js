const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('#mobile-menu');
const briefDialog = document.querySelector('#brief-dialog');
const briefForm = briefDialog?.querySelector('.brief-panel');
const briefFeedback = briefDialog?.querySelector('.brief-feedback');
const copyBriefButton = briefDialog?.querySelector('[data-copy-brief]');
let briefTrigger = null;

const resetCopyState = () => {
  if (copyBriefButton?.firstChild) copyBriefButton.firstChild.textContent = 'Скопировать бриф ';
  if (briefFeedback) {
    briefFeedback.textContent = '';
    briefFeedback.classList.remove('success');
  }
};

const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 20);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

const closeMenu = () => {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
  mobileMenu.classList.remove('open');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
};

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  if (open) return closeMenu();
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Закрыть меню');
  mobileMenu.hidden = false;
  mobileMenu.classList.add('open');
  document.body.classList.add('menu-open');
});

mobileMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const closeBrief = () => {
  if (!briefDialog?.open) return;
  briefDialog.close();
  briefTrigger?.focus();
};

document.querySelectorAll('[data-open-brief]').forEach((button) => {
  button.addEventListener('click', () => {
    briefTrigger = button;
    resetCopyState();
    briefDialog?.showModal();
    briefDialog?.querySelector('[name="task"]')?.focus();
  });
});

briefDialog?.querySelectorAll('[data-close-brief]').forEach((button) => button.addEventListener('click', closeBrief));
briefDialog?.addEventListener('click', (event) => {
  if (event.target === briefDialog) closeBrief();
});
briefForm?.addEventListener('submit', (event) => event.preventDefault());

briefForm?.querySelectorAll('textarea, input').forEach((field) => {
  field.addEventListener('input', () => {
    field.removeAttribute('aria-invalid');
    resetCopyState();
  });
});

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // File previews may block the modern Clipboard API; use a local fallback.
    }
  }
  const helper = document.createElement('textarea');
  helper.value = text;
  helper.setAttribute('readonly', '');
  helper.style.position = 'fixed';
  helper.style.opacity = '0';
  document.body.appendChild(helper);
  helper.select();
  const copied = document.execCommand('copy');
  helper.remove();
  return copied;
};

copyBriefButton?.addEventListener('click', async () => {
  const taskField = briefForm?.elements.namedItem('task');
  const outcomeField = briefForm?.elements.namedItem('outcome');
  const contextField = briefForm?.elements.namedItem('context');
  const task = taskField?.value.trim() || '';
  const outcome = outcomeField?.value.trim() || '';
  const context = contextField?.value.trim() || '';
  const invalidField = task.length < 10 ? taskField : outcome.length < 10 ? outcomeField : null;

  if (invalidField) {
    invalidField.setAttribute('aria-invalid', 'true');
    invalidField.focus();
    if (briefFeedback) briefFeedback.textContent = 'Добавьте чуть больше конкретики: минимум 10 символов в первых двух полях.';
    return;
  }

  const brief = [
    'ПИЛОТ С CASTER',
    '',
    `Задача: ${task}`,
    `Что должно измениться для клиента: ${outcome}`,
    `Ссылка или контекст: ${context || 'не указано'}`,
    '',
    'Ожидаемый формат: одна задача → рабочий интерфейс → проверка Caster и Антона → доказательства и известные ограничения.'
  ].join('\n');

  const copied = await copyText(brief);
  if (briefFeedback) {
    briefFeedback.textContent = copied ? 'Бриф скопирован. Его можно вставить в письмо или рабочий чат.' : 'Не удалось скопировать автоматически. Выделите текст в полях и скопируйте вручную.';
    briefFeedback.classList.toggle('success', copied);
  }
  if (copied) {
    const label = copyBriefButton.firstChild;
    if (label) label.textContent = 'Скопировано ';
  }
});

document.querySelectorAll('.process-list li').forEach((item) => {
  const button = item.querySelector('button');
  button?.addEventListener('click', () => {
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.process-list li').forEach((row) => {
      row.classList.remove('active');
      row.querySelector('button')?.setAttribute('aria-expanded', 'false');
      const icon = row.querySelector('button i');
      if (icon) icon.textContent = '+';
    });
    if (!wasActive) {
      item.classList.add('active');
      button.setAttribute('aria-expanded', 'true');
      const icon = button.querySelector('i');
      if (icon) icon.textContent = '−';
    }
  });
});

const targets = document.querySelectorAll('.reveal, [data-reveal]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px' });
  targets.forEach((target) => observer.observe(target));
} else {
  targets.forEach((target) => target.classList.add('visible'));
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) closeMenu();
});
