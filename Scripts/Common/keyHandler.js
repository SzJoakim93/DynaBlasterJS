var keystates = [];

var defaultControlSet = {
    up: KEY_UP,
    down: KEY_DOWN,
    left: KEY_LEFT,
    right: KEY_RIGHT,
    bomb: KEY_RETURN,
    explode: KEY_RCTRL
};

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    keystates[e.which] = true;

    /*if (e.key === "Enter" && scene.currentMenu) {
        scene.currentMenu.select();
    } else if ((e.key === "Up" || e.key === "ArrowUp") && scene.currentMenu) {
        scene.currentMenu.selectPrev();
    } else if ((e.key === "Down" || e.key === "ArrowDown") && scene.currentMenu) {
        scene.currentMenu.selectNext();
    } else if ((e.key >= "a" && e.key <= "z" || e.key === "Backspace") && scene.currentMenu) {
        scene.currentMenu.inputChar(e.key)
    }*/
}

function gamepadButtonDownHandler() {
    if (!scene.currentMenu) {
        return;
    }

    if (isActionPressed(null, 0, "up", null, true)) {
        scene.currentMenu.selectPrev();
    } else if (isActionPressed(null, 0, "down", null, true)) {
        scene.currentMenu.selectNext();
    } else if (isActionPressed(null, 0, "bomb", null, true)) {
        scene.currentMenu.select();
    }
}

function keyUpHandler(e) {
    keystates[e.which] = false;
}

function getActiveGamepads() {
    var gps = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
    var actives = [];
    for (var i = 0; i < gps.length; i++) {
        if (gps[i]) {
            actives.push(gps[i]);
        }
    }
    return actives;
}

function getGamepadForPlayer(playerIndex, totalPlayers) {
    var gps = getActiveGamepads();
    var gpIndex = (totalPlayers - 1) - playerIndex;
    if (gpIndex >= 0 && gpIndex < gps.length) {
        return gps[gpIndex];
    }
    return null;
}

function getFirstGamepad() {
    var gps = getActiveGamepads();
    for (var i = 0; i < gps.length; i++) {
        if (gps[i]) {
            return gps[i];
        }
    }
    return null;
}

var prevActions = {};

function isActionPressed(playerIndex, totalPlayers, action, controlSet, checkEdge) {
    var pressed = false;

    if (controlSet === null) {
        controlSet = defaultControlSet;
    }

    if (keystates[controlSet[action]]) {
        pressed = true;
    } else {
        var gp = null;
        if (playerIndex === null) {
            gp = getFirstGamepad();
        } else {
            gp = getGamepadForPlayer(playerIndex, totalPlayers);
        }

        if (gp) {
            var b = gp.buttons;
            var a = gp.axes;
            if (action === "up") pressed = (b[12] && b[12].pressed) || (a[1] !== undefined && a[1] < -0.5);
            else if (action === "down") pressed = (b[13] && b[13].pressed) || (a[1] !== undefined && a[1] > 0.5);
            else if (action === "left") pressed = (b[14] && b[14].pressed) || (a[0] !== undefined && a[0] < -0.5);
            else if (action === "right") pressed = (b[15] && b[15].pressed) || (a[0] !== undefined && a[0] > 0.5);
            else if (action === "bomb") pressed = (b[0] && b[0].pressed);
            else if (action === "explode") pressed = (b[1] && b[1].pressed) || (b[2] && b[2].pressed);
        }
    }

    if (checkEdge) {
        var key = playerIndex + "_" + action;
        if (pressed && !prevActions[key]) {
            prevActions[key] = true;
            return true;
        } else if (!pressed) {
            prevActions[key] = false;
        }
        return false;
    }

    return pressed;
}

function anyGamepadButtonPressed() {
    var gps = getActiveGamepads();
    for (var i = 0; i < gps.length; i++) {
        var gp = gps[i];
        for (var b = 0; b < gp?.buttons.length; b++) {
            if (gp.buttons[b].pressed) return true;
        }
    }
    return false;
}