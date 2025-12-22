function updateTime(){
  const time = new Date().toLocaleTimeString('id-ID',{
    timeZone:'Asia/Jakarta'
  });
  document.getElementById('time').innerText = time;
}

setInterval(updateTime,1000);
updateTime();
