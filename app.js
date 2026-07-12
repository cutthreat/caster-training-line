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
const receipt = document.querySelector('#receipt');
const receiptText = document.querySelector('#receipt-text');
const errorFor = key => form?.querySelector(`[data-error="${key}"]`);
const clearErrors = () => form?.querySelectorAll('.field-error').forEach(item => { item.textContent=''; });
const setStep = step => { form?.querySelectorAll('[data-form-step]').forEach(item => { item.hidden=item.dataset.formStep!==String(step); item.classList.toggle('current-step',item.dataset.formStep===String(step)); }); document.querySelectorAll('.form-progress span').forEach((item,index)=>item.classList.toggle('current',index<step)); };
const validateContact = () => { clearErrors(); const name=String(new FormData(form).get('name')||'').trim(); const phone=String(new FormData(form).get('phone')||'').trim(); const consent=form.querySelector('input[type=checkbox]').checked; let valid=true; if(name.length<2){errorFor('name').textContent='Введите имя минимум из 2 символов';valid=false;} if(!/^\+?7[\d ()-]{10,}$/.test(phone)){errorFor('phone').textContent='Введите телефон в формате +7 999 123 45 67';valid=false;} if(!consent){errorFor('consent').textContent='Нужно согласие, чтобы продолжить';valid=false;} if(!valid){status.textContent='Проверьте поля — на следующий шаг пока нельзя перейти.';status.classList.add('error');} return valid; };
document.querySelector('#next-step')?.addEventListener('click',()=>{if(validateContact()){status.textContent='Шаг 1 сохранён. Проверьте формат заявки.';status.classList.remove('error');setStep(2);}});
document.querySelector('#back-step')?.addEventListener('click',()=>{setStep(1);status.textContent='Проверьте контактные данные перед продолжением.';});
const showStored = () => { const saved=JSON.parse(localStorage.getItem('line-demo-request')||'null'); if(!saved||!receipt)return; form.hidden=true; receipt.hidden=false; receiptText.textContent=`Номер ${saved.id}. ${saved.name}, мы сохранили контакт ${saved.phone} в демо-контуре. Реальная отправка появится после подключения CRM.`; };
form?.addEventListener('submit', event => {
  event.preventDefault();
  if(!validateContact()) return;
  const data = new FormData(form); const name=String(data.get('name')||'').trim(); const phone=String(data.get('phone')||'').trim(); const consent=form.querySelector('input[type=checkbox]').checked; let valid=true;
  const saved={id:`ЛН-${Date.now().toString().slice(-6)}`,name,phone,audience:data.get('audience')||'personal',createdAt:new Date().toISOString()}; localStorage.setItem('line-demo-request',JSON.stringify(saved)); status.textContent='Заявка сохраняется…';
  setTimeout(()=>{form.hidden=true;receipt.hidden=false;receiptText.textContent=`Номер ${saved.id}. ${name}, мы сохранили контакт ${phone} в демо-контуре. Реальная отправка появится после подключения CRM.`;},350);
});
document.querySelector('#new-request')?.addEventListener('click',()=>{localStorage.removeItem('line-demo-request');form.reset();clearErrors();setStep(1);form.hidden=false;receipt.hidden=true;status.textContent='Демо-отправка: заявка сохранится в этом браузере и получит номер.';status.classList.remove('ok','error');});
showStored();
const searchToggle=document.querySelector('#search-toggle'); const searchPanel=document.querySelector('#search-panel'); const searchInput=searchPanel?.querySelector('input');
const setSearch=open=>{searchPanel.hidden=!open;searchToggle.setAttribute('aria-expanded',String(open));if(open)searchInput.focus()};
searchToggle?.addEventListener('click',()=>setSearch(searchPanel.hidden)); document.querySelector('#search-close')?.addEventListener('click',()=>setSearch(false));
const searchResult=document.querySelector('#search-result');
document.querySelector('#search-form')?.addEventListener('submit',event=>{event.preventDefault();const q=new FormData(event.currentTarget).get('search');searchResult.textContent=q?`Показали бы результаты для «${q}» — в прототипе поиск ограничен этим экраном.`:'Введите запрос';});
const menuToggle=document.querySelector('#menu-toggle'); const nav=document.querySelector('#main-nav');
menuToggle?.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');menuToggle.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('[data-audience]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-audience]').forEach(item=>item.classList.remove('audience-active'));button.classList.add('audience-active');const business=button.dataset.audience==='business';document.querySelector('#hero-title').innerHTML=business?'Деньги,<br><strong>которые работают.</strong>':'Деньги,<br><strong>которые успевают.</strong>';document.querySelector('#hero-lead').textContent=business?'Счёт, платежи и контроль команды в одном понятном рабочем пространстве.':'Оплачивайте привычное, получайте больше и видите всё важное в одном приложении.';document.querySelector('#hero-action').firstChild.textContent=business?'Открыть счёт ':'Оформить карту ';document.querySelector('#hero-action').href=business?'#how':'#apply';}));
document.querySelectorAll('input[name="phone"]').forEach(input=>input.addEventListener('input',event=>{event.target.value=event.target.value.replace(/[^\d+()\- ]/g,'').slice(0,18)}));
document.querySelectorAll('#main-nav a').forEach(link=>link.addEventListener('click',()=>{nav?.classList.remove('is-open');menuToggle?.setAttribute('aria-expanded','false');}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!searchPanel.hidden)setSearch(false);});
