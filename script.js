// JAM
function updateClock(){
  const d = new Date();
  document.getElementById("clock").textContent =
    d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  document.getElementById("zone").textContent =
    Intl.DateTimeFormat().resolvedOptions().timeZone;
}
setInterval(updateClock,1000);
updateClock();

// MUSIC MANUAL
const music = document.getElementById("music");
const btn = document.getElementById("musicBtn");

function toggleMusic(){
  if(music.paused){
    music.play();
    btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  }else{
    music.pause();
    btn.innerHTML = '<i class="fa-solid fa-play"></i>';
  }
      }
<script>
function updateTime(){
  const now = new Date().toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  document.getElementById('time').innerText = now;
}

updateTime();
setInterval(updateTime, 1000);
</script>
