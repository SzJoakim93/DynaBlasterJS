var BombAnim = new Animation("GFX/Bomb.png", 3, 1, 32, 32, 50);
var ExplosionLeftAnim = new Animation("GFX/ExplosionLeft.png", 4, 1, 32, 32, 50);
var ExplosionRightAnim = new Animation("GFX/ExplosionRight.png", 4, 1, 32, 32, 50);
var ExplosionUpAnim = new Animation("GFX/ExplosionUp.png", 4, 1, 32, 32, 50);
var ExplosionDownAnim = new Animation("GFX/ExplosionDown.png", 4, 1, 32, 32, 50);
var ExplosionHorizontalAnim = new Animation("GFX/ExplosionMiddleHorizontal.png", 4, 1, 32, 32, 50);
var ExplosionVerticalAnim = new Animation("GFX/ExplosionMiddleVertical.png", 4, 1, 32, 32, 50);
var ExplosionCenterAnim = new Animation("GFX/ExplosionCenter.png", 5, 1, 32, 32, 55);

var bombSound = new Sound("SFX/Bomb.mp3");

var bombs = [];

function Bomb(x, y, range, fromPlayer, isControlBomb) {
    this.x = x;
    this.y = y;
    this.fromPlayer = fromPlayer;
    this.isControlBomb = isControlBomb;
    this.rangeU = (x % BLOCK_SIZE_DOUBLE === 0) ? (this.maxRangeU = y - range * BLOCK_SIZE) : y;
    this.rangeD = (x % BLOCK_SIZE_DOUBLE === 0) ? (this.maxRangeD = y + range * BLOCK_SIZE) : y;
    this.rangeL = (y % BLOCK_SIZE_DOUBLE === 0) ? (this.maxRangeL = x - range * BLOCK_SIZE) : x;
    this.rangeR = (y % BLOCK_SIZE_DOUBLE === 0) ? (this.maxRangeR = x + range * BLOCK_SIZE) : x;
    this.animator = new Animator(BombAnim);
    this.explAnimL = new Animator(ExplosionLeftAnim);
    this.explAnimR = new Animator(ExplosionRightAnim);
    this.explAnimU = new Animator(ExplosionUpAnim);
    this.explAnimD = new Animator(ExplosionDownAnim);
    this.explAnimC = new Animator(ExplosionCenterAnim);
    this.explAnimH = [];
    this.explAnimV = [];
    this.hitEnemies = [];
    inGame.players[fromPlayer].bombCount++;

    for (var i = 0; i < range * 2; i++) {
        this.explAnimH[i] = new Animator(ExplosionHorizontalAnim);
        this.explAnimV[i] = new Animator(ExplosionVerticalAnim);
    }

    this.explosionTimeOut = 50;

    this.handleEvents = function () {
        if (this.explosionTimeOut > 0) {
            if (!this.isControlBomb || this.explosionTimeOut < 11) {
                this.explosionTimeOut--;
                if (this.explosionTimeOut === 10) {
                    this.explosion();
                }
            }

            var hitBlocks = [];
            for (var i = 0; i < inGame.level.blocks.length; i++) {
                if (this.isCollided(inGame.level.blocks[i], 1)) {
                    hitBlocks.push(inGame.level.blocks[i]);
                }
            }

            for (var i = 0; i < hitBlocks.length; i++) {
                var b = hitBlocks[i];
                var isOut = false;
                if (b.x === this.x) {
                    if (b.y > this.y && b.y > this.rangeD) isOut = true;
                    if (b.y < this.y && b.y < this.rangeU) isOut = true;
                } else if (b.y === this.y) {
                    if (b.x > this.x && b.x > this.rangeR) isOut = true;
                    if (b.x < this.x && b.x < this.rangeL) isOut = true;
                }

                if (!isOut) {
                    var index = inGame.level.blocks.indexOf(b);
                    if (index !== -1) {
                        inGame.level.activateNextStoneRuin(b.x, b.y);
                        inGame.level.destroyBlock(index);
                    }
                }
            }
            for (var i = 0; i < inGame.level.enemies.length; i++) {
                if (!this.hitEnemies.includes(i) && !inGame.level.enemies[i].isDead && !inGame.level.enemies[i].shieldEnabled) {
                    if (this.isCollided(inGame.level.enemies[i], 0)) {
                        inGame.level.enemies[i].hit();
                        if (inGame.level.enemies[i].isDead) {
                            inGame.players[this.fromPlayer].addScore(inGame.level.enemies[i].getScore());
                        }
                        this.hitEnemies.push(i);
                    }

                    for (var j = 0; j < inGame.level.enemies[i].tails.length; j++) {
                        if (this.isCollided(inGame.level.enemies[i].tails[j], 0)) {
                            inGame.level.enemies[i].hitTail(j);
                            if (inGame.level.enemies[i].isDead) {
                                inGame.players[this.fromPlayer].addScore(inGame.level.enemies[i].getScore());
                            }
                            this.hitEnemies.push(i);
                        }
                    }
                }
            }
            for (var i = 0; i < inGame.level.enemies.length; i++) {
                if (!inGame.level.enemies[i].isDead) {
                    for (var j = 0; j < inGame.players.length; j++) {
                        if (!inGame.players[j].isGoodMode && this.isCollided(inGame.players[j], 0)) {
                            inGame.players[j].hit();
                        }
                    }
                }
            }

            for (var i = 0; i < bombs.length; i++) {
                if (bombs[i] !== this && bombs[i].explosionTimeOut > 8 && this.isCollided(bombs[i], 0)) {
                    bombs[i].explosion();
                }
            }

            for (var i = 0; i < inGame.level.bonuses.length; i++) {
                if (this.isCollided(inGame.level.bonuses[i], 0)) {
                    activateNextBonusTerminate(inGame.level.bonuses[i].x - 18, inGame.level.bonuses[i].y - 26);
                    inGame.level.bonuses.splice(i, 1);
                    i--;
                }
            }

            if (inGame.level.gate && this.isCollided(inGame.level.gate, 1)) {
                inGame.level.hitGate();
            }
        } else {
            inGame.players[this.fromPlayer].bombCount--;
            bombs.splice(bombs.indexOf(this), 1);
        }
    }

    this.rendering = function () {
        if (this.explosionTimeOut > 8) {
            this.animator.applyAnim(this.x + offsetX, this.y + offsetY);
        } else if (this.explosionTimeOut > 0) {
            this.explAnimC.applyAnim(this.x + offsetX, this.y + offsetY);

            for (var i = this.y + BLOCK_SIZE, j = 0; i < this.rangeD && i < this.maxRangeD - BLOCK_SIZE; i += BLOCK_SIZE, j++) {
                this.explAnimV[j].applyAnim(this.x + offsetX, i + offsetY);
            }
            if (this.rangeD === this.maxRangeD) {
                this.explAnimD.applyAnim(this.x + offsetX, this.maxRangeD - BLOCK_SIZE + offsetY);
            }

            for (var i = this.y - BLOCK_SIZE, j = range; i > this.rangeU && i > this.maxRangeU + BLOCK_SIZE; i -= BLOCK_SIZE, j++) {
                this.explAnimV[j].applyAnim(this.x + offsetX, i + offsetY);
            }
            if (this.rangeU === this.maxRangeU) {
                this.explAnimU.applyAnim(this.x + offsetX, this.maxRangeU + BLOCK_SIZE + offsetY);
            }

            for (var i = this.x + BLOCK_SIZE, j = 0; i < this.rangeR && i < this.maxRangeR - BLOCK_SIZE; i += BLOCK_SIZE, j++) {
                this.explAnimH[j].applyAnim(i + offsetX, this.y + offsetY);
            }
            if (this.rangeR === this.maxRangeR) {
                this.explAnimR.applyAnim(this.maxRangeR - BLOCK_SIZE + offsetX, this.y + offsetY);
            }

            for (var i = this.x - BLOCK_SIZE, j = range; i > this.rangeL && i > this.maxRangeL + BLOCK_SIZE; i -= BLOCK_SIZE, j++) {
                this.explAnimH[j].applyAnim(i + offsetX, this.y + offsetY);
            }
            if (this.rangeL === this.maxRangeL) {
                this.explAnimL.applyAnim(this.maxRangeL + BLOCK_SIZE + offsetX, this.y + offsetY);
            }
        }
    }

    this.isCollided = function (obj, type) {
        if (this.explosionTimeOut === 0 || this.explosionTimeOut > 8) {
            return false;
        }

        if (isCollided(obj, this.x, this.y, 0, 0)) {
            return true;
        }

        for (var i = this.y + BLOCK_SIZE; i < this.rangeD; i += BLOCK_SIZE) {
            if (i > inGame.level.ld.sizeY * BLOCK_SIZE) {
                this.rangeD = i;
                return false;
            }
            if (isCollided(obj, this.x, i, 8, 0)) {
                if (type === 1) {
                    this.rangeD = i;
                }
                return true;
            }
        }

        for (var i = this.y - BLOCK_SIZE; i > this.rangeU; i -= BLOCK_SIZE) {
            if (i < 0) {
                this.rangeU = i;
                return false;
            }
            if (isCollided(obj, this.x, i, 8, 0)) {
                if (type === 1) {
                    this.rangeU = i;
                }
                return true;
            }
        }

        for (var i = this.x - BLOCK_SIZE; i > this.rangeL; i -= BLOCK_SIZE) {
            if (i < 0) {
                this.rangeL = i;
                return false;
            }
            if (isCollided(obj, i, this.y, 0, 8)) {
                if (type === 1) {
                    this.rangeL = i;
                }
                return true;
            }
        }

        for (var i = this.x + BLOCK_SIZE; i < this.rangeR; i += BLOCK_SIZE) {
            if (i > inGame.level.ld.sizeX * BLOCK_SIZE) {
                this.rangeR = i;
                return false;
            }
            if (isCollided(obj, i, this.y, 0, 8)) {
                if (type === 1) {
                    this.rangeR = i;
                }
                return true;
            }
        }

        return false;
    }

    this.explosion = function () {
        bombSound.play();
        this.explosionTimeOut = 10;
    }
}