var enemyTypes = [
    { speed: 2, score: 10 }, //0
    { speed: 2, isGoThroughtBlocks: true, score: 10 }, //1
    { speed: 2, score: 10 }, //2
    { speed: 2, score: 20 }, //3
    { speed: 2, score: 40 }, //4
    { speed: 2, score: 40 }, //5
    { speed: 2, score: 20 }, //6
    { speed: 3, score: 80, isGoThroughtBlocks: true }, //7
    { speed: 2, score: 40 }, //8
    { speed: 2, score: 40 }, //9
    { speed: 2, score: 40 }, //10
    { speed: 2, score: 20 }, //11
    { speed: 4, score: 200, isFollowing: true }, //12
    { speed: 2, score: 20 }, //13
    { speed: 3, score: 100, isGoThroughtBlocks: true }, //14
    { speed: 2, score: 20 }, //15
    { speed: 3, score: 40 }, //16
    { speed: 2, score: 20 }, //17
    { speed: 3, score: 2000, isSnakeDragon: true, isFollowing: true, isGoThroughtBlocks: true, isGoThroughtBombs: true }, //18
    { speed: 3, score: 100, isGoThroughtBlocks: true }, //19
    { speed: 3, score: 80 }, //20
    { speed: 2, score: 3000 }, //21
    { speed: 2, score: 100 }, //22
    { speed: 2, score: 3000, isShielded: true }, //23
    { speed: 2, score: 2000, isFruitSpawner: true }, //24
    { speed: 2, score: 0 }, //25
    { speed: 3, score: 5000, isAlwaysShielded: true }, //26
    { speed: 3, score: 100, isFireball: true }, //27
    { speed: 3, score: 100, isFireball: true }, //28
    { speed: 3, score: 100, isFireball: true }, //29
    { speed: 3, score: 100, isFireball: true }, //30
];

//animation types
var ENEMY_TYPE_FACE_UP = 0;
var ENEMY_TYPE_DIRECTION = 1;

//animation consts
var ENEMY_DEAD = 0;

//anim type 0 enemies
var ENEMY_ALIVE = 3;

//anim type 1 enemies
var ENEMY_LEFT = 3;
var ENEMY_RIGHT = 4;
var ENEMY_UP = 5;
var ENEMY_DOWN = 6;

//snake-dragon-middle
var SNAKEDRAGON_M_LEFT = 7;
var SNAKEDRAGON_M_RIGHT = 8;
var SNAKEDRAGON_M_UP = 9;
var SNAKEDRAGON_M_DOWN = 10;

//snake-dragon-tail
var SNAKEDRAGON_T_LEFT = 11;
var SNAKEDRAGON_T_RIGHT = 12;
var SNAKEDRAGON_T_UP = 13;
var SNAKEDRAGON_T_DOWN = 14;

//fruint rising
var FRUIT_SPAWNING = 4;

var FRUIT_TYPE = 25;
var COIN_TYPE = 19;
var BULL_TYPE = 23;

var STANDARD_TYPES = [7, 10, 12, 14];

for (var i = 0; i < 14; i++) {
    enemyTypes[i].life = 1;
    enemyTypes[i].animType = ENEMY_TYPE_FACE_UP;
    enemyTypes[i].animation = new MultipleAnimation("GFX/Enemy" + (i + 1).toString() + ".png", 9, 1, 32, 36, 40);
    enemyTypes[i].animation.animations = [
        { from: 3, to: 3, nextAnim: 1, direction: 1, delay: 10 }, //dead begin
        { from: 3, to: 8, nextAnim: 2, direction: 1, delay: 0 }, //dead
        { from: 8, to: 8, nextAnim: null, direction: 1, delay: 30, callBack: function (e) { e.onDead(); } }, //dead end (point shown)
        { from: 0, to: 2, nextAnim: null, direction: 1, delay: 0 } //alive
    ];
}

for (var i = 14; i < 18; i++) {
    enemyTypes[i].life = 1;
    enemyTypes[i].animType = ENEMY_TYPE_DIRECTION;
    enemyTypes[i].animation = new MultipleAnimation("GFX/Enemy" + (i + 1).toString() + ".png", 9, 2, 32, 36, 40);
    enemyTypes[i].animation.animations = [
        { from: 12, to: 12, nextAnim: 1, direction: 1, delay: 10 },  //dead begin
        { from: 12, to: 17, nextAnim: 2, direction: 1, delay: 0 }, //dead
        { from: 17, to: 17, nextAnim: null, direction: 1, delay: 30, callBack: function (e) { e.onDead(); } }, //dead end (point shown)
        { from: 0, to: 2, nextAnim: null, direction: 1, delay: 0 }, //left
        { from: 6, to: 8, nextAnim: null, direction: 1, delay: 0 }, //right
        { from: 3, to: 5, nextAnim: null, direction: 1, delay: 0 }, //up
        { from: 9, to: 11, nextAnim: null, direction: 1, delay: 0 }, //down

    ];
}

