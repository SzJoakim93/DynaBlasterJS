function MDrawGame() {
    this.mDrawTitle = new Image();
    this.mDrawTitle.src = "GFX/MDraw.png"
    this.loserAnim = new Animator(loserAnimation);

    this.startTimeout = new TimeoutEvent(100, function () {
        inGame.reset();
        inGame.switch();
    });

    this.handleEvents = function () {
        this.startTimeout.handleEvent();
    }

    this.rendering = function () {
        ctx.fillStyle = "#008000";
        ctx.fillRect(65, 0, canvas.width - 130, canvas.height);

        ctx.drawImage(this.mDrawTitle, 210, 20);
        this.loserAnim.applyAnim(256, 226);
        for (var i = 0; i < inGame.players.length; i++) {
            playerCeremony.apply(320 + (i * 38) - this.loserOffset, 330, i + 12);
        }
    }

    this.switchToDrawGame = function () {
        this.startTimeout.launch();
        this.loserOffset = Math.floor((inGame.players.length * 38) / 2);
        scene = drawScene;
    }
}