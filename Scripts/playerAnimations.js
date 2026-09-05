var playerAnimations = [];
var deadAnimations = [];

var loserAnimation = new Animation("GFX/Loser.png", 4, 1, 128, 72, 50);
var playerCeremony = new MultipleImage("GFX/PlayerCeremony.png", 6, 3, 44, 60);
var playerMarkImg = new MultipleImage("GFX/PlayerMMark.png", 5, 1, 44, 46);

var waterAnimation = new Animation("GFX/Water.png", 3, 1, 32, 18, 40);

var DEAD_ANIM = 0;
var INJURED_ANIM = 4;

for (var i = 0; i < 6; i++) {
    playerAnimations[i] = new MultipleAnimation("GFX/Player" + (i + 1).toString() + ".png", 12, 1, 36, 44, 40);
    playerAnimations[i].animations = [
        { from: 6, to: 8, nextAnim: null, direction: 1, delay: 0 }, //left
        { from: 3, to: 5, nextAnim: null, direction: 1, delay: 0 }, //right
        { from: 9, to: 11, nextAnim: null, direction: 1, delay: 0 }, //up
        { from: 0, to: 2, nextAnim: null, direction: 1, delay: 0 }, //down
        { from: 6, to: 6, nextAnim: null, direction: 1, delay: 0 }, //left iddle
        { from: 3, to: 3, nextAnim: null, direction: 1, delay: 0 }, //right iddle
        { from: 9, to: 9, nextAnim: null, direction: 1, delay: 0 }, //up iddle
        { from: 0, to: 0, nextAnim: null, direction: 1, delay: 0 }, //down iddle
    ];

    deadAnimations[i] = new MultipleAnimation("GFX/Dead" + (i + 1).toString() + ".png", 8, 1, 64, 44, 40);
    deadAnimations[i].animations = [
        { from: 0, to: 0, nextAnim: 1, direction: 1, delay: 0 }, //dead begin
        { from: 0, to: 1, nextAnim: 2, direction: 1, delay: 0 }, //dead
        { from: 1, to: 0, nextAnim: 3, direction: -1, delay: 0 },
        { from: 0, to: 7, nextAnim: null, direction: 1, delay: 0, callBack: function (obj) { obj.onDead(); } }, //dead end
        { from: 0, to: 1, nextAnim: null, direction: 1, delay: 0 } //injured
    ];
}