//Snake-dragon
//Dead of head
enemyTypes[18].life = 4;
enemyTypes[18].isColoredLife = true;
enemyTypes[18].animType = ENEMY_TYPE_DIRECTION;
enemyTypes[18].animation = new MultipleAnimation("GFX/Enemy19.png", 34, 5, 32, 36, 40);
enemyTypes[18].animation.animations = [
    { from: 137, to: 137, nextAnim: 1, direction: 1, delay: 30 },  //dead begin
    { from: 137, to: 145, nextAnim: 2, direction: 1, delay: 0 }, //dead
    { from: 145, to: 145, nextAnim: null, direction: 1, delay: 30, callBack: function (e) { e.onDead(); } }, //dead end
];

//Head
for (var i = enemyTypes[18].life - 1; i >= 0; i--) {
    enemyTypes[18].animation.animations.push({ from: 8 + (i * 34), to: 11 + (i * 34), nextAnim: null, direction: 1, delay: 0 }); //left
    enemyTypes[18].animation.animations.push({ from: 2 + (i * 34), to: 5 + (i * 34), nextAnim: null, direction: 1, delay: 0 }); //right
    enemyTypes[18].animation.animations.push({ from: 0 + (i * 34), to: 1 + (i * 34), nextAnim: null, direction: 1, delay: 0 }); //up
    enemyTypes[18].animation.animations.push({ from: 6 + (i * 34), to: 7 + (i * 34), nextAnim: null, direction: 1, delay: 0 }); //down
}

//Middle
for (var i = enemyTypes[18].life - 1; i >= 0; i--) {
    enemyTypes[18].animation.animations.push({ from: 21 + (i * 34), to: 23 + (i * 34), nextAnim: null, direction: 1, delay: 0 }); //left (middle)
    enemyTypes[18].animation.animations.push({ from: 15 + (i * 34), to: 17 + (i * 34), nextAnim: null, direction: 1, delay: 0 }); //right (middle)
    enemyTypes[18].animation.animations.push({ from: 12 + (i * 34), to: 14 + (i * 34), nextAnim: null, direction: 1, delay: 0 }); //up (middle)
    enemyTypes[18].animation.animations.push({ from: 18 + (i * 34), to: 20 + (i * 34), nextAnim: null, direction: 1, delay: 0 }); //down (middle)
}

//Tails
for (var i = enemyTypes[18].life - 1; i >= 0; i--) {
    enemyTypes[18].animation.animations.push({ from: 32 + (i * 34), to: 33 + (i * 34), nextAnim: null, direction: 1, delay: 0 }); //left (tail)
    enemyTypes[18].animation.animations.push({ from: 27 + (i * 34), to: 28 + (i * 34), nextAnim: null, direction: 1, delay: 0 }); //right (tail)
    enemyTypes[18].animation.animations.push({ from: 24 + (i * 34), to: 26 + (i * 34), nextAnim: null, direction: 1, delay: 0 }); //up (tail)
    enemyTypes[18].animation.animations.push({ from: 29 + (i * 34), to: 31 + (i * 34), nextAnim: null, direction: 1, delay: 0 }); //down (tail)

}

//Tail dead
for (var i = enemyTypes[18].life - 1; i >= 0; i--) {
    enemyTypes[18].animation.animations.push({ from: 146, to: 146, nextAnim: null, direction: 1, delay: 0, delay: 10 }); //dead-begin (tail)
    enemyTypes[18].animation.animations.push({ from: 146, to: 154, nextAnim: null, direction: 1, delay: 0, delay: 0 }); //dead (tail)
    enemyTypes[18].animation.animations.push({ from: 154, to: 154, nextAnim: null, direction: 1, delay: 0, delay: 0 }); //dead-end (tail)
}

//Coin
enemyTypes[19].life = 1;
enemyTypes[19].animType = ENEMY_TYPE_FACE_UP;
enemyTypes[19].animation = new MultipleAnimation("GFX/Enemy20.png", 11, 1, 32, 36, 40);
enemyTypes[19].animation.animations = [
    { from: 4, to: 4, nextAnim: 1, direction: 1, delay: 10 }, //dead begin
    { from: 4, to: 9, nextAnim: 2, direction: 1, delay: 0 }, //dead
    { from: 9, to: 9, nextAnim: null, direction: 1, delay: 30, callBack: function (e) { e.onDead(); } }, //dead end (point shown)
    { from: 0, to: 3, nextAnim: null, direction: 1, delay: 0 } //alive
];

