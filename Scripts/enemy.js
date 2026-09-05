var enemyCount;
var oppositeDir = [1, 0, 3, 2];

function Enemy(x, y, type) {
    this.x = x;
    this.y = y;
    this.dir = this.x % BLOCK_SIZE_DOUBLE === 0 ? 2 : 0;
    this.type = enemyTypes[type];
    this.life = this.type.life;
    this.speed = this.type.speed;
    this.prevDir = -1;

    this.animator = new MultipleAnimator(this.type.animation, this);
    if (this.type.animation.animations[0] === null) {
        this.deadAnim = new MultipleAnimator(deadAnimations[type - 25], this);
    }

    if (this.type.isFruitSpawner) {
        this.spawnTimeOut = new TimeoutEvent(50, function (e) { inGame.level.spawnFruit(e.x, e.y); }, this);
    }

    if (this.type.isFireball) {
        this.fireBallTimeOut = new TimeoutEvent(200, function (e) { e.switchFireBall(); }, this, true);
        this.fireBallTimeOut.launch();
        this.fireBallAnim = new MultipleAnimator(fireballAnim, this);
    }

    this.isFireballed = false;
    this.isFireballSwitching = false;
    this.isSpawning = false;
    this.tails = [];

    if (type === FRUIT_TYPE) {
        this.animator.switchAnim(FRUIT_SPAWNING);
        this.isSpawning = true;
    } else if (this.type.animType === ENEMY_TYPE_DIRECTION) {
        this.animator.switchAnim(ENEMY_UP + (this.type.isColoredLife ? (this.life - 1) * this.type.animLifeOffset : 0));
    } else {
        this.animator.switchAnim(ENEMY_ALIVE + (this.type.isColoredLife ? (this.life - 1) * this.type.animLifeOffset : 0));
    }

    if (this.type.isSnakeDragon) {
        for (var i = 0; i < 5; i++) {
            this.tails[i] = {
                x: this.x, y: this.y, dir: -1, life: this.life,
                animator: new MultipleAnimator(this.type.animation, this)
            }
            this.tails[i].animator.switchAnim(ENEMY_UP);
        }
    }

    if (this.type.isShielded || this.type.isAlwaysShielded) {
        this.shieldTimeOut = new TimeoutEvent(50, function (x) { x.shieldEnabled = !x.shieldEnabled }, this, true);
        if (type === BULL_TYPE) {
            this.shieldAnim = new Animator(shieldAnim1);
        } else {
            this.shieldAnim = new Animator(shieldAnim2);
        }
        this.shieldEnabled = true;
        if (this.type.isShielded) {
            this.shieldTimeOut.launch();
        }
    } else {
        this.shieldEnabled = false;
    }

    this.isActive = true;
    this.isDead = false;

    this.handleEvents = function () {
        if (this.isDead || this.isSpawning) {
            return;
        }

        this.handleTailEvents();

        if (!this.isFireballSwitching) {
            this.handleMovement();
        }

        if (this.type.isFruitSpawner && enemyCount < 10) {
            this.spawnTimeOut.launch();
        }

        if (this.fireBallTimeOut) {
            this.fireBallTimeOut.handleEvent();
        }

        if (this.spawnTimeOut) {
            this.spawnTimeOut.handleEvent();
        }

        if (this.shieldTimeOut) {
            this.shieldTimeOut.handleEvent();
        }
    }

    this.rendering = function () {
        if (!this.isActive) {
            return;
        }

        if (this.isFireballed || this.isFireballSwitching) {
            this.fireBallAnim.applyAnim(this.x + offsetX, this.y + offsetY);
        } else if (this.isDead && this.deadAnim) {
            this.deadAnim.applyAnim(this.x + offsetX - 14, this.y + offsetY);
        } else {
            this.animator.applyAnim(this.x + offsetX, this.y + offsetY);
        }

        for (var i = this.tails.length - 1; i >= 0; i--) {
            this.tails[i].animator.applyAnim(this.tails[i].x + offsetX, this.tails[i].y + offsetY);
        }

        if (this.shieldEnabled) {
            this.shieldAnim.applyAnim(this.x - 16 + offsetX, this.y - 14 + offsetY);
        }
    }

    this.handleMovement = function () {
        if (this.isInCrossRoad(this.x, this.y)) {
            this.changeDir();
        } else if (!this.isInCrossRoad(this.x, this.y)) {
            if (inGame.level.isCollidedWithBlockOrBomb(this.x, this.y, null, this.type.isGoThroughtBombs, this.type.isGoThroughtBlocks)) {
                this.dir = oppositeDir[this.dir];
                if (this.type.animType === ENEMY_TYPE_DIRECTION) {
                    this.animator.switchAnim(this.dir + 3 + (this.type.isColoredLife ? (this.life - 1) * this.type.animLifeOffset : 0));
                }
            }
        }

        switch (this.dir) {
            case 0:
                this.x -= this.speed;
                break;
            case 1:
                this.x += this.speed;
                break;
            case 2:
                this.y -= this.speed;
                break;
            case 3:
                this.y += this.speed;
                break;
            default:
                break;
        }
    }

    this.changeDir = function () {
        var dirs = [0, 1, 2, 3];

        if (this.x <= 0 || inGame.level.isCollidedWithBlockOrBomb(this.x - BLOCK_SIZE_HALF, this.y, null, this.type.isGoThroughtBombs, this.type.isGoThroughtBlocks)) {
            dirs.splice(dirs.indexOf(0), 1);
        }
        if (this.x >= inGame.level.levelWidth || inGame.level.isCollidedWithBlockOrBomb(this.x + BLOCK_SIZE_HALF, this.y, null, this.type.isGoThroughtBombs, this.type.isGoThroughtBlocks)) {
            dirs.splice(dirs.indexOf(1), 1);
        }
        if (this.y <= 0 || inGame.level.isCollidedWithBlockOrBomb(this.x, this.y - BLOCK_SIZE_HALF, null, this.type.isGoThroughtBombs, this.type.isGoThroughtBlocks)) {
            dirs.splice(dirs.indexOf(2), 1);
        }
        if (this.y >= inGame.level.levelHeight || inGame.level.isCollidedWithBlockOrBomb(this.x, this.y + BLOCK_SIZE_HALF, null, this.type.isGoThroughtBombs, this.type.isGoThroughtBlocks)) {
            dirs.splice(dirs.indexOf(3), 1);
        }

        if (dirs.length > 1) {
            dirs.splice(dirs.indexOf(oppositeDir[this.dir]), 1);
        }

        if (dirs.length === 0) {
            this.prevDir = this.dir;
            this.dir = -1;
            if (this.type.animType === ENEMY_TYPE_DIRECTION) {
                this.animator.switchAnim(ENEMY_UP + (this.type.isColoredLife ? (this.life - 1) * this.type.animLifeOffset : 0));
            }
            return;
        }

        if (this.type.isFollowing) {
            this.dir = this.calculateDirection(dirs);
        } else {
            this.prevDir = this.dir;
            this.dir = this.randomDir(dirs);
        }

        //correct position
        if (this.x < 0) {
            this.x = 0;
        }

        if (this.y < 0) {
            this.y = 0;
        }

        if (this.dir < 2) {
            this.y = Math.floor(this.y / BLOCK_SIZE_DOUBLE) * BLOCK_SIZE_DOUBLE;
        }

        if (this.dir === -1 || this.dir > 1) {
            this.x = Math.floor(this.x / BLOCK_SIZE_DOUBLE) * BLOCK_SIZE_DOUBLE;
        }

        if (this.type.animType === ENEMY_TYPE_DIRECTION) {
            this.animator.switchAnim(this.dir + 3 + (this.type.isColoredLife ? (this.life - 1) * this.type.animLifeOffset : 0));
        }
    }

    this.handleTailEvents = function () {
        if (this.tails.length === 0) {
            return;
        }

        for (var i = this.tails.length - 2; i >= 0; i--) {
            if (this.isInTile(this.tails[i].x, this.tails[i].y) && (this.tails[i].x !== this.tails[i + 1].x || this.tails[i].y !== this.tails[i + 1].y)) {
                this.tails[i + 1].dir = this.tails[i].dir;

                if (this.tails[i + 1].dir < 2) {
                    this.tails[i + 1].y = this.tails[i].y;
                }

                if (this.tails[i + 1].dir === -1 || this.tails[i + 1].dir > 1) {
                    this.tails[i + 1].x = this.tails[i].x;
                }

                var tailAnimOffset = i === this.tails.length - 2 ? 32 : 16;
                this.tails[i + 1].animator.switchAnim(this.tails[i + 1].dir + 3 + tailAnimOffset + (this.type.isColoredLife ? (this.tails[i + 1].life - 1) * this.type.animLifeOffset : 0));
            }
        }

        if (this.isInTile(this.x, this.y) && (this.tails[0].x !== this.x || this.tails[0].y !== this.y)) {
            this.tails[0].dir = this.dir;

            if (this.tails[0].dir < 2) {
                this.tails[0].y = this.y;
            }

            if (this.tails[0].dir === -1 || this.tails[0].dir > 1) {
                this.tails[0].x = this.x;
            }

            this.tails[0].animator.switchAnim(this.tails[0].dir + 3 + 16 + (this.type.isColoredLife ? (this.tails[0].life - 1) * this.type.animLifeOffset : 0));
        }

        for (var i = 0; i < this.tails.length; i++) {
            switch (this.tails[i].dir) {
                case 0:
                    this.tails[i].x -= this.speed;
                    break;
                case 1:
                    this.tails[i].x += this.speed;
                    break;
                case 2:
                    this.tails[i].y -= this.speed;
                    break;
                case 3:
                    this.tails[i].y += this.speed;
                    break;
                default:
                    break;
            }
        }
    }

    this.initDir = function () {
        this.dir = this.x % BLOCK_SIZE_DOUBLE === 0 ? 2 : 0;
    }

    this.hit = function () {
        if (this.isFireballed) {
            return;
        }
        this.life--;
        if (this.life <= 0) {
            this.kill();
        }
    }

    this.hitTail = function (index) {
        this.tails[index].life--;
        if (this.tails[index].life <= 0) {
            this.kill();
        }
    }

    this.kill = function () {
        if (!this.deadAnim) {
            this.animator.switchAnim(ENEMY_DEAD);
        }

        this.isDead = true;
    }

    this.onDead = function () {
        this.isActive = false;
        enemyCount--;
        if (enemyCount === 1) {
            for (var i = 0; i < inGame.level.enemies.length; i++) {
                var enemy = inGame.level.enemies[i];
                if (enemy.isActive && enemy.type.isAlwaysShielded) {
                    enemy.shieldTimeOut.launch();
                }
            }
        } else if (!inGame.level.gate && enemyCount <= 0 && inGame.level.blocks.length === 0) {
            inGame.level.spawnGate(2 * BLOCK_SIZE, 6 * BLOCK_SIZE);
        }
    }

    this.switchToFruit = function () {
        if (this.type !== enemyTypes[FRUIT_TYPE]) {
            this.type = enemyTypes[FRUIT_TYPE];
            this.animator = new MultipleAnimator(this.type.animation, this);
        }

        this.animator.switchAnim(FRUIT_SPAWNING);
        this.isSpawning = true;
    }

    this.switchFireBall = function () {
        this.isFireballSwitching = true;
        this.isFireballed = !this.isFireballed;
        this.fireBallAnim.switchAnim(this.isFireballed ? 0 : 1);
        this.speed = this.isFireballed ? 5 : this.type.speed;
    }

    this.onFruitSpawned = function () {
        this.isSpawning = false;
        this.animator.switchAnim(ENEMY_ALIVE);
    }

    this.getScore = function () {
        return this.type.score;
    }

    this.isInCrossRoad = function (x, y) {
        return x % BLOCK_SIZE_DOUBLE < this.speed && y % BLOCK_SIZE_DOUBLE < this.speed;
    }

    this.isInTile = function (x, y) {
        return x % BLOCK_SIZE < this.speed && y % BLOCK_SIZE < this.speed;
    }

    this.fixPosition = function (obj) {
        if (obj.x < 0) {
            obj.x = 0;
        }

        if (obj.y < 0) {
            obj.y = 0;
        }

        if (obj.dir < 2) {
            obj.y = Math.floor(obj.y / BLOCK_SIZE_DOUBLE) * BLOCK_SIZE_DOUBLE;
        }

        if (obj.dir === -1 || obj.dir > 1) {
            obj.x = Math.floor(obj.x / BLOCK_SIZE_DOUBLE) * BLOCK_SIZE_DOUBLE;
        }
    }

    this.calculateDirection = function (dirs) {
        var nearestP = this.getNearestPlayer();

        var distX = this.x - inGame.players[nearestP].x;
        var distY = this.y - inGame.players[nearestP].y;

        var absX = Math.abs(distX);
        var absY = Math.abs(distY);

        var horizDir = distX > 0 ? 0 : 1;
        var vertDir = distY > 0 ? 2 : 3;

        // === TRY PREFERRED AXIS ===

        var tryOrder;

        if (absX > absY) {
            tryOrder = [horizDir, vertDir];
        } else {
            tryOrder = [vertDir, horizDir];
        }

        for (var i = 0; i < tryOrder.length; i++) {
            var dir = tryOrder[i];

            if (this.canMove(dirs, dir)) {
                // avoid reverse unless forced
                if (this.prevDir !== -1 &&
                    dir === oppositeDir[this.prevDir] &&
                    dirs.length > 1) {
                    continue;
                }

                this.prevDir = dir;
                return dir;
            }
        }

        // === FALLBACK RANDOM (filtered) ===
        var chosen = this.randomDir(dirs);
        this.prevDir = chosen;
        return chosen;
    }

    this.randomDir = function (dirs) {
        return dirs[Math.floor(Math.random() * dirs.length)];
    }

    this.canMove = function (dirs, dir) {
        return dirs.indexOf(dir) !== -1;
    }

    this.getNearestPlayer = function () {
        var minDist = null;
        var nearestPlayer = 0;
        for (var i = 0; i < inGame.players.length; i++) {
            var dist = (this.x - inGame.players[i].x) + (this.y - inGame.players[i].y);
            if (minDist === null || dist < minDist) {
                minDist = dist;
                nearestPlayer = i;
            }
        }
        return nearestPlayer;
    }
}