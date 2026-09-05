function Intro() {
    this.base = new Image();
    this.base.src = "GFX/Base.png";
    this.baseTop = new Image();
    this.baseTop.src = "GFX/BaseTop.png";
    this.castle = new Image();
    this.castle.src = "GFX/Castle.png";
    this.glassBreak = new Image();
    this.glassBreak.src = "GFX/GlassBreak.png";

    this.introAnim = new MultipleAnimation("GFX/IntroAnim.png", 5, 5, 76, 99, 40);
    this.introAnim.animations = [
        { from: 0, to: 2, direction: 1, nextAnim: null, delay: 0 }, //enemy on dragon
        { from: 5, to: 5, direction: 1, nextAnim: null, delay: 0 }, // player standing
        { from: 3, to: 4, direction: 1, nextAnim: null, delay: 0 }, // player up
        { from: 6, to: 8, direction: 1, nextAnim: null, delay: 0 }, // grandFather left
        { from: 9, to: 11, direction: 1, nextAnim: null, delay: 0 }, // grandFather right
        { from: 14, to: 14, direction: 1, nextAnim: null, delay: 0 }, // grandFather standing
        { from: 12, to: 13, direction: 1, nextAnim: null, delay: 0 }, // grandFather up
        { from: 15, to: 16, direction: 1, nextAnim: null, delay: 0 }, // enemy middle
        { from: 17, to: 18, direction: 1, nextAnim: null, delay: 0 }, // enemy far
        { from: 19, to: 21, direction: 1, nextAnim: null, delay: 0 }, // player right
        { from: 22, to: 24, direction: 1, nextAnim: null, delay: 0 }, // player left
    ];

    this.bgMusic = new Sound("Music/Intro.mp3");
    this.glassBreakSound = new Sound("SFX/GlassBreak.mp3");

    this.baseX = 64;
    this.baseY = 302;

    this.breakOutTime = 40;
    this.gotoCastleTime = 260;
    this.endSceneTime = 400;

    this.playerAnimator = new MultipleAnimator(this.introAnim);
    this.grandFatherAnimator = new MultipleAnimator(this.introAnim);
    this.enemyAnimator = new MultipleAnimator(this.introAnim);
    this.playerAnimator.switchAnim(10);
    this.grandFatherAnimator.switchAnim(4);
    this.enemyAnimator.switchAnim(0);

    this.player = { x: this.baseX + 108, y: this.baseY + 45, anim: this.playerAnimator };
    this.grandFather = { x: this.baseX + 320, y: this.baseY + 45, anim: this.grandFatherAnimator };
    this.enemy = { x: this.baseX + 220, y: this.baseY + 20, anim: this.enemyAnimator };

    this.handleEvents = function () {
        this.introScene.handleEvents();

        if (keystates[KEY_RETURN] || anyGamepadButtonPressed()) {
            this.endScene();
        }
    }

    this.rendering = function () {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(this.base, this.baseX, this.baseY);

        //The castle animations
        if (this.introScene.time >= this.gotoCastleTime) {
            ctx.drawImage(this.castle, this.baseX, this.baseY - 256);
        }

        //before breaking out
        if (this.introScene.time < this.breakOutTime) {
            ctx.drawImage(this.baseTop, this.baseX + 215, this.baseY + 20);
        } else { //after breaking out
            this.player.anim.applyAnim(this.player.x, this.player.y);

            if (this.introScene.time < this.gotoCastleTime + 80) {
                this.enemy.anim.applyAnim(this.enemy.x, this.enemy.y);
            }

            if (this.introScene.time < this.breakOutTime + 5) {
                ctx.drawImage(this.glassBreak, this.baseX + 200, this.baseY - 120);
            }

            if (this.introScene.time >= this.breakOutTime + 5) {
                this.grandFather.anim.applyAnim(this.grandFather.x, this.grandFather.y);
            }
        }
    }

    this.init = function () {

        this.switchPoints = [
            { target: 0, timeStamp: this.breakOutTime, x: this.baseX + 80, y: this.baseY + 70, anim: 9, speed: 2, sp: [1] },
            { target: 0, timeStamp: null, x: this.baseX + 165, y: this.baseY + 90, anim: 2, speed: 2, sp: [] },
            { target: 0, timeStamp: this.breakOutTime + 200, x: this.baseX + 165, y: this.baseY + 90, anim: 1, speed: 2, sp: [] },

            { target: 1, timeStamp: this.breakOutTime + 5, x: this.baseX + 350, y: this.baseY + 70, anim: 3, speed: 2, sound: null, sp: [4] },
            { target: 1, timeStamp: null, x: this.baseX + 270, y: this.baseY + 90, speed: 2, anim: 6, sound: null, sp: [] },
            { target: 1, timeStamp: this.breakOutTime + 200, x: this.baseX + 270, y: this.baseY + 90, anim: 5, speed: 2, sound: null, sp: [] },

            { target: 2, timeStamp: this.breakOutTime, x: this.enemy.x, y: this.enemy.y - 150, speed: 2, sound: this.glassBreakSound, sp: [] },
            { target: 2, timeStamp: this.breakOutTime + 150, x: this.enemy.x, y: this.enemy.y - 450, anim: 7, speed: 5, sp: [] },
            { target: 2, timeStamp: this.gotoCastleTime + 15, x: this.enemy.x, y: this.enemy.y - 300, anim: 8, speed: 3, sp: [9] },
            { target: 2, timeStamp: null, x: this.enemy.x, y: this.enemy.y - 250, speed: 3, sp: [] },
        ];
        this.introScene = new ScriptScene([this.player, this.grandFather, this.enemy], this.switchPoints, this.endSceneTime, function (obj) { obj.endScene(); }, this);
        this.introScene.launch();
        this.bgMusic.play();
        scene = this;
    }

    this.endScene = function () {
        mapMenu.switch();
        this.bgMusic.stop();
    }
}