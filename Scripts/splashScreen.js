function SplashScreen() {
    this.text = "PRESS ANY KEY TO START";
    this.blinkTime = 0;

    this.handleEvents = function () {
        this.blinkTime++;

        var anyKeyPressed = false;
        for (var i = 0; i < keystates.length; i++) {
            if (keystates[i]) {
                anyKeyPressed = true;
                keystates[i] = false; // consume the keypress
            }
        }

        if (anyKeyPressed || anyGamepadButtonPressed()) {
            mainMenu.switch();
        }
    }

    this.rendering = function () {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (Math.floor(this.blinkTime / 15) % 2 === 0) {
            font.apply(this.text, 140, 240);
        }
    }
}
