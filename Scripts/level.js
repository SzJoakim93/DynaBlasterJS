var BLOCK_SIZE = 32;
var BLOCK_SIZE_HALF = BLOCK_SIZE / 2;
var BLOCK_SIZE_DOUBLE = BLOCK_SIZE * 2;

var missionNum = 0;
var levelNum = 0;

var bonusAnim = new MultipleAnimation("GFX/Bonus.png", 2, 10, 32, 32, 10);
for (var i = 0; i < 10; i++) {
    bonusAnim.animations[i] = { from: i * 2, to: i * 2 + 1, nextAnim: null, direction: 1, delay: 0 };
}

bonusAnim.animations[10] = { from: 18, to: 18, nextAnim: null, direction: 1, delay: 0 };

var bonusTerminateAnim = new Animation("GFX/BonusTerminate.png", 5, 1, 58, 58, 50, function (i) {
    bonusTerminates[i].isActive = false;
});

var bonusTerminates = [
    { anim: new Animator(bonusTerminateAnim, 0), x: 0, y: 0, isActive: false },
    { anim: new Animator(bonusTerminateAnim, 1), x: 0, y: 0, isActive: false },
    { anim: new Animator(bonusTerminateAnim, 2), x: 0, y: 0, isActive: false }
];

var shineAnimation = new Animation("GFX/Shine.png", 4, 1, 64, 46, 50);
var shine = new Animator(shineAnimation);

var markedBlock = new MarkEffect(10);

function isCollided(obj, x, y, narrowX, narrowY) {
    if (x > obj.x - BLOCK_SIZE + narrowX && x < obj.x + BLOCK_SIZE - narrowX
        && y > obj.y - BLOCK_SIZE + narrowY && y < obj.y + BLOCK_SIZE - narrowY) {
        return true;
    }
    return false;
}

function activateNextBonusTerminate(x, y) {
    for (var i = 0; i < bonusTerminates.length; i++) {
        if (!bonusTerminates[i].isActive) {
            bonusTerminates[i].x = x;
            bonusTerminates[i].y = y;
            bonusTerminates[i].isActive = true;
            break;
        }
    }
}

