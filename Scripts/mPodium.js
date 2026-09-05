function MPodium() {
    this.handImg = new MultipleImage("GFX/Hand.png", 2, 1, 10, 14);
    this.bigCup = new Image();
    this.bigCup.src = "GFX/bigCup.png";

    this.loserAnim = new Animator(loserAnimation);
    this.mTitleWin = new Image();
    this.mTitleWin.src = "GFX/MTitleWin.png";
    this.handTimeout = new TimeoutEvent(7, function (obj) { obj.offset = obj.offset === 0 ? 8 : 0 }, this, true);
    this.offset = 0;
    this.currentWinner = 0;
    this.loserOffset = 0;

    this.bgMusic = new Sound("Music/MultiplayerPodium.mp3");

    this.handleEvents = function () {
        if (keystates[KEY_RETURN] || anyGamepadButtonPressed()) {
            this.bgMusic.stop();
            inGame.resetMatchCounts();
            mStartScene.switchToStart();
        }
        this.handTimeout.handleEvent();
    }

    this.rendering = function () {
        ctx.fillStyle = "#008000";
        ctx.fillRect(65, 0, canvas.width - 130, canvas.height);

        playerCeremony.apply(146, 330, this.currentWinner);
        this.handImg.apply(142, 360 + this.offset, this.offset === 0 ? 0 : 1)
        ctx.drawImage(this.bigCup, 110, 190 + this.offset);
        ctx.drawImage(this.mTitleWin, 110, 50);

        this.loserAnim.applyAnim(314, 226)
        for (var i = 0; i < inGame.players.length; i++) {
            if (i !== this.currentWinner) {
                playerCeremony.apply(380 + ((i < this.currentWinner ? i : i - 1) * 38) - this.loserOffset, 330, i + 6);
            }
        }
    }

    this.switchToPodium = function (currentWinner) {
        this.currentWinner = currentWinner;
        this.loserOffset = Math.floor(((inGame.players.length - 1) * 38) / 2);
        this.handTimeout.launch();
        this.bgMusic.play();
        scene = this;
    }
}