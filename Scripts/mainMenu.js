function MainMenu() {
    this.bg = new Image();
    this.bg.src = "GFX/MenuBg.png";

    this.mainTitle = new Image();
    this.mainTitle.src = "GFX/MenuTitle.png";

    this.bgOffset = 480;

    this.currentMenu = new Menu(font, arrowImg, FONT_BASED, 230, 320, 20, 20);
    this.currentMenu.addMenuPointText("New Game", startNewGame);
    this.currentMenu.addMenuPointText("Continume", continueGame);
    this.currentMenu.addMenuPointText("Battle mode", battleMode);
    this.currentMenu.addMenuPointText("Quit", function () { window.close(); });

    this.bgMusic = new Sound("Music/Menu.mp3");

    this.handleEvents = function () {
        this.currentMenu.handleEvents();
        if (this.bgOffset > 186) {
            this.bgOffset -= 8;
        }
    }

    this.rendering = function () {
        ctx.fillStyle = "#6080c0";
        ctx.fillRect(65, 0, canvas.width - 130, canvas.height);
        ctx.drawImage(this.bg, 65, this.bgOffset);

        if (this.bgOffset > 186) {
            return;
        }

        ctx.drawImage(this.mainTitle, 92, 20);
        this.currentMenu.rendering();
    }

    this.switch = function () {
        this.bgOffset = 480;
        scene = this;
        this.bgMusic.play();
    }
}

function startNewGame() {
    multiPlayerMenu.switchMenu(3);
    scene = multiPlayerMenu;
    mainMenu.bgMusic.stop();
}

function battleMode() {
    multiPlayerMenu.switchMenu(0);
    scene = multiPlayerMenu;
    mainMenu.bgMusic.stop();
}

function continueGame() {
    if (inGame.loadGame()) {
        mainMenu.bgMusic.stop();
        mapMenu.switch();
    }
}