function Level() {
    this.levelWidth = 0;
    this.levelHeight = 0;

    this.blocks = [];
    this.enemies = [];
    this.bonuses = [];

    this.time = new TimeDesc(function (l) { l.spawnCoins(); }, this);

    this.loadLevel = function (m, l) {
        missionNum = m;
        levelNum = l;
        this.mapObject = new MultipleImage("GFX/MapObjects" + m.toString() + ".png", 20, 2, 32, 32);

        this.stoneRuinAnim = new Animation("GFX/StoneRuining" + m.toString() + ".png", 7, 1, 32, 32, 50, function (i) {
            inGame.level.stoneRuins[i].isActive = false;
        });

        this.stoneRuins = [
            { anim: new Animator(this.stoneRuinAnim, 0), x: 0, y: 0, isActive: false },
            { anim: new Animator(this.stoneRuinAnim, 1), x: 0, y: 0, isActive: false },
            { anim: new Animator(this.stoneRuinAnim, 2), x: 0, y: 0, isActive: false },
            { anim: new Animator(this.stoneRuinAnim, 3), x: 0, y: 0, isActive: false },
            { anim: new Animator(this.stoneRuinAnim, 4), x: 0, y: 0, isActive: false },
            { anim: new Animator(this.stoneRuinAnim, 5), x: 0, y: 0, isActive: false },
            { anim: new Animator(this.stoneRuinAnim, 6), x: 0, y: 0, isActive: false }
        ];
    }

    this.reset = function () {
        this.blocks = [];
        this.enemies = [];
        this.bonuses = [];
        this.gate = null;
        this.time.reset(4, 0);

        this.ld = missions[missionNum].levels[levelNum]();

        this.levelWidth = this.ld.sizeX * BLOCK_SIZE - BLOCK_SIZE;
        this.levelHeight = this.ld.sizeY * BLOCK_SIZE - BLOCK_SIZE;

        this.frame_decors = [BLOCK_SIZE * 2, this.levelWidth - BLOCK_SIZE * 3];

        offsetX = 320 - (this.levelWidth + BLOCK_SIZE) / 2;
        offsetY = 48 + BLOCK_SIZE;

        if (this.ld.hasBlocks) {
            var totalTiles = this.ld.sizeX * this.ld.sizeY;

            // estimate indestructible pattern (~1/3)
            var solidTiles = Math.floor(totalTiles / 3);

            // tiles where blocks CAN exist
            var usableTiles = totalTiles - solidTiles;

            // destructible blocks (~40% of usable space)
            var blockCount = Math.floor(usableTiles * 0.4);

            for (var i = 0; i < blockCount; i++) {
                var coord = this.generateCoord(2);
                this.blocks.push({ x: coord.x, y: coord.y });
            }

            var bonusCount = inGame.gameMode === STORY_MODE ? inGame.players.length : this.ld.bonuses.length;
            for (var i = 0; i < bonusCount; i++) {
                this.addBonus(this.ld.bonuses[i]);
            }

            if (inGame.gameMode === STORY_MODE) {
                this.addBonus(9);
            }
        }

        for (var i = 0; i < this.ld.enemies.length; i++) {
            var coord = this.generateCoord(5);
            this.enemies.push(new Enemy(coord.x, coord.y, this.ld.enemies[i]));
        }

        for (var i = 0; i < this.blocks.length; i++) {
            this.blocks[i].x *= BLOCK_SIZE;
            this.blocks[i].y *= BLOCK_SIZE;
        }
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].x *= BLOCK_SIZE;
            this.enemies[i].y *= BLOCK_SIZE;
            for (var j = 0; j < this.enemies[i].tails.length; j++) {
                this.enemies[i].tails[j].x *= BLOCK_SIZE;
                this.enemies[i].tails[j].y *= BLOCK_SIZE;
            }
            this.enemies[i].initDir();
        }

        enemyCount = this.enemies.length;
    }
    this.generateCoord = function (forbiddenRange) {
        do {
            var y = Math.floor(Math.random() * this.ld.sizeY);
            if (y % 2 === 1) {
                var x = Math.floor(Math.random() * (this.ld.sizeX / 2)) * 2;
            } else {
                var x = Math.floor(Math.random() * this.ld.sizeX);
            }
        }
        while (this.isBlockExists(x, y) || this.isForbiddenCoord(x, y, forbiddenRange));
        return { x: x, y: y };
    }

    this.isForbiddenCoord = function (x, y, forbiddenRange) {
        for (var i = 0; i < inGame.players.length; i++) {
            if (x * BLOCK_SIZE < inGame.players[i].x + forbiddenRange * BLOCK_SIZE && x * BLOCK_SIZE > inGame.players[i].x - forbiddenRange * BLOCK_SIZE
                && y * BLOCK_SIZE < inGame.players[i].y + forbiddenRange * BLOCK_SIZE && y * BLOCK_SIZE > inGame.players[i].y - forbiddenRange * BLOCK_SIZE) {
                return true;
            }
        }
        return false;
    }

    this.addBonus = function (type) {
        var availableBlocks = [];
        for (var i = 0; i < this.blocks.length; i++) {
            if (this.blocks[i].bonus === undefined) {
                availableBlocks.push(this.blocks[i]);
            }
        }
        if (availableBlocks.length > 0) {
            var index = Math.floor(Math.random() * availableBlocks.length);
            availableBlocks[index].bonus = type;
        }
    }

    this.isBlockExists = function (x, y) {
        for (var i = 0; i < this.blocks.length; i++) {
            if (this.blocks[i].x === x && this.blocks[i].y === y) {
                return true;
            }
        }

        return false;
    }

    this.isCollidedWithBlockOrBomb = function (x, y, excludeBomb, isGoThroughtBombs, isGoThroughtBlocks) {
        if (!isGoThroughtBlocks) {
            for (var i = 0; i < this.blocks.length; i++) {
                if (isCollided(this.blocks[i], x, y, 0, 0)) {
                    return true;
                }
            }
        }

        if (!isGoThroughtBombs) {
            for (var i = 0; i < bombs.length; i++) {
                if (bombs[i] !== excludeBomb && isCollided(bombs[i], x, y, 0, 0)) {
                    return true;
                }
            }
        }

        return false;
    }

    this.handleEvents = function () {
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].handleEvents();
            for (var j = 0; j < inGame.players.length; j++) {
                if (!this.enemies[i].isDead && !inGame.players[j].isGoodMode && isCollided(inGame.players[j], this.enemies[i].x, this.enemies[i].y, 4, 4)) {
                    inGame.players[j].hit();
                }
            }
        }

        for (var i = 0; i < bombs.length; i++) {
            bombs[i].handleEvents();
        }

        for (var i = 0; i < this.bonuses.length; i++) {
            for (var j = 0; j < inGame.players.length; j++) {
                if (isCollided(inGame.players[j], this.bonuses[i].x, this.bonuses[i].y, 0, 0)) {
                    inGame.players[j].pickupBonus(this.bonuses[i].type);
                    this.bonuses.splice(i, 1);
                    break;
                }
            }
        }

        if (this.gate) {
            if (enemyCount <= 0) {
                this.gate.anim.switchAnim(9);

                for (var j = 0; j < inGame.players.length; j++) {
                    if (isCollided(inGame.players[j], this.gate.x, this.gate.y, BLOCK_SIZE_HALF, BLOCK_SIZE_HALF)) {
                        this.endLevel();
                    }
                }
            }
        }

        for (var i = 0; i < inGame.players.length; i++) {
            if (inGame.players[i].isInjured()) {
                for (var j = 0; j < inGame.players.length; j++) {
                    if (i !== j && isCollided(inGame.players[i], inGame.players[j].x, inGame.players[j].y, -4, -4)) {
                        inGame.players[i].heal();
                        break;
                    }
                }
            }
        }

        this.time.handleEvent();

        this.endTimeOutEvent.handleEvent();
    }

    this.rendering = function () {
        var x, y = 0;
        for (var i = 0; i <= this.levelHeight; i += BLOCK_SIZE) {
            for (var j = 0; j <= this.levelWidth; j += BLOCK_SIZE) {
                if (x % 2 === 1 && y % 2 === 1) {
                    this.mapObject.apply(j + offsetX, i + offsetY, 3);
                } else if (x % 2 === 1 && y % 2 === 0) {
                    this.mapObject.apply(j + offsetX, i + offsetY, 1);
                } else {
                    this.mapObject.apply(j + offsetX, i + offsetY, 0);
                }
                x++;
            }

            y++;
            x = 0;
        }

        //drawing frame of level
        this.renderingFrame();

        for (var i = 0; i < this.blocks.length; i++) {
            if (enemyCount === 0 && this.blocks[i].bonus !== undefined && this.blocks[i].bonus !== 9) {
                markedBlock.drawMultipleImage(this.mapObject, 2, 28, this.blocks[i].x + offsetX, this.blocks[i].y + offsetY);
            } else {
                this.mapObject.apply(this.blocks[i].x + offsetX, this.blocks[i].y + offsetY, 2);
            }
        }

        for (var i = 0; i < this.stoneRuins.length; i++) {
            if (this.stoneRuins[i].isActive) {
                this.stoneRuins[i].anim.applyAnim(this.stoneRuins[i].x + offsetX, this.stoneRuins[i].y + offsetY);
            }
        }

        for (var i = 0; i < this.bonuses.length; i++) {
            this.bonuses[i].anim.applyAnim(this.bonuses[i].x + offsetX, this.bonuses[i].y + offsetY);
        }

        if (this.gate) {
            this.gate.anim.applyAnim(this.gate.x + offsetX, this.gate.y + offsetY);
            if (this.endTimeOutEvent.isLaunched()) {
                shine.applyAnim(this.gate.x + offsetX - 32, this.gate.y + offsetY - 23);
            }
        }

        for (var i = 0; i < bombs.length; i++) {
            bombs[i].rendering();
        }

        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].rendering();
        }

        for (var i = 0; i < bonusTerminates.length; i++) {
            if (bonusTerminates[i].isActive) {
                bonusTerminates[i].anim.applyAnim(bonusTerminates[i].x + offsetX, bonusTerminates[i].y + offsetY);
            }
        }

    }

    this.renderingFrame = function () {
        //Upper-left tile
        this.mapObject.apply(-BLOCK_SIZE + offsetX, -BLOCK_SIZE + offsetY, 4); //inner tile
        this.mapObject.apply(-BLOCK_SIZE - BLOCK_SIZE_HALF + offsetX, -BLOCK_SIZE + offsetY, 26); //outer tile

        //Upper line
        for (var i = 0; i <= this.levelWidth; i += BLOCK_SIZE) {
            this.mapObject.apply(i + offsetX, -BLOCK_SIZE + offsetY, 5 + (i % 2));
        }

        //Upper-right tile
        this.mapObject.apply(this.levelWidth + BLOCK_SIZE + offsetX, -BLOCK_SIZE + offsetY, 7); //inner tile
        this.mapObject.apply(this.levelWidth + 2 * BLOCK_SIZE + offsetX, -BLOCK_SIZE + offsetY, 19); //outer tile

        //Right line
        for (var i = 0; i <= this.levelHeight; i += BLOCK_SIZE) {
            //inner border
            if (i === this.frame_decors[0] - BLOCK_SIZE || i === this.frame_decors[1] - BLOCK_SIZE) {
                this.mapObject.apply(this.levelWidth + BLOCK_SIZE + offsetX, i + offsetY, 9);
            } else if (i === this.frame_decors[0] || i === this.frame_decors[1]) {
                this.mapObject.apply(this.levelWidth + BLOCK_SIZE + offsetX, i + offsetY, 10);
            } else {
                this.mapObject.apply(this.levelWidth + BLOCK_SIZE + offsetX, i + offsetY, 8);
            }

            //outer border
            this.mapObject.apply(this.levelWidth + 2 * BLOCK_SIZE + offsetX, i + offsetY, 19);
        }

        //Bottom-left tile
        this.mapObject.apply(-BLOCK_SIZE + offsetX, this.levelHeight + BLOCK_SIZE + offsetY, 15); //inner tile
        this.mapObject.apply(-BLOCK_SIZE - BLOCK_SIZE_HALF + offsetX, this.levelHeight + BLOCK_SIZE + offsetY, 27); //outer tile

        //Bottom line
        for (var i = 0; i <= this.levelWidth; i += BLOCK_SIZE) {
            this.mapObject.apply(i + offsetX, this.levelHeight + BLOCK_SIZE + offsetY, 12 + (i % 2));
        }

        //Bottom-right tile
        this.mapObject.apply(this.levelWidth + BLOCK_SIZE + offsetX, this.levelHeight + BLOCK_SIZE + offsetY, 11); //inner tile
        this.mapObject.apply(this.levelWidth + 2 * BLOCK_SIZE + offsetX, this.levelHeight + BLOCK_SIZE + offsetY, 20); //outer tile

        //Left line
        for (var i = 0; i <= this.levelHeight; i += BLOCK_SIZE) {
            //inner border
            if (i === this.frame_decors[0] - BLOCK_SIZE || i === this.frame_decors[1] - BLOCK_SIZE) {
                this.mapObject.apply(-BLOCK_SIZE + offsetX, i + offsetY, 17);
            } else if (i === this.frame_decors[0] || i === this.frame_decors[1]) {
                this.mapObject.apply(-BLOCK_SIZE + offsetX, i + offsetY, 18);
            } else {
                this.mapObject.apply(-BLOCK_SIZE + offsetX, i + offsetY, 16);
            }

            this.mapObject.apply(-BLOCK_SIZE - BLOCK_SIZE_HALF + offsetX, i + offsetY, 26); //outer border
        }
    }

    this.destroyBlock = function (bolckIndex) {
        if (this.blocks[bolckIndex].bonus !== undefined) {
            if (this.blocks[bolckIndex].bonus === 9) {
                this.spawnGate(this.blocks[bolckIndex].x, this.blocks[bolckIndex].y);
            } else {
                this.spawnBonus(this.blocks[bolckIndex].x, this.blocks[bolckIndex].y, this.blocks[bolckIndex].bonus);
            }
        }
        this.blocks.splice(bolckIndex, 1);
    }

    this.activateNextStoneRuin = function (x, y) {
        for (var i = 0; i < this.stoneRuins.length; i++) {
            if (!this.stoneRuins[i].isActive) {
                this.stoneRuins[i].x = x;
                this.stoneRuins[i].y = y;
                this.stoneRuins[i].isActive = true;
                break;
            }
        }
    }

    this.spawnGate = function (x, y) {
        var anim = new MultipleAnimator(bonusAnim);
        this.gate = { x: x, y: y, anim: anim };
        anim.switchAnim(10);
    }

    this.spawnBonus = function (x, y, bonus) {
        var anim = new MultipleAnimator(bonusAnim);
        anim.switchAnim(bonus);
        this.bonuses.push({ x: x, y: y, type: bonus, anim: anim });
    }

    this.spawnFruit = function (x, y) {
        for (var i = 0; i < this.enemies[i].length; i++) {
            if (!this.enemies[i].isActive) {
                this.enemies[i].isActive = true;
                this.enemies[i].switchToFruit();
                enemyCount++;
                return;
            }
        }

        this.enemies.push(new Enemy(x, y, FRUIT_TYPE));
        enemyCount++;
    }

    this.spawnCoins = function () {
        for (var i = 0; i < 5; i++) {
            var coord = this.generateCoord(3);
            this.enemies.push(new Enemy(coord.x * BLOCK_SIZE, coord.y * BLOCK_SIZE, COIN_TYPE));
            enemyCount++;
        }
    }

    this.endLevel = function () {
        if (this.endTimeOutEvent.isLaunched()) {
            return;
        }
        inGame.playEndLevelMusic();
        this.endTimeOutEvent.launch();
    }

    this.goNextLevel = function () {
        levelNum++;
        if (levelNum > 4) {
            missionNum++;
            levelNum = 0;

            for (var i = 0; i < inGame.players.length; i++) {
                inGame.players[i].isControlBomb = false;
                inGame.players[i].isGoThroughtBombs = false;
            }
        }

        for (var i = 0; i < inGame.players.length; i++) {
            inGame.players[i].saveBaseState();
        }

        if (missionNum > 7) {
            outroScene.init();
        } else {
            inGame.saveGame();
            this.loadLevel(missionNum, levelNum);
            inGame.reset();
            mapMenu.switch();
        }
    }

    this.isEndLevel = function () {
        return this.endTimeOutEvent.isLaunched();
    }

    this.hitGate = function () {
        for (var i = 0; i < 3; i++) {
            var type = STANDARD_TYPES[Math.floor(Math.random() * STANDARD_TYPES.length)];
            this.enemies.push(new Enemy(this.gate.x, this.gate.y, type));
            enemyCount++;
        }
    }

    this.endTimeOutEvent = new TimeoutEvent(100, function (obj) { obj.goNextLevel(); }, this);
}