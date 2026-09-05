var controlSets = [
    {
        up: KEY_UP,
        down: KEY_DOWN,
        left: KEY_LEFT,
        right: KEY_RIGHT,
        bomb: KEY_RETURN,
        explode: KEY_RCTRL
    },
    {
        up: KEY_W,
        down: KEY_S,
        left: KEY_A,
        right: KEY_D,
        bomb: KEY_SPACE,
        explode: KEY_RCTRL
    },
    {
        up: KEY_KP_8,
        down: KEY_KP_5,
        left: KEY_KP_4,
        right: KEY_KP_6,
        bomb: KEY_KP_0,
        explode: KEY_KP_PLUS
    },
    {
        up: KEY_T,
        down: KEY_G,
        left: KEY_F,
        right: KEY_H,
        bomb: KEY_J,
        explode: KEY_K

    }
];

var initCoordinates = [
    { x: 0, y: 0 },
    { x: 12, y: 10 },
    { x: 12, y: 0 },
    { x: 0, y: 10 }
];

var ALIVE = 1;
var DEADING = 2;
var DEAD = 3;
var INJURED = 4;
var PENDING_FOR_CREDITS = 5;

var SKULL_NONE = 0;
var SKULL_SLOW = 1;
var SKULL_FAST = 2;
var SKULL_ALWAYS_PLACE_BOMB = 3;
var SKULL_NO_BOMBS = 4;

var creditPanel = new Image();
creditPanel.src = "GFX/CreditPanel.png";

var bonusSound = new Sound("SFX/Bonus.mp3");
var deadSound = new Sound("SFX/Dead.mp3");

