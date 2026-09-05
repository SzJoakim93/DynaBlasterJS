function MapMenu() {
    this.mapImg = new Image();
    this.mapImg.src = "GFX/Map.png";
    this.mapTitleAnim = new Animation("GFX/MapTitle.png", 1, 2, 98, 28, 40);
    this.mapPointerAnim = new Animation("GFX/MapPointer.png", 4, 1, 48, 46, 40);
    this.mapNumberAnim = new MultipleAnimation("GFX/MapNumbers.png", 2, 8, 24, 28, 40);
    this.mapNumberAnim.animations = []
    for (var i = 0; i < 16; i += 2) {
        this.mapNumberAnim.animations.push({ from: i, to: i + 1, nextAnim: null, direction: 1, delay: 0 });
    }

    this.mapPointer = new Animator(this.mapPointerAnim);
    this.mapTitle = new Animator(this.mapTitleAnim);
    this.mapNumber = new MultipleAnimator(this.mapNumberAnim);
    this.titleOffset = -32;

    this.stageTitle = new Image();
    this.stageTitle.src = "GFX/Stage.png";
    this.stageNumber = new MultipleImage("GFX/StageNumbers.png", 8, 1, 24, 28);

    this.isMapShown = true;

    this.switchFromMapTimeout = new TimeoutEvent(100, function (obj) { obj.switchToLevelTitle(); }, this);
    this.switchFromMLevelTitleTimeout = new TimeoutEvent(60, function (obj) { inGame.switch(); obj.stageMusic.stop(); }, this);

    this.roundMusic = new Sound("Music/Round.mp3");
    this.stageMusic = new Sound("Music/Stage.mp3");

    this.handleEvents = function () {
        if (this.isMapShown && this.titleOffset < 240) {
            this.titleOffset += 12;
        }

        this.switchFromMapTimeout.handleEvent();
        this.switchFromMLevelTitleTimeout.handleEvent();
    }

    this.rendering = function () {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (this.isMapShown) {
            ctx.drawImage(this.mapImg, 70, 60);
            this.mapTitle.applyAnim(this.titleOffset, 420);
            this.mapNumber.applyAnim(this.titleOffset + 118, 420);
            this.mapPointer.applyAnim(missions[missionNum].mapCoords.x + 70, missions[missionNum].mapCoords.y + 60);
        } else {
            ctx.drawImage(this.stageTitle, 208, 210);
            this.stageNumber.apply(208 + 142, 210, missionNum - 1);
            this.stageNumber.apply(208 + 192, 210, levelNum);
        }
    }

    this.switch = function () {
        if (levelNum % 5 === 0) {
            this.switchToMap();
        } else {
            this.switchToLevelTitle();
        }
    }

    this.switchToMap = function () {
        scene = mapMenu;
        this.mapNumber.switchAnim(missionNum - 1);
        this.isMapShown = true;
        this.titleOffset = -32;
        this.switchFromMapTimeout.launch();
        this.roundMusic.play();
    }

    this.switchToLevelTitle = function () {
        scene = mapMenu;
        this.isMapShown = false;
        this.switchFromMLevelTitleTimeout.launch();
        this.roundMusic.stop();
        this.stageMusic.play();
    }
}
