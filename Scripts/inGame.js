var STORY_MODE = 0;
var NORMAL_MODE = 1;
var SKULL_MODE = 2;

var offsetX;
var offsetY;

var dashboardLayouts = [
    { coord: { x: 64, y: 0 }, time: 212, scores: [36], lives: [306], hightScore: 356 },
    { coord: { x: 28, y: 0 }, time: 40, scores: [194, 430], lives: [134, 368], hightScore: null },
    { coord: { x: 0, y: 0 }, time: 40, scores: [194, 370, 546], lives: [134, 308, 484], hightScore: null },
]

function InGame() {
    this.endGameTimeout = new TimeoutEvent(60, function (obj) {
        if (obj.gameMode === STORY_MODE) {
            if (obj.players[obj.lastDeadPlayer].life <= 0) {
                creditScene.switch(obj.lastDeadPlayer);
            } else {
                obj.reset();
                mapMenu.switchToLevelTitle();
            }
        } else {
            if (obj.alivePlayers === 0) {
                drawScene.switchToDrawGame();
            } else {
                for (var i = 0; i < obj.players.length; i++) {
                    if (obj.players[i].state !== DEAD) {
                        resultsScene.switchToResults(i);
                        break;
                    }
                }
            }
        }
    }, this);

    this.dashBoards = [];
    this.currDashBoard = 0;
    this.currDashboardLayout = dashboardLayouts[0];

    for (var i = 0; i < 4; i++) {
        this.dashBoards[i] = new Image();
        this.dashBoards[i].src = "GFX/Board" + i.toString() + ".png";
    }

    this.players = [];

    this.gameMode = STORY_MODE;
    this.matchCounts = [];
    this.macthToWin = 0;
    this.alivePlayers = 0;
    this.lastDeadPlayer = -1;
    this.credits = 3;
    this.highScore = loadData("DynaBlasterHighScore") || 0;

    this.level = new Level();

    this.deadMusic = new Sound("Music/Dead.mp3");
    this.endLevelMusic = new Sound("Music/EndLevel.mp3");

    this.handleEvents = function () {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].handleEvents();
        }

        this.level.handleEvents();

        this.handleCamera();

        if ((this.alivePlayers === 1 && this.gameMode !== STORY_MODE || this.alivePlayers === 0) && !this.endGameTimeout.isLaunched()) {
            if (this.gameMode === STORY_MODE) {
                this.killInjuredPlayers();
                this.deadMusic.play();
            }
            this.music.stop();
            this.endGameTimeout.launch();
        }

        this.endGameTimeout.handleEvent();
    }

    this.rendering = function () {
        this.level.rendering();
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].rendering();
        }

        if (this.currDashBoard === 0) {
            ctx.drawImage(this.dashBoards[0], 64, 0);
            font.apply(this.level.time.m.toString(), 64 + 40, 18);
            font.apply(this.level.time.s.toString(), 64 + 70, 18);
            for (var i = 0; i < this.matchCounts.length; i++) {
                font.apply(this.matchCounts[i].toString(), 64 + 212 + i * 66, 18);
            }
        } else {
            ctx.drawImage(this.dashBoards[this.currDashBoard], this.currDashboardLayout.coord.x, this.currDashboardLayout.coord.y);
            font.apply(this.level.time.m.toString(), this.currDashboardLayout.coord.x + this.currDashboardLayout.time, this.currDashboardLayout.coord.y + 18);
            font.apply(this.level.time.s.toString(), this.currDashboardLayout.coord.x + this.currDashboardLayout.time + 30, this.currDashboardLayout.coord.y + 18);
            for (var i = 0; i < this.players.length; i++) {
                font.apply(this.players[i].life.toString(), this.currDashboardLayout.coord.x + this.currDashboardLayout.lives[i], this.currDashboardLayout.coord.y + 18);
                font.apply(this.players[i].score.toString(), this.currDashboardLayout.coord.x + this.currDashboardLayout.scores[i], this.currDashboardLayout.coord.y + 18);
            }

            if (this.currDashBoard.hightScore) {
                font.apply(this.highScore.toString(), this.currDashboardLayout.coord.x + this.currDashboardLayout.hightScore, this.currDashboardLayout.coord.y + 18);
            }
        }
    }

    this.initPlayerCounts = function (x) {
        this.players.length = x;
        for (var i = 0; i < x; i++) {
            this.players[i] = new Player(i);
        }

        this.reset();

        if (this.gameMode !== STORY_MODE) {
            this.currDashBoard = 0;
        } else {
            this.currDashBoard = x;
            this.credits = 3 + (x - 1) * 2;
        }

        this.currDashboardLayout = dashboardLayouts[x - 1];
    }

    this.setMode = function (x) {
        this.gameMode = x;
    }

    this.initMatchCounts = function (x) {
        this.macthToWin = x;
        this.matchCounts.length = this.players.length;

        for (var i = 0; i < this.matchCounts.length; i++) {
            this.matchCounts[i] = 0;
        }
    }

    this.reset = function () {
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].reset();
        }
        bombs = [];
        this.level.reset();
        this.alivePlayers = this.players.length;
    }

    this.resetMatchCounts = function () {
        for (var i = 0; i < this.matchCounts.length; i++) {
            this.matchCounts[i] = 0;
        }
    }

    this.handleCamera = function () {
        var avgPlayerX = 0;
        var avgPlayerY = 0;
        for (var i = 0; i < this.players.length; i++) {
            avgPlayerX += this.players[i].x;
            avgPlayerY += this.players[i].y;
        }
        avgPlayerX /= this.players.length;
        avgPlayerY /= this.players.length;

        if (this.level.ld.sizeX > 16) {
            if (avgPlayerX <= 8 * BLOCK_SIZE) {
                offsetX = BLOCK_SIZE;
            } else if (avgPlayerX > (this.level.ld.sizeX - 10) * BLOCK_SIZE) {
                offsetX = - (this.level.ld.sizeX - 19) * BLOCK_SIZE;
            } else {
                offsetX = - avgPlayerX + 9 * BLOCK_SIZE;
            }
        }

        if (this.level.ld.sizeY > 11) {
            if (avgPlayerY <= 5 * BLOCK_SIZE) {
                offsetY = 48 + BLOCK_SIZE;
            } else if (avgPlayerY > (this.level.ld.sizeY - 6) * BLOCK_SIZE) {
                offsetY = 48 - (this.level.ld.sizeY - 12) * BLOCK_SIZE;
            } else {
                offsetY = 48 - avgPlayerY + 6 * BLOCK_SIZE;
            }
        }
    }

    this.killInjuredPlayers = function () {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].isInjured()) {
                this.players[i].kill();
            }
        }
    }

    this.initMusic = function () {
        if (this.gameMode !== STORY_MODE) {
            this.music = new Sound("Music/InGameMultiplayer.mp3", true);
            this.music.play();
            return;
        }

        if (levelNum === 4) {
            if (missionNum === 8) {
                this.music = new Sound("Music/InGameBossFinal.mp3", true);
            } else {
                this.music = new Sound("Music/InGameBoss.mp3", true);
            }
        } else {
            this.music = new Sound("Music/InGame" + (levelNum + 1).toString() + ".mp3", true);
        }
        this.music.play();
    }

    this.switch = function () {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        scene = this;
        this.initMusic();
    }

    this.playEndLevelMusic = function () {
        this.music.stop();
        this.endLevelMusic.play();
    }

    this.setHighScore = function () {
        var totalScore = 0;
        for (var i = 0; i < this.players.length; i++) {
            totalScore += this.players[i].score;
        }

        if (totalScore > this.highScore) {
            this.highScore = totalScore;
            saveData("DynaBlasterHighScore", JSON.stringify(this.highScore));
        }
    }

    this.newGame = function () {
        this.setMode(STORY_MODE);
        this.level.loadLevel(1, 0);
        this.reset();
    }

    this.newMultiplayerGame = function () {
        this.level.loadLevel(0, this.gameMode == NORMAL_MODE ? 0 : 1);
    }

    this.saveGame = function () {
        var saveDat = {
            players: [],
            missionNum: missionNum,
            levelNum: levelNum,
            credits: this.credits
        }

        for (var i = 0; i < this.players.length; i++) {
            saveDat.players[i] = this.players[i].getSaveData();
        }

        saveData("DynaBlasterSave", JSON.stringify(saveDat));
    }

    this.loadGame = function () {
        var saveDat = loadData("DynaBlasterSave");
        if (saveDat) {
            saveDat = JSON.parse(saveDat);
            this.setMode(STORY_MODE);
            this.initPlayerCounts(saveDat.players.length);
            for (var i = 0; i < this.players.length; i++) {
                this.players[i].loadSaveData(saveDat.players[i]);
            }
            missionNum = saveDat.missionNum;
            levelNum = saveDat.levelNum;
            this.credits = saveDat.credits;
            this.level.loadLevel(missionNum, levelNum);
            this.reset();
            return true;
        }
        return false;
    }
}