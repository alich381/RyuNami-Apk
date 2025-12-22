// JAM


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
