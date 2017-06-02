var Sync = (function () {
    function Sync(element, exec) {
        // this.onSync(exec);
        this.sync = $("pure-sync");
        this.scroller = element;
        this.min = -30;
        this.max = 80;
        this.timer = 300;
        this.transitionTimeout = 0;
    }
    Sync.prototype.init = function () {
        var _this = this;
        var manager = new Hammer.Manager(this.scroller, { touchAction: '' });
        manager.add(new Hammer.Pan({
            direction: Hammer.DIRECTION_VERTICAL
        }));
        manager.on("pan", function (e) {
            _this.onPan(e);
        });
    };
    Sync.prototype.onPan = function (e) {
        if (this.scroller.scrollTop == 0 && e.additionalEvent == "pandown" && (e.angle > 80 && e.angle < 100)) {
            this.scroller.style.touchAction = "pan-x";
            var percentage = 100 * e.deltaY / this.max - this.min;
            if (percentage <= 100)
                this.sync.style.top = this.range(percentage, this.min, this.max) + "px";
            else if (e.isFinal)
                this.close();
        }
        else {
            if (e.isFinal)
                this.close();
            else
                this.scroller.style.touchAction = '';
        }
    };
    Sync.prototype.onSync = function (exec) {
    };
    Sync.prototype.close = function () {
        this.scroller.style.touchAction = '';
        this.sync.style.top = this.min + "px";
        clearTimeout(this.transitionTimeout);
        this.setTransitionTimeout();
    };
    Sync.prototype.setTransitionTimeout = function () {
        var _this = this;
        this.sync.style.transition = "top " + this.timer + "ms ease";
        this.transitionTimeout = setTimeout(function () {
            _this.sync.style.transition = '';
        }, this.timer);
    };
    Sync.prototype.range = function (percent, min, max) {
        return (percent * (max - min) / 100) + min;
    };
    return Sync;
}());
var Tabs = (function () {
    function Tabs(slider) {
        this.tabs = slider.querySelector("tabs");
        if (!this.tabs)
            throw new Error("Nao existem tabs neste slider");
        this.total = this.tabs.querySelectorAll("tab").length;
        this.height = this.tabs.clientHeight;
        this.isFixed = this.tabs.getAttribute("no-fixed") ? false : true;
        this.trayHeight = parseInt(this.tabs.getAttribute("tray-height")) || 3;
        this.trayColor = this.tabs.getAttribute("tray-color") || "white";
        this.tray = this.getTray();
    }
    Tabs.prototype.setTabs = function (click) {
        var _this = this;
        this.tabs.querySelectorAll("tab").forEach(function (tab, i) {
            tab.addEventListener("click", function (e) { return click(i); });
            tab.style.width = 100 / _this.total + "%";
            tab.style.paddingBottom = _this.trayHeight + "px";
        });
        this.tabs.appendChild(this.tray);
    };
    Tabs.prototype.setTrayPosition = function (percentage) {
        this.tray.style.left = percentage + "%";
    };
    Tabs.prototype.getTray = function () {
        var tray = document.createElement("tray");
        if (this.isFixed)
            tray.style.width = 100 / this.total + "%";
        tray.style.height = this.trayHeight + "px";
        tray.style.backgroundColor = this.trayColor;
        return tray;
    };
    return Tabs;
}());
var SliderHorizontal = (function () {
    function SliderHorizontal(slider, tabs) {
        this.transitionTimeout = 0;
        this.slider = slider;
        this.slides = slider.querySelector("slides");
        this.tabs = tabs;
        this.total = this.slides.querySelectorAll("slide").length;
        this.active = parseInt(this.getSliderAttribute("active", '0'));
        this.width = parseInt(this.getSliderAttribute("width", '0'));
        this.height = parseInt(this.getSliderAttribute("height", '0'));
        this.timer = parseInt(this.getSliderAttribute("timer", "300"));
        this.sensitivity = parseInt(this.getSliderAttribute("sensitivity", "25"));
    }
    SliderHorizontal.prototype.init = function () {
        var _this = this;
        this.setStyles();
        if (this.tabs)
            this.tabs.setTabs(this.setPage.bind(this));
        var manager = new Hammer.Manager(this.slides);
        manager.add(new Hammer.Pan({
            direction: Hammer.DIRECTION_HORIZONTAL,
            threshold: 5,
            pointers: 0
        }));
        manager.on("panstart", function (e) {
            var angle = Math.abs(e.angle);
            if (angle >= 90 && angle < 150 ||
                angle > 30 && angle < 90)
                _this.scrolling = true;
            else
                _this.scrolling = false;
        });
        manager.on("panend", function (e) {
            _this.scrolling = false;
        });
        manager.on("pan", function (e) {
            if (!_this.scrolling)
                _this.onPan(e);
        });
    };
    SliderHorizontal.prototype.setPage = function (active) {
        this.normalizeActive(active);
        var percentage = -(100 / this.total) * this.active;
        this.setSlidesPosition(percentage);
        if (this.tabs)
            this.tabs.setTrayPosition(percentage * -1);
        clearTimeout(this.transitionTimeout);
        this.setTransitionTimeout();
    };
    SliderHorizontal.prototype.onPan = function (e) {
        var percentage = 100 / this.total * e.deltaX / (this.slides.clientWidth / this.total), calculated = percentage - 100 / this.total * this.active, active = Math.round(-1 * calculated / (100 / this.total));
        if (this.slides.style.transition == '') {
            if (calculated < 5 && calculated > -80) {
                this.setSlidesPosition(calculated);
                if (this.tabs)
                    this.tabs.setTrayPosition(calculated * -1);
                if (e.isFinal) {
                    if (active != this.active) {
                        this.setPage(active);
                    }
                    else {
                        if (e.velocityX > 1) {
                            this.setPage(this.active - 1);
                        }
                        else if (e.velocityX < -1) {
                            this.setPage(this.active + 1);
                        }
                        else {
                            if (percentage <= -(this.sensitivity / this.total))
                                this.setPage(this.active + 1);
                            else if (percentage >= this.sensitivity / this.total)
                                this.setPage(this.active - 1);
                            else
                                this.setPage(this.active);
                        }
                    }
                }
            }
            else {
                if (e.isFinal) {
                    this.setPage(active);
                }
            }
        }
    };
    SliderHorizontal.prototype.setStyles = function () {
        var _this = this;
        this.slider.style.width = this.numberToStyle(this.width, '%');
        this.slider.setAttribute("orientation", "horizontal");
        this.slides.style.width = 100 * this.total + "%";
        this.slides.querySelectorAll("slide").forEach(function (slide) {
            if (_this.tabs)
                slide.style.minHeight = "calc(" + _this.numberToStyle(_this.height, "vh") + " - " + _this.tabs.tabs.clientHeight + "px)";
            else
                slide.style.minHeight = _this.numberToStyle(_this.height, "vh");
        });
    };
    SliderHorizontal.prototype.setTransitionTimeout = function () {
        var _this = this;
        this.slides.style.transition = "transform " + this.timer + "ms cubic-bezier(0.5, 0, 0.5, 1)";
        if (this.tabs)
            this.tabs.tray.style.transition = "left " + this.timer + "ms ease";
        this.transitionTimeout = setTimeout(function () {
            _this.slides.style.transition = '';
            if (_this.tabs)
                _this.tabs.tray.style.transition = '';
        }, this.timer);
    };
    SliderHorizontal.prototype.setSlidesPosition = function (percentage) {
        this.slides.style.transform = "translateX(" + percentage + "%)";
    };
    SliderHorizontal.prototype.normalizeActive = function (active) {
        if (active < 0)
            this.active = 0;
        else if (active > this.total - 1)
            this.active = this.total - 1;
        else
            this.active = active;
    };
    SliderHorizontal.prototype.getSliderAttribute = function (name, value) {
        return this.slider.getAttribute(name) || value;
    };
    SliderHorizontal.prototype.numberToStyle = function (value, operation) {
        return value > 0 ? value + "px" : "100" + operation;
    };
    return SliderHorizontal;
}());
var Slider = (function () {
    function Slider() {
        this.slider = $("pure-slider");
        this.exec();
    }
    Slider.prototype.exec = function () {
        var sync = new Sync(document.body, null);
        sync.init();
        var tabs = null;
        try {
            tabs = new Tabs(this.slider);
        }
        catch (e) { }
        var horizontal = new SliderHorizontal(this.slider, tabs);
        horizontal.init();
    };
    return Slider;
}());
var $ = document.querySelector.bind(document);
window.onload = function () {
    new Slider();
};