function Player(index) {
    var animIndex = index < 1 || this.gameMode !== STORY_MODE ? index : index + 1;
    this.animator = new MultipleAnimator(playerAnimations[animIndex]);
    this.deadAnimator = new MultipleAnimator(deadAnimations[animIndex], this);
    this.waterAnimator = new Animator(waterAnimation);

    this.index = index;
    this.excludeBomb = null;
    this.life = 3;
    this.score = 0;
    this.maxBlast = inGame.gameMode === STORY_MODE && index !== 1 ? 2 : 3; //story mode: player 2 has 2 blast, everyone else has 1 blast, multi player: both have 2 blasts
    this.maxBombs = inGame.gameMode === STORY_MODE && index === 2 ? 2 : 1; //story mode: player 3 has 2 bombs, everyone else has 1 bomb, multi player: both have 1 bomb
    this.speed = 4;
    this.state = ALIVE;

    this.isGoodMode = false;
    this.isGoThroughtBlocks = false;
    this.isGoThroughtBombs = false;
    this.isControlBomb = false;
    this.skullMode = SKULL_NONE;
    this.skullTimer = 0;
    this.bombCount = 0;

    this.controlSet = controlSets[index];
    this.baseState = {
        maxBlast: this.maxBlast,
        maxBombs: this.maxBombs,
        speed: this.speed
    }

    this.currentMenu = new Menu(font, arrowImg, FONT_BASED, 6 + 16 + index * 210, 418 + 4, 20, 20);
    this.currentMenu.addMenuPointText("Continue", function () {
        if (inGame.credits > 0) {
            inGame.credits--;
            this.life = 3;
            this.reset();
            inGame.alivePlayers++;
        } else {
            scene = mainMenu;
        }

        creditScene.bgMusic.stop();
    }, this);
    this.currentMenu.addMenuPointText("Leave game", function () {
        this.state = DEAD;
    }, this);

    this.reset = function () {
        this.x = initCoordinates[index].x * BLOCK_SIZE;
        this.y = initCoordinates[index].y * BLOCK_SIZE;
        this.tileX = initCoordinates[index].x;
        this.tileY = initCoordinates[index].y;
        this.bombPlaceX = initCoordinates[index].x * BLOCK_SIZE;
        this.bombPlaceY = initCoordinates[index].y * BLOCK_SIZE;
        this.fixedMoveTargetX = initCoordinates[index].x * BLOCK_SIZE;
        this.fixedMoveTargetY = initCoordinates[index].y * BLOCK_SIZE;
        this.state = this.life > 0 ? ALIVE : DEAD;
        this.isGoodMode = false;
        this.isGoThroughtBlocks = false;
        this.skullMode = SKULL_NONE;
        this.skullTimer = 0;
        this.bombCount = 0;
        this.restoreBaseState();
    }

    this.handleEvents = function () {
        var numPlayers = inGame.players.length;

        if (this.state === PENDING_FOR_CREDITS) {
            this.currentMenu.handleEvents();
            if (isActionPressed(this.index, numPlayers, "up", this.controlSet, true) ||
                isActionPressed(this.index, numPlayers, "left", this.controlSet, true)) {
                this.currentMenu.selectPrev();
            } else if (isActionPressed(this.index, numPlayers, "down", this.controlSet, true) ||
                isActionPressed(this.index, numPlayers, "right", this.controlSet, true)) {
                this.currentMenu.selectNext();
            } else if (isActionPressed(this.index, numPlayers, "bomb", this.controlSet, true)) {
                this.currentMenu.select();
            }
            return;
        }

        if (this.state !== ALIVE) {
            return;
        }

        if (inGame.level.isEndLevel()) {
            return;
        }

        if (isActionPressed(this.index, numPlayers, "up", this.controlSet, false)) {
            if (this.y > 0 && this.tileX % 2 === 0) {
                this.moveUp();
            }
            this.fixedMoveX();
            this.animator.switchAnim(2);
        } else if (isActionPressed(this.index, numPlayers, "down", this.controlSet, false)) {
            if (this.y < inGame.level.levelHeight && this.tileX % 2 === 0) {
                this.moveDown();
            }
            this.fixedMoveX();
            this.animator.switchAnim(3);
        } else if (isActionPressed(this.index, numPlayers, "left", this.controlSet, false)) {
            if (this.x > 0 && this.tileY % 2 === 0) {
                this.moveLeft();
            }
            this.fixedMoveY();
            this.animator.switchAnim(0);
        } else if (isActionPressed(this.index, numPlayers, "right", this.controlSet, false)) {
            if (this.x < inGame.level.levelWidth && this.tileY % 2 === 0) {
                this.moveRight();
            }
            this.fixedMoveY();
            this.animator.switchAnim(1);
        } else if (this.animator.currAnim < 4) {
            this.animator.switchAnim(this.animator.currAnim + 4);
        }

        if ((isActionPressed(this.index, numPlayers, "bomb", this.controlSet, false) || this.skullMode === SKULL_ALWAYS_PLACE_BOMB) && this.skullMode !== SKULL_NO_BOMBS && !this.excludeBomb && this.bombCount < this.maxBombs) {
            this.excludeBomb = new Bomb(this.bombPlaceX, this.bombPlaceY, this.maxBlast, this.index, this.isControlBomb);
            bombs.push(this.excludeBomb);
        }
        if (isActionPressed(this.index, numPlayers, "explode", this.controlSet, false)) {
            this.explosion();
        }

        if (this.excludeBomb !== null && !isCollided(this.excludeBomb, this.x, this.y, 0, 0)) {
            this.excludeBomb = null;
        }

        if (this.skullTimer > 0) {
            this.skullTimer--;
            if (this.skullTimer === 0) {
                this.skullMode = SKULL_NONE;
            }
        }
    }

    this.rendering = function () {
        if (inGame.level.isEndLevel()) {
            return;
        }

        if (this.state === PENDING_FOR_CREDITS) {
            ctx.drawImage(creditPanel, 6 + index * 210, 418);
            this.currentMenu.rendering();
            return;
        }

        if (this.state === DEADING || this.state === INJURED) {
            this.deadAnimator.applyAnim(this.x + offsetX - 14, this.y - 10 + offsetY);
        } else if (this.state === ALIVE) {
            this.animator.applyAnim(this.x + offsetX, this.y - 10 + offsetY);
            if (missionNum === 3) {
                this.waterAnimator.applyAnim(this.x + offsetX + 2, this.y + offsetY + 16);
            }
        }
    }

    this.moveUp = function () {
        this.y -= this.speed;
        if (inGame.level.isCollidedWithBlockOrBomb(this.x, this.y, this.excludeBomb, this.isGoThroughtBombs, this.isGoThroughtBlocks)) {
            this.y += this.speed;
        }
        if (this.y < this.bombPlaceY - BLOCK_SIZE_HALF) {
            this.bombPlaceY -= BLOCK_SIZE;
            this.tileY--;
        }
        if (this.y < this.fixedMoveTargetY - BLOCK_SIZE) {
            this.fixedMoveTargetY -= BLOCK_SIZE_DOUBLE;
        }
    }

    this.moveDown = function () {
        this.y += this.speed;
        if (inGame.level.isCollidedWithBlockOrBomb(this.x, this.y, this.excludeBomb, this.isGoThroughtBombs, this.isGoThroughtBlocks)) {
            this.y -= this.speed;
        }
        if (this.y > this.bombPlaceY + BLOCK_SIZE_HALF) {
            this.bombPlaceY += BLOCK_SIZE;
            this.tileY++;
        }
        if (this.y > this.fixedMoveTargetY + BLOCK_SIZE) {
            this.fixedMoveTargetY += BLOCK_SIZE_DOUBLE;
        }
    }

    this.moveLeft = function () {
        this.x -= this.speed;
        if (inGame.level.isCollidedWithBlockOrBomb(this.x, this.y, this.excludeBomb, this.isGoThroughtBombs, this.isGoThroughtBlocks)) {
            this.x += this.speed;
        }
        if (this.x < this.bombPlaceX - BLOCK_SIZE_HALF) {
            this.bombPlaceX -= BLOCK_SIZE;
            this.tileX--;
        }
        if (this.x < this.fixedMoveTargetX - BLOCK_SIZE) {
            this.fixedMoveTargetX -= BLOCK_SIZE_DOUBLE;
        }
    }

    this.moveRight = function () {
        this.x += this.speed;
        if (inGame.level.isCollidedWithBlockOrBomb(this.x, this.y, this.excludeBomb, this.isGoThroughtBombs, this.isGoThroughtBlocks)) {
            this.x -= this.speed;
        }
        if (this.x > this.bombPlaceX + BLOCK_SIZE_HALF) {
            this.bombPlaceX += BLOCK_SIZE;
            this.tileX++;
        }
        if (this.x > this.fixedMoveTargetX + BLOCK_SIZE) {
            this.fixedMoveTargetX += BLOCK_SIZE_DOUBLE;
        }
    }

    this.fixedMoveX = function () {
        if (this.x < this.fixedMoveTargetX - this.speed) {
            this.moveRight();
        } else if (this.x > this.fixedMoveTargetX + this.speed) {
            this.moveLeft();
        } else {
            this.x = this.fixedMoveTargetX;
        }
    }

    this.fixedMoveY = function () {
        if (this.y < this.fixedMoveTargetY - this.speed) {
            this.moveDown();
        } else if (this.y > this.fixedMoveTargetY + this.speed) {
            this.moveUp();
        } else {
            this.y = this.fixedMoveTargetY;
        }
    }

    this.pickupBonus = function (type) {
        switch (type) {
            case 0:
                this.maxBlast++;
                break;
            case 1:
                this.maxBombs++;
                break;
            case 2:
                this.isControlBomb = true;
                break;
            case 3:
                this.speed++;
                break;
            case 4:
                this.isGoThroughtBombs = true;
                break;
            case 5:
                this.isGoThroughtBlocks = true;
                break;
            case 6:
                this.isGoodMode = true;
                break;
            case 7:
                this.life++;
                break;
            case 8:
                this.skullMode = Math.floor(Math.random() * 4 + 1);
                this.skullTimer = 100;
                if (this.skullMode === SKULL_SLOW) {
                    this.speed = 2;
                } else if (this.skullMode === SKULL_FAST) {
                    this.speed = 10;
                }
                break;
            default:
                break;
        }
        bonusSound.play();
    }

    this.hit = function () {
        if (this.state !== ALIVE) {
            return;
        }

        deadSound.play();
        inGame.alivePlayers--;
        this.life--;
        this.isGoThroughtBombs = false;
        this.isControlBomb = false;

        if (inGame.alivePlayers > 0 && this.life > 0 && inGame.gameMode === STORY_MODE) {
            this.state = INJURED;
            this.deadAnimator.switchAnim(INJURED_ANIM);
        } else {
            this.state = DEADING;
            this.deadAnimator.switchAnim(DEAD_ANIM);
            inGame.lastDeadPlayer = this.index;
        }
    }

    this.kill = function () {
        this.state = DEADING;
        this.deadAnimator.switchAnim(DEAD_ANIM);
    }

    this.onDead = function () {
        if (this.life <= 0 && inGame.credits > 0 && inGame.gameMode === STORY_MODE) {
            this.state = PENDING_FOR_CREDITS;
        } else {
            this.state = DEAD;
        }
    }

    this.heal = function () {
        if (this.state === INJURED) {
            this.state = ALIVE;
            inGame.alivePlayers++;
            this.animator.switchAnim(0);
        }
    }

    this.addScore = function (x) {
        this.score += x;
    }

    this.explosion = function () {
        for (var i = 0; i < bombs.length; i++) {
            if (bombs[i].isControlBomb && bombs[i].fromPlayer === this.index) {
                bombs[i].explosion();
                break;
            }
        }
    }

    this.isInjured = function () {
        return this.state === INJURED;
    }

    this.saveBaseState = function () {
        this.baseState.maxBlast = this.maxBlast;
        this.baseState.maxBombs = this.maxBombs;
        this.baseState.speed = this.speed;
    }

    this.restoreBaseState = function () {
        this.maxBlast = this.baseState.maxBlast;
        this.maxBombs = this.baseState.maxBombs;
        this.speed = this.baseState.speed;
    }

    this.getSaveData = function () {
        return {
            score: this.score,
            life: this.life,
            maxBlast: this.maxBlast,
            maxBombs: this.maxBombs,
            speed: this.speed,
            isControlBomb: this.isControlBomb,
            isGoThroughtBombs: this.isGoThroughtBombs
        };
    }

    this.loadSaveData = function (saveData) {
        this.score = saveData.score;
        this.life = saveData.life;
        this.maxBlast = saveData.maxBlast;
        this.maxBombs = saveData.maxBombs;
        this.speed = saveData.speed;
        this.isControlBomb = saveData.isControlBomb;
        this.isGoThroughtBombs = saveData.isGoThroughtBombs;
        this.saveBaseState();
    }
}