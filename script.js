// Page switch
function openPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// Theme toggle
const body = document.body;
const saved = localStorage.getItem('theme');
if(saved==='green') body.classList.add('green');

document.getElementById('themeToggle').onclick = ()=>{
  body.classList.toggle('green');
  localStorage.setItem('theme', body.classList.contains('green')?'green':'blue');
};

// Live clock (zona user)
function updateClock(){
  const d = new Date();
  const t = d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});
  document.getElementById('time').textContent = t;
  document.getElementById('zone').textContent =
    Intl.DateTimeFormat().resolvedOptions().timeZone;
}
setInterval(updateClock,1000); updateClock();

// Simple AI chat (lokal)
function sendChat(){
  const input = document.getElementById('chatInput');
  if(!input.value) return;
  const log = document.getElementById('chatLog');

  const u = document.createElement('div');
  u.className='user'; u.textContent=input.value;
  log.appendChild(u);

  const b = document.createElement('div');
  b.className='bot';
  b.textContent = "Tetap jalan, walau pelan. Yang penting konsisten.";
  log.appendChild(b);

  input.value='';
  log.scrollTop = log.scrollHeight;
}