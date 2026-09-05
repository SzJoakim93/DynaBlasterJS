var FONT_BASED = 0;
var IMAGE_BASED = 1;

function Menu(img, pointerImg, type, x, y, spacingX, spacingY) {

    this.menuPoints = [];
    this.selectTimeOut = new TimeoutEvent(50, function(obj) {
        var menuPoint = obj.menuPoints[obj.selected];
        if (menuPoint.context) {
            menuPoint.select.call(menuPoint.context);
        } else {
            menuPoint.select();
        }
    }, this);

    this.selected = 0;
    this.spacingX = spacingX;
    this.spacingY = spacingY;

    this.addMenuPointText = function(text, select, context) {
        this.menuPoints.push({ text: text, select: select, context: context });
    }

    this.addMenuPointImage = function(index, select, context) {
        this.menuPoints.push({ index: index, select: select, context: context });
    }

    this.handleEvents = function() {
        this.selectTimeOut.handleEvent();
    }

    this.rendering = function() {
        ctx.drawImage(pointerImg, x, y + this.selected * this.spacingY);

        for (var i = 0; i < this.menuPoints.length; i++) {
            if (i !== this.selected || !this.selectTimeOut.isLaunched() || Math.floor(this.selectTimeOut.currentTime / 5) % 2 === 1) {
                this.drawMenuPoint(x + this.spacingX, y + i * this.spacingY, this.menuPoints[i]);
            }
        }
    }

    this.select = function() {
        this.selectTimeOut.launch();
    }

    this.selectPrev = function() {
        this.selected--;
        if (this.selected < 0) {
            this.selected = this.menuPoints.length - 1;
        }
    }

    this.selectNext = function() {
        this.selected++;
        if (this.selected > this.menuPoints.length - 1) {
            this.selected = 0;
        }
    }

    this.drawFont = function(x, y, menupoint) {
        img.apply(menupoint.text, x, y);
    }

    this.drawImage = function(x, y, menupoint) {
        img.apply(x, y, menupoint.index);
    }

    this.drawMenuPoint = (type === FONT_BASED ? this.drawFont : this.drawImage);
}