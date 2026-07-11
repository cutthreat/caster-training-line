const tabs = [...document.querySelectorAll('.tab')];
const panels = {
  black: { kicker:'КАРТА ЛИНИЯ', title:'Больше пользы<br>с каждой покупкой', lead:'Настройте карту под себя: выбирайте категории, следите за расходами и получайте возврат рублями.', action:'Получить карту', stats:[['до 7%','возврат<br>в выбранных категориях'],['0 ₽','обслуживание<br>при простых условиях'],['1 день','доставка<br>до двери']] },
  save: { kicker:'КОПИЛКА', title:'Накопления<br>без лишних правил', lead:'Отделяйте цель от повседневных расходов и наблюдайте за прогрессом в одном экране.', action:'Создать копилку', stats:[['до 12%','на остаток<br>по условиям продукта'],['24/7','свободный<br>доступ к деньгам'],['1 цель','ясный путь<br>до результата']] },
  business: { kicker:'ЛИНИЯ ДЛЯ БИЗНЕСА', title:'Рабочие деньги<br>в одной системе', lead:'Счёт, платежи и команда собраны в понятном интерфейсе для ежедневных решений.', action:'Открыть счёт', stats:[['0 ₽','открытие<br>и обслуживание'],['1 день','подключение<br>к сервису'],['24/7','контроль<br>операций']] }
};
const renderPanel = key => { const data=panels[key]; document.querySelector('#panel-kicker').textContent=data.kicker; document.querySelector('#panel-title').innerHTML=data.title; document.querySelector('#panel-lead').textContent=data.lead; document.querySelector('#panel-action').firstChild.textContent=`${data.action} `; document.querySelector('#panel-stats').innerHTML=data.stats.map(item=>`<div><strong>${item[0]}</strong><span>${item[1]}</span></div>`).join(''); };
tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(item => item.classList.remove('active'));
  tab.classList.add('active');
  renderPanel(tab.dataset.panel);
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
const searchToggle=document.querySelector('#search-toggle'); const searchPanel=document.querySelector('#search-panel'); const searchInput=searchPanel?.querySelector('input');
const setSearch=open=>{searchPanel.hidden=!open;searchToggle.setAttribute('aria-expanded',String(open));if(open)searchInput.focus()};
searchToggle?.addEventListener('click',()=>setSearch(searchPanel.hidden)); document.querySelector('#search-close')?.addEventListener('click',()=>setSearch(false));
document.querySelector('#search-form')?.addEventListener('submit',event=>{event.preventDefault();const q=new FormData(event.currentTarget).get('search');if(q) searchInput.value=`Поиск: ${q}`;});
const menuToggle=document.querySelector('#menu-toggle'); const nav=document.querySelector('#main-nav');
menuToggle?.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menuToggle.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('input[name="phone"]').forEach(input=>input.addEventListener('input',event=>{event.target.value=event.target.value.replace(/[^\d+()\- ]/g,'').slice(0,18)}));
