function ScriptScene(objects, switchPoints, maxTime, callbackFunc, callbackObj) {
    this.objects = [];
    for (var i = 0; i < objects.length; i++) {
        this.objects.push({ object: objects[i], targetX: objects[i].x, targetY: objects[i].y, isTargeted: false, sound: objects[i].sound });
    }
    this.switchPoints = switchPoints;

    this.time = -1;
    this.maxTime = maxTime;

    this.handleEvents = function () {
        if (this.time > -1) {
            for (var i = 0; i < this.switchPoints.length; i++) {
                if (this.switchPoints[i].timeStamp === this.time) {
                    this.switchTarget(i);
                }
            }

            for (var i = 0; i < this.objects.length; i++) {
                var vericalColl = false;
                var horizontalColl = false;

                if (this.objects[i].object.x > this.objects[i].targetX + this.objects[i].speed) {
                    this.objects[i].object.x -= this.objects[i].speed;
                } else if (this.objects[i].object.x < this.objects[i].targetX - this.objects[i].speed) {
                    this.objects[i].object.x += this.objects[i].speed;
                } else {
                    horizontalColl = true;
                }

                if (this.objects[i].object.y > this.objects[i].targetY + this.objects[i].speed) {
                    this.objects[i].object.y -= this.objects[i].speed;
                } else if (this.objects[i].object.y < this.objects[i].targetY - this.objects[i].speed) {
                    this.objects[i].object.y += this.objects[i].speed;
                } else {
                    vericalColl = true;
                }

                if (horizontalColl && vericalColl && !this.objects[i].isTargeted) {
                    this.objects[i].isTargeted = true;

                    if (this.objects[i].targetAnim !== undefined) {
                        this.objects[i].object.anim.switchAnim(this.objects[i].targetAnim);
                    }

                    if (this.objects[i].targetSp) {
                        for (var j = 0; j < this.objects[i].targetSp.length; j++)
                            this.switchTarget(this.objects[i].targetSp[j]);
                    }
                }
            }

            this.time++;

            if (this.time >= this.maxTime) {
                this.time = -1;
                if (callbackFunc) {
                    if (callbackObj) {
                        callbackFunc(callbackObj);
                    } else {
                        callbackFunc();
                    }
                }
            }
        }


    }

    this.switchTarget = function (sp) {
        var t = this.switchPoints[sp].target;
        this.objects[t].targetX = this.switchPoints[sp].x;
        this.objects[t].targetY = this.switchPoints[sp].y;
        this.objects[t].targetAnim = this.switchPoints[sp].anim;
        this.objects[t].targetSp = this.switchPoints[sp].sp;
        this.objects[t].speed = this.switchPoints[sp].speed;
        this.objects[t].isTargeted = false;
        if (this.switchPoints[sp].sound) {
            this.switchPoints[sp].sound.play();
        }
    }

    this.launch = function () {
        this.time = 0;
    }

    this.isLaunched = function () {
        return this.time > -1;
    }
}