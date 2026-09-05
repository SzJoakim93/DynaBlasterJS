var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var font = new Font("GFX/Fonts.png", 10, 9, 16, 16);
var arrowImg = new Image();
arrowImg.src = "GFX/Arrow.png";

var mainMenu = new MainMenu();
var mapMenu = new MapMenu();
var multiPlayerMenu = new MultiplayerMenu();
var inGame = new InGame();
var introScene = new Intro();
var outroScene = new Outro();
var creditScene = new CreditChoice();
var resultsScene = new MResult();
var mStartScene = new MStart();
var podiumScene = new MPodium();
var drawScene = new MDrawGame();
var splashScreen = new SplashScreen();
var scene = splashScreen;

canvas.width = 640;
canvas.height = 480;

function sizeCanvas() {
    var scaleX = (innerWidth - 20) / canvas.width;
    var scaleY = (innerHeight - 20) / canvas.height;

    var scaleToFit = Math.min(scaleX, scaleY);

    myCanvas.style.transformOrigin = "50% 0 0"; //scale from top left
    myCanvas.style.transform = "translateX(" + (innerWidth / 2 - canvas.width / 2).toString() + "px) scale(" + scaleToFit.toString() + ")";
}

sizeCanvas();
addEventListener("resize", sizeCanvas);

function drawText(x, y, color, size, text) {
    ctx.font = size.toString() + "px Arial";
    ctx.fillStyle = color;
    ctx.fillText(text.toString(), x, y);
}

window.requestAnimationFrame = function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function (f) {
            window.setTimeout(f, 1e3 / 60);
        }
}();

function main() {
    gamepadButtonDownHandler();
    scene.handleEvents();
    scene.rendering();
}

limitLoop(main, 20);