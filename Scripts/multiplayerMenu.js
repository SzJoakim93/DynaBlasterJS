function MultiplayerMenu() {
    this.pointeImg = new Image();
    this.pointeImg.src = "GFX/MPointer.png";

    this.mMenuMode = new MultipleImage("GFX/MMenuMode.png", 1, 2, 458, 32);
    this.mMenuPlayers = new MultipleImage("GFX/MMenuPlayers.png", 1, 4, 182, 32);
    this.mMenuMatch = new MultipleImage("GFX/MMenuMatch.png", 1, 5, 140, 32);

    this.subMenus = [
        new Menu(this.mMenuMode, this.pointeImg, IMAGE_BASED, 180, 320, 66, 36),
        new Menu(this.mMenuPlayers, this.pointeImg, IMAGE_BASED, 180, 280, 66, 36),
        new Menu(this.mMenuMatch, this.pointeImg, IMAGE_BASED, 180, 260, 66, 36),
        new Menu(this.mMenuPlayers, this.pointeImg, IMAGE_BASED, 180, 280, 66, 36)
    ];

    this.subMenus[0].addMenuPointImage(0, function () { inGame.setMode(NORMAL_MODE); multiPlayerMenu.switchMenu(1); });
    this.subMenus[0].addMenuPointImage(1, function () { inGame.setMode(SKULL_MODE); multiPlayerMenu.switchMenu(1); });

    this.subMenus[1].addMenuPointImage(1, function () { inGame.initPlayerCounts(2); multiPlayerMenu.switchMenu(2); });
    this.subMenus[1].addMenuPointImage(2, function () { inGame.initPlayerCounts(3); multiPlayerMenu.switchMenu(2); });
    this.subMenus[1].addMenuPointImage(3, function () { inGame.initPlayerCounts(4); multiPlayerMenu.switchMenu(2); });

    this.subMenus[2].addMenuPointImage(0, function () { inGame.initMatchCounts(1); loadBattleMode(); });
    this.subMenus[2].addMenuPointImage(1, function () { inGame.initMatchCounts(2); loadBattleMode(); });
    this.subMenus[2].addMenuPointImage(2, function () { inGame.initMatchCounts(3); loadBattleMode(); });
    this.subMenus[2].addMenuPointImage(3, function () { inGame.initMatchCounts(4); loadBattleMode(); });
    this.subMenus[2].addMenuPointImage(4, function () { inGame.initMatchCounts(5); loadBattleMode(); });

    this.subMenus[3].addMenuPointImage(0, function () { inGame.initPlayerCounts(1); inGame.newGame(); introScene.init(); });
    this.subMenus[3].addMenuPointImage(1, function () { inGame.initPlayerCounts(2); inGame.newGame(); introScene.init(); });
    this.subMenus[3].addMenuPointImage(2, function () { inGame.initPlayerCounts(3); inGame.newGame(); introScene.init(); });

    this.currentMenu = this.subMenus[0];

    this.handleEvents = function () {
        this.currentMenu.handleEvents();
    }

    this.rendering = function () {
        ctx.fillStyle = "#008000";
        ctx.fillRect(65, 0, canvas.width - 130, canvas.height);
        this.currentMenu.rendering();
    }

    this.switchMenu = function (x) {
        this.currentMenu = this.subMenus[x];
    }
}

function loadBattleMode() {
    inGame.newMultiplayerGame();
    mStartScene.switchToStart();
}