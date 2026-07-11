const tabs = [...document.querySelectorAll('.tab')];
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(item => item.classList.remove('active'));
  tab.classList.add('active');
}));
const form = document.querySelector('#apply-form');
const status = document.querySelector('#form-status');
form?.addEventListener('submit', event => {
  event.preventDefault();
  const name = new FormData(form).get('name');
  status.textContent = `Спасибо, ${name}. Следующий шаг готов — подключите CRM перед запуском.`;
  status.classList.add('ok');
  form.reset();
});
