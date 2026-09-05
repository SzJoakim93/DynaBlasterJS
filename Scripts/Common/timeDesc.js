function TimeDesc(callbackFunc, obj) {
    this.m = 0;
    this.s = 0;
    this.timeoutEvent = new TimeoutEvent(20, function(obj) { obj.decrease() }, this, true);
    this.timeoutEvent.launch();
    
    this.reset = function(m, s) {
        this.m = m;
        this.s = s;
    }

    this.decrease = function() {
        if (this.m <= 0 && this.s <= 0) {
            return;
        }
        
        this.s--;
        if (this.s < 0) {
            this.m--;
            this.s = 59;
        }

        if (this.m === 0 && this.s === 0) {
            if (obj) {
                callbackFunc(obj);
            } else {
                callbackFunc();
            }
        }
    }

    this.handleEvent = function() {
        this.timeoutEvent.handleEvent();
    }
}