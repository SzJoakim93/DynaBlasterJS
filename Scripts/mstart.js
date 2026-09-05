function MStart() {
    this.mStartTitle = new Image();
    this.mStartTitle.src = "GFX/MStart.png"
    this.titleEffect = new MarkEffect(10);
    this.startTimeout = new TimeoutEvent(100, function () {
        inGame.reset();
        inGame.switch();
    });

    this.bgMusic = new Sound("Music/MultiplayerStart.mp3");


    this.markCoords = [
        { x: 198, y: 100 },
        { x: 398, y: 220 },
        { x: 398, y: 100 },
        { x: 198, y: 220 },
    ];

    this.handleEvents = function () {
        this.startTimeout.handleEvent();
    }

    this.rendering = function () {
        ctx.fillStyle = "#008000";
        ctx.fillRect(65, 0, canvas.width - 130, canvas.height);

        for (var i = 0; i < inGame.players.length; i++) {
            playerMarkImg.apply(this.markCoords[i].x, this.markCoords[i].y, i);
        }

        this.titleEffect.drawImage(this.mStartTitle, null, 197, 400);
    }

    this.switchToStart = function () {
        this.startTimeout.launch();
        this.bgMusic.play();
        scene = this;
    }
}