//Cup
enemyTypes[20].life = 1;
enemyTypes[20].animType = ENEMY_TYPE_DIRECTION;
enemyTypes[20].animation = new MultipleAnimation("GFX/Enemy21.png", 11, 1, 32, 36, 40);
enemyTypes[20].animation.animations = [
    { from: 4, to: 4, nextAnim: 1, direction: 1, delay: 10 },  //dead begin
    { from: 4, to: 10, nextAnim: 2, direction: 1, delay: 0 }, //dead
    { from: 9, to: 9, nextAnim: null, direction: 1, delay: 30, callBack: function (e) { e.onDead(); } }, //dead end (point shown)
    { from: 2, to: 2, nextAnim: null, direction: 1, delay: 0 }, //left
    { from: 0, to: 0, nextAnim: null, direction: 1, delay: 0 }, //right
    { from: 3, to: 3, nextAnim: null, direction: 1, delay: 0 }, //up
    { from: 1, to: 1, nextAnim: null, direction: 1, delay: 0 }, //down
];

//Ghost
enemyTypes[21].life = 4;
enemyTypes[21].isColoredLife = true;
enemyTypes[21].animType = ENEMY_TYPE_DIRECTION;
enemyTypes[21].animation = new MultipleAnimation("GFX/Enemy22.png", 12, 4, 32, 48, 40);

//custom dead animation clips
for (var i = 0; i < 6; i++) {
    enemyTypes[21].animation.addCustomClip(i * 64, 192, 64, 50);
}

enemyTypes[21].animation.animations = [
    { from: 16, to: 16, nextAnim: 1, direction: 1, delay: 10 },  //dead begin
    { from: 16, to: 22, nextAnim: 2, direction: 1, delay: 0 }, //dead
    { from: 22, to: 22, nextAnim: null, direction: 1, delay: 30, callBack: function (e) { e.onDead(); } }, //dead end (point shown)
];

for (var i = enemyTypes[21].life - 1, j = 0; i >= 0; i--, j++) {
    enemyTypes[21].animation.animations.push({ from: 9 + (i * 12), to: 10 + (i * 12), nextAnim: 7 + (j * 8), direction: 1, delay: 0 }); //left
    enemyTypes[21].animation.animations.push({ from: 3 + (i * 12), to: 4 + (i * 12), nextAnim: 8 + (j * 8), direction: 1, delay: 0 }); //right
    enemyTypes[21].animation.animations.push({ from: 6 + (i * 12), to: 7 + (i * 12), nextAnim: 9 + (j * 8), direction: 1, delay: 0 }); //up
    enemyTypes[21].animation.animations.push({ from: 0 + (i * 12), to: 1 + (i * 12), nextAnim: 10 + (j * 8), direction: 1, delay: 0 }); //down

    enemyTypes[21].animation.animations.push({ from: 11 + (i * 12), to: 10 + (i * 12), nextAnim: 3 + (j * 8), direction: -1, delay: 0 }); //left-back
    enemyTypes[21].animation.animations.push({ from: 5 + (i * 12), to: 4 + (i * 12), nextAnim: 4 + (j * 8), direction: -1, delay: 0 }); //right-back
    enemyTypes[21].animation.animations.push({ from: 8 + (i * 12), to: 7 + (i * 12), nextAnim: 5 + (j * 8), direction: -1, delay: 0 }); //up-back
    enemyTypes[21].animation.animations.push({ from: 2 + (i * 12), to: 1 + (i * 12), nextAnim: 6 + (j * 8), direction: -1, delay: 0 }); //down-back
}

//Small-ghost
enemyTypes[22].life = 2;
enemyTypes[22].isColoredLife = true;
enemyTypes[22].animType = ENEMY_TYPE_FACE_UP;
enemyTypes[22].animation = new MultipleAnimation("GFX/Enemy23.png", 12, 2, 32, 36, 40);
enemyTypes[22].animation.animations = [
    { from: 6, to: 6, nextAnim: 1, direction: 1, delay: 10 }, //dead begin
    { from: 6, to: 12, nextAnim: 2, direction: 1, delay: 0 }, //dead
    { from: 12, to: 12, nextAnim: null, direction: 1, delay: 30, callBack: function (e) { e.onDead(); } } //dead end (point shown)
];

