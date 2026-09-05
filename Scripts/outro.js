function Outro() {
    this.background = new Image();
    this.background.src = "GFX/Outro.png";

    this.outroAnim = new MultipleAnimation("GFX/OutroAnim.png", 7, 1, 76, 99, 30);
    this.outroAnim.animations = [
        { from: 1, to: 1, nextAnim: null, direction: 1, delay: 0 }, //girl standing
        { from: 0, to: 1, nextAnim: null, direction: 1, delay: 0 }, //girl running
        { from: 2, to: 4, nextAnim: 3, direction: 1, delay: 0 }, //crouching
        { from: 5, to: 6, nextAnim: null, direction: 1, delay: 0 }, //crying
    ];

    this.girlAnimator = new MultipleAnimator(this.outroAnim);
    this.enemyAnimator = new MultipleAnimator(this.outroAnim);

    this.playerAnimations = [];
    this.playerAnimators = [];

    this.bgMusic = new Sound("Music/Outro.mp3");

    for (var i = 0; i < 2; i++) {
        this.playerAnimations.push(new MultipleAnimation("GFX/Player" + (i + 1).toString() + ".png", 12, 1, 36, 44, 40));
        this.playerAnimations[i].animations = [
            { from: 0, to: 2, nextAnim: null, direction: 1, delay: 0 }, //down
            { from: 3, to: 5, nextAnim: null, direction: 1, delay: 0 }, //right
            { from: 6, to: 8, nextAnim: null, direction: 1, delay: 0 }, //left
            { from: 9, to: 11, nextAnim: null, direction: 1, delay: 0 }, //up iddle
            { from: 0, to: 0, nextAnim: null, direction: 1, delay: 0 }, //down iddle
            { from: 3, to: 3, nextAnim: null, direction: 1, delay: 0 }, //right iddle
            { from: 6, to: 6, nextAnim: null, direction: 1, delay: 0 }, //left iddle
            { from: 9, to: 9, nextAnim: null, direction: 1, delay: 0 }, //up iddle
        ];
        this.playerAnimators.push(new MultipleAnimator(this.playerAnimations[i]));
    }

    this.handleEvents = function () {
        this.scriptScene.handleEvents();
    }

    this.rendering = function () {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(this.background, 70, 72);
        if (this.playerCoord.x > 70 && this.playerCoord.x < 572) {
            this.playerAnimators[0].applyAnim(this.playerCoord.x, this.playerCoord.y);
        }

        if (this.enemyCoord.x > 70 && this.enemyCoord.x < 572) {
            if (this.scriptScene.time < 350) {
                this.playerAnimators[1].applyAnim(this.enemyCoord.x, this.enemyCoord.y);
            } else {
                this.enemyAnimator.applyAnim(this.enemyCoord.x - 22, this.enemyCoord.y - 30);
            }
        }

        if (this.girlCoord.x > 70 && this.girlCoord.x < 572) {
            this.girlAnimator.applyAnim(this.girlCoord.x, this.girlCoord.y);
        }
    }

    this.init = function () {
        this.playerCoord = { x: 0, y: 280, anim: this.playerAnimators[0] };
        this.enemyCoord = { x: 50, y: 280, anim: this.playerAnimators[1] };
        this.girlCoord = { x: 660, y: 240, anim: this.girlAnimator };
        this.switchPoints = [
            { target: 0, timeStamp: 0, x: 280, y: this.playerCoord.y, speed: 4, anim: 5, sp: [] },
            { target: 1, timeStamp: 0, x: 720, y: this.enemyCoord.y, speed: 4, anim: 2, sp: [3, 2] },
            { target: 1, x: 400, y: this.enemyCoord.y, speed: 4, anim: 6, sp: [] },
            { target: 2, x: 320, y: this.girlCoord.y, speed: 4, anim: 0, sp: [] },
            { target: 2, timeStamp: 299, x: 320, y: this.girlCoord.y, speed: 4, anim: 1, sp: [] },
            { target: 0, timeStamp: 299, x: 280, y: this.playerCoord.y, speed: 4, anim: 2, sp: [] },
            { target: 0, timeStamp: 300, x: 0, y: this.playerCoord.y, speed: 4, sp: [] },
            { target: 2, timeStamp: 300, x: 0, y: this.girlCoord.y, speed: 4, sp: [] }
        ];
        this.scriptScene = new ScriptScene([this.playerCoord, this.enemyCoord, this.girlCoord], this.switchPoints, 500, function () {
            scene = mainMenu;
        });

        this.bgMusic.play();
        this.reset();
        scene = this;
    }

    this.reset = function () {
        this.playerAnimators[0].switchAnim(1);
        this.playerAnimators[1].switchAnim(1);
        this.girlAnimator.switchAnim(1);
        this.enemyAnimator.switchAnim(2);
        this.playerCoord.x = 0;
        this.enemyCoord.x = 50;
        this.girlCoord.x = 660;
        this.scriptScene.launch();
    }
}
