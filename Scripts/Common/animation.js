function Animation(imgSrc, clipCountX, clipCountY, clipWidth, clipHeight, speed, callBack) {
    this.image = new Image();
    this.image.src = imgSrc;
    this.clipWidth = clipWidth;
    this.clipHeight = clipHeight;
    this.clips = [];
    this.maxCyle = 100 / speed;
    this.callBack = callBack;

    for (var i = 0; i < clipCountY; i++) {
        for (var j = 0; j < clipCountX; j++) {
            this.clips.push({ x: clipWidth * j, y: clipHeight * i });
        }
    }

    this.applyAnim = function (x, y, i) {
        ctx.drawImage(this.image, this.clips[i].x, this.clips[i].y,
            this.clipWidth, this.clipHeight, x, y, this.clipWidth, this.clipHeight);
    }
}

function Animator(animation, callBackObj) {
    this.animation = animation;
    this.callBackObj = callBackObj;

    this.currClip = 0;
    this.currCyle = 0;

    this.applyAnim = function (x, y) {
        this.animation.applyAnim(x, y, this.currClip);

        this.currCyle++;

        if (this.currCyle >= this.animation.maxCyle) {
            this.currClip++;
            this.currCyle = 0;
            if (this.currClip >= this.animation.clips.length) {
                this.currClip = 0;
                if (this.animation.callBack) {
                    if (this.callBackObj !== undefined) {
                        this.animation.callBack(this.callBackObj);
                    } else {
                        this.animation.callBack();
                    }
                }
            }
        }
    }
}