//alive
for (var i = enemyTypes[22].life - 1; i >= 0; i--) {
    enemyTypes[22].animation.animations.push({ from: 0 + (i * 3), to: 2 + (i * 3), nextAnim: null, direction: 1, delay: 0 });
}

//Dragon bosses
enemyTypes[23].animation = new MultipleAnimation("GFX/Enemy24.png", 9, 2, 32, 36, 40);
enemyTypes[24].animation = new MultipleAnimation("GFX/Enemy25.png", 9, 3, 32, 36, 40);

for (var i = 23; i < 25; i++) {
    enemyTypes[i].life = 4;
    enemyTypes[i].isColoredLife = true;
    enemyTypes[i].animType = ENEMY_TYPE_FACE_UP;

    if (i === 23) {
        enemyTypes[i].animation.animations = [
            { from: 8, to: 8, nextAnim: 1, direction: 1, delay: 10 }, //dead begin
            { from: 8, to: 17, nextAnim: 2, direction: 1, delay: 0 }, //dead
            { from: 17, to: 17, nextAnim: null, direction: 1, delay: 30, callBack: function (e) { e.onDead(); } } //dead end (point shown)
        ];
    } else {
        enemyTypes[i].animation.animations = [
            { from: 8, to: 8, nextAnim: 1, direction: 1, delay: 10 }, //dead begin
            { from: 8, to: 19, nextAnim: 2, direction: 1, delay: 0 }, //dead
            { from: 19, to: 19, nextAnim: null, direction: 1, delay: 30, callBack: function (e) { e.onDead(); } } //dead end (point shown)
        ];
    }

    //alive
    for (var j = enemyTypes[i].life - 1; j >= 0; j--) {
        enemyTypes[i].animation.animations.push({ from: 0 + (j * 4), to: 3 + (j * 4), nextAnim: null, direction: 1, delay: 0 });
    }
}

//Fruit
enemyTypes[25].life = 1;
enemyTypes[25].animType = ENEMY_TYPE_FACE_UP;
enemyTypes[25].animation = new MultipleAnimation("GFX/Enemy26.png", 9, 2, 32, 36, 40);
enemyTypes[25].animation.animations = [
    { from: 9, to: 9, nextAnim: 1, direction: 1, delay: 10 }, //dead begin
    { from: 9, to: 17, nextAnim: 2, direction: 1, delay: 0 }, //dead
    { from: 17, to: 17, nextAnim: null, direction: 1, delay: 30, callBack: function (e) { e.onDead(); } }, //dead end (point shown)
    { from: 5, to: 8, nextAnim: null, direction: 1, delay: 0 }, //alive
    { from: 0, to: 4, nextAnim: null, direction: 1, delay: 0, callBack: function (e) { e.onFruitSpawned(); } } //spawning
];

//People
//Reusing playerAnimations
for (var i = 0; i < 5; i++) {
    enemyTypes[26 + i].life = 3;
    enemyTypes[26 + i].isColoredLife = false;
    enemyTypes[26 + i].animType = ENEMY_TYPE_DIRECTION;
    enemyTypes[26 + i].animation = new MultipleAnimation("GFX/Player" + (i + 2).toString() + ".png", 12, 1, 36, 44, 40);
    enemyTypes[26 + i].animation.animations = [null, null, null];

    for (var j = 0; j < playerAnimations[i + 1].animations.length; j++) {
        enemyTypes[26 + i].animation.animations.push(playerAnimations[i + 1].animations[j]);
    }
}

for (var i = 0; i < enemyTypes.length; i++) {
    enemyTypes[i].animLifeOffset = enemyTypes[i].animType === ENEMY_TYPE_FACE_UP ? 1 : 4;
}

enemyTypes[21].animLifeOffset = 8;

var shieldAnim1 = new Animation("GFX/Shield1.png", 2, 1, 64, 64, 50);
var shieldAnim2 = new Animation("GFX/Shield2.png", 3, 1, 64, 64, 50);
var fireballAnim = new MultipleAnimation("GFX/FireBall.png", 12, 1, 36, 44, 40);
fireballAnim.animations = [
    { from: 0, to: 6, nextAnim: 2, direction: 1, delay: 0, callBack: function (e) { e.isFireballSwitching = false; } },
    { from: 6, to: 0, nextAnim: 2, direction: -1, delay: 0, callBack: function (e) { e.isFireballSwitching = false; } },
    { from: 7, to: 11, nextAnim: null, direction: 1, delay: 0 }
];