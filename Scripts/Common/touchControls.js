var touchPointers = {};

function setTouchKey(button, isPressed) {
    var key = Number(button.dataset.key);
    keystates[key] = isPressed;
    button.classList.toggle("is-pressed", isPressed);
}

function releaseTouchPointer(pointerId) {
    var button = touchPointers[pointerId];
    if (button) {
        setTouchKey(button, false);
        delete touchPointers[pointerId];
    }
}

document.querySelectorAll(".touch-button").forEach(function (button) {
    button.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        touchPointers[event.pointerId] = button;
        try {
            button.setPointerCapture(event.pointerId);
        } catch (error) {
        }
        setTouchKey(button, true);
    });

    button.addEventListener("pointerup", function (event) {
        event.preventDefault();
        releaseTouchPointer(event.pointerId);
    });

    button.addEventListener("pointercancel", function (event) {
        releaseTouchPointer(event.pointerId);
    });
});

window.addEventListener("blur", function () {
    Object.keys(touchPointers).forEach(releaseTouchPointer);
});

if (screen.orientation && screen.orientation.lock) {
    document.addEventListener("fullscreenchange", function () {
        if (document.fullscreenElement) {
            screen.orientation.lock("landscape").catch(function () { });
        }
    });
}