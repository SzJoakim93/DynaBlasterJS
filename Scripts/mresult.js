function MResult() {
    this.cupImg = new Image();
    this.cupImg.src = "GFX/Cup.png";

    this.smokeUpperLeftAnim = new Animation("GFX/SmokeUpperLeft.png", 1, 5, 32, 32, 30, function (obj) {
        obj.smokeOffset = null;
        obj.endTimeout.launch();
    });

    this.smokeUpperRightAnim = new Animation("GFX/SmokeUpperRight.png", 1, 5, 32, 32, 30);
    this.smokeLowerLeftAnim = new Animation("GFX/SmokeLowerLeft.png", 1, 5, 32, 32, 30);
    this.smokeLowerRightAnim = new Animation("GFX/SmokeLowerRight.png", 1, 5, 32, 32, 30);

    this.smokeUpperLeftAnimator = new Animator(this.smokeUpperLeftAnim, this);
    this.smokeUpperRightAnimator = new Animator(this.smokeUpperRightAnim);
    this.smokeLowerLeftAnimator = new Animator(this.smokeLowerLeftAnim);
    this.smokeLowerRightAnimator = new Animator(this.smokeLowerRightAnim);

    this.bgMusic = new Sound("Music/MultiplayerResults.mp3");

    this.currentWinner = 0;
    this.smokeOffset = null;

    this.smokeTimeout = new TimeoutEvent(50, function (obj) {
        obj.smokeOffset = 10;
        inGame.matchCounts[obj.currentWinner]++;
    }, this);

    this.endTimeout = new TimeoutEvent(50, function (obj) {
        if (inGame.matchCounts[obj.currentWinner] >= inGame.macthToWin) {
            podiumScene.switchToPodium(obj.currentWinner);
        } else {
            mStartScene.switchToStart();
        }
    }, this);

    this.handleEvents = function () {
        if (this.smokeOffset != null) {
            this.smokeOffset += 2;
        }
        this.endTimeout.handleEvent();
        this.smokeTimeout.handleEvent();
    }

    this.rendering = function () {
        ctx.fillStyle = "#008000";
        ctx.fillRect(65, 0, canvas.width - 130, canvas.height);

        for (var i = 0; i < inGame.players.length; i++) {
            playerMarkImg.apply(80, 120 + i * 64, i);
            for (var j = 0; j < inGame.matchCounts[i]; j++) {
                ctx.drawImage(this.cupImg, 130 + j * 36, 120 + i * 64);
            }
        }

        var newCupCoords = [130 + (inGame.matchCounts[this.currentWinner] - 1) * 36, 120 + this.currentWinner * 64];
        if (this.smokeOffset != null) {
            this.smokeUpperLeftAnimator.applyAnim(newCupCoords[0] - this.smokeOffset, newCupCoords[1] - this.smokeOffset);
            this.smokeUpperRightAnimator.applyAnim(newCupCoords[0] + this.smokeOffset, newCupCoords[1] - this.smokeOffset);
            this.smokeLowerLeftAnimator.applyAnim(newCupCoords[0] - this.smokeOffset, newCupCoords[1] + this.smokeOffset);
            this.smokeLowerRightAnimator.applyAnim(newCupCoords[0] + this.smokeOffset, newCupCoords[1] + this.smokeOffset);
        }
    }

    this.switchToResults = function (currentWinner) {
        this.currentWinner = currentWinner;
        this.smokeTimeout.launch();
        this.bgMusic.play();
        scene = this;
    }
}