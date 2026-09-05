function Sound(src, isLoop) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  if (isLoop) {
    this.sound.loop = true;
  }
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  
  this.play = function () {
    this.sound.play();
  }

  this.stop = function () {
    this.sound.pause();
    this.sound.currentTime = 0;
  }
}
