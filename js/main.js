var Refresher = (function () {
    function Refresher(refresher, options) {
        if (options === void 0) { options = {}; }
        this.refresher = refresher;
        this.body = $("body");
        this.state = "pending";
        this.max = options.max || 80;
        this.threshold = options.threshold || 60;
        this.reload = options.reload || 50;
        this.timer = options.timer || 300;
        this.distance = 0;
        this.resisted = 0;
        this.timeout = 0;
        this.startY = 0;
        this.moveY = 0;
        this.enable = false;
        this.text = options.text || {};
        this.arrow = options.arrow || true;
        this.animation = options.animation || "circle";
        this.blockeds = options.blockeds || [];
    }
    Refresher.prototype.init = function (onRefresh) {
        this.onRefresh = onRefresh.bind(this);
        window.addEventListener("touchend", this.onTouchEnd.bind(this));
        window.addEventListener("touchstart", this.onTouchStart.bind(this));
        window.addEventListener("touchmove", this.onTouchMove.bind(this), { passive: false });
    };
    Refresher.prototype.onTouchEnd = function () {
        if (this.state === "releasing" && this.resisted > this.threshold) {
            this.state = "refreshing";
            this.refresher.style["min-height"] = this.reload + "px";
            this.refresher.classList.add("refresh");
            this.timeout = setTimeout(function () {
                var retval = this.onRefresh(this.onReset.bind(this));
                if (!retval && !this.onRefresh.length)
                    this.onReset();
            }.bind(this), this.timer);
        }
        else {
            if (this.state === "refreshing")
                return;
            this.state = "pending";
            this.refresher.style["min-height"] = "0px";
        }
        this.update();
        this.refresher.classList.remove("pull");
        this.refresher.classList.remove("release");
        this.startY = this.moveY = 0;
        this.distance = this.resisted = 0;
    };
    Refresher.prototype.onTouchStart = function (e) {
        var _this = this;
        if (!window.scrollY)
            this.startY = e.touches[0].screenY;
        if (this.state !== "pending")
            return;
        clearTimeout(this.timeout);
        this.state = "pending";
        this.enable = this.body.contains(e.target);
        if (this.blockeds.length > 0) {
            this.blockeds.forEach(function (blocked) {
                if (_this.enable && $(blocked).contains(e.target))
                    _this.enable = false;
            });
        }
        this.update();
    };
    Refresher.prototype.onTouchMove = function (e) {
        if (!this.startY) {
            if (!window.scrollY)
                this.startY = e.touches[0].screenY;
        }
        else {
            this.moveY = e.touches[0].screenY;
        }
        if (!this.enable || this.state === "refreshing") {
            if (!window.scrollY && this.startY < this.moveY) {
                e.preventDefault();
            }
            return;
        }
        if (this.state === "pending") {
            this.refresher.classList.add("pull");
            this.state = "pulling";
            this.update();
        }
        if (this.startY && this.moveY)
            this.distance = this.moveY - this.startY;
        if (this.distance > 0) {
            e.preventDefault();
            this.refresher.style["min-height"] = this.resisted + "px";
            this.resisted = this.getResistance() * Math.min(this.max, this.distance);
            if (this.state === "pulling" && this.resisted > this.threshold) {
                this.refresher.classList.add("release");
                this.state = "releasing";
                this.update();
            }
            if (this.state === "releasing" && this.resisted < this.threshold) {
                this.refresher.classList.remove("release");
                this.state = "pulling";
                this.update();
            }
        }
    };
    Refresher.prototype.onReset = function () {
        this.state = "pending";
        this.refresher.style["min-height"] = "0px";
        this.refresher.classList.remove("refresh");
    };
    Refresher.prototype.update = function () {
        if (this.state === "refreshing") {
            this.refresher.innerHTML = "\n        <loader></loader>\n      ";
        }
        else if (this.state === "releasing") {
            this.refresher.innerHTML = "\n        <icon></icon>\n        <text>" + (this.text.release || '') + "</text>\n      ";
        }
        else if (this.state === "pending" || this.state === "pulling") {
            this.refresher.innerHTML = "\n        </icon></icon>\n        <text>" + (this.text.pull || '') + "</text>\n      ";
        }
    };
    Refresher.prototype.destroy = function () {
        window.removeEventListener("touchstart", this.onTouchStart.bind(this));
        window.removeEventListener("touchend", this.onTouchEnd.bind(this));
        window.removeEventListener("touchmove", this.onTouchMove.bind(this));
    };
    Refresher.prototype.getResistance = function () {
        return Math.min(1, (this.distance / this.threshold) / 2.5);
    };
    return Refresher;
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
        if (tabs)
            this.tabs.setTabs(this.setPage.bind(this));
        this.setStyles();
    }
    SliderHorizontal.prototype.init = function () {
        var _this = this;
        var manager = new Hammer.Manager(this.slides);
        manager.add(new Hammer.Pan({
            direction: Hammer.DIRECTION_HORIZONTAL,
            threshold: 0,
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
var $ = document.querySelector.bind(document);
window.onload = function () {
    var refresher = new Refresher($("pure-refresher"), {
        text: {
            pull: "Pull",
            release: "Release"
        },
        animation: "circle",
        arrow: true
    });
    refresher.init(function (done) { setTimeout(function () { done(); }, 1000); });
    var tabs = null, slider = $("pure-slider");
    try {
        tabs = new Tabs(slider);
    }
    catch (e) { }
    var horizontal = new SliderHorizontal(slider, tabs);
    horizontal.init();
};
function range(percent, min, max) {
    return (percent * (max - min) / 100) + min;
}
