function CreditChoice() {
    this.bg = new Image();
    this.bg.src = "GFX/CreditBg.png";
    this.gameOverTitle = new Image();
    this.gameOverTitle.src = "GFX/GameOver.png";

    this.bgMusic = new Sound("Music/CreditUsage.mp3");

    this.currentMenu = new Menu(font, arrowImg, FONT_BASED, 230, 330, 20, 20);
    this.currentMenu.addMenuPointText("Continume", function () {
        if (inGame.credits > 0) {
            inGame.credits--;
            inGame.players[inGame.lastDeadPlayer].life = 3;
            inGame.alivePlayers++;
            inGame.reset();
            mapMenu.switchToLevelTitle();
        } else {
            scene = mainMenu;
        }

        creditScene.bgMusic.stop();
    });
    this.currentMenu.addMenuPointText("End game", function () { scene = mainMenu; creditScene.bgMusic.stop(); });

    this.handleEvents = function () {
        this.currentMenu.handleEvents();
    }

    this.rendering = function () {
        ctx.fillStyle = "#0080c0";
        ctx.fillRect(65, 0, canvas.width - 130, canvas.height);

        ctx.drawImage(this.bg, 121, 165);

        if (inGame.credits > 0) {
            font.apply("Remaining credits: " + inGame.credits.toString(), 121, 420);
        } else {
            ctx.drawImage(this.gameOverTitle, 163, 75);
        }

        this.currentMenu.rendering();
    }

    this.switch = function (index) {
        this.bgMusic.play();
        this.lastDeadPlayer = index;
        scene = this;

    }
}