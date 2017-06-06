"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/***
  options = {
    onRefresh: any,
    refresher: any,
    max: number,
    threshold: number,
    reload: number,
    timer: number,
    loader: string,
    blockeds: Array<string>
  }
***/
var pure;
(function (pure) {
    var Refresher = (function () {
        function Refresher(options) {
            if (options === void 0) { options = {}; }
            this.refresher = options.refresher || $("pure-refresher");
            this.max = options.max || 80;
            this.threshold = options.threshold || 60;
            this.reload = options.reload || 50;
            this.timer = options.timer || 300;
            this.loader = options.loader || "circle";
            this.blockeds = options.blockeds || [];
            this.view = $(options.view) || $("body");
            this.state = "pending";
            this.distance = 0;
            this.resisted = 0;
            this.startY = 0;
            this.moveY = 0;
            this.enable = false;
            this.onRefresh = options.onRefresh ?
                options.onRefresh.bind(this) :
                function (done) { return done(); };
        }
        Refresher.prototype.init = function () {
            window.addEventListener("touchstart", this.onTouchStart.bind(this));
            window.addEventListener("touchmove", this.onTouchMove.bind(this), { passive: false });
            window.addEventListener("touchend", this.onTouchEnd.bind(this));
        };
        Refresher.prototype.onTouchStart = function (e) {
            var _this = this;
            if (!this.view.scrollTop)
                this.startY = e.touches[0].screenY;
            if (this.state !== "pending")
                return;
            clearTimeout(this.timeout);
            this.state = "pending";
            this.enable = this.view.contains(e.target);
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
                if (!this.view.scrollTop)
                    this.startY = e.touches[0].screenY;
            }
            else {
                this.moveY = e.touches[0].screenY;
            }
            if (!this.enable || this.state === "refreshing") {
                if (!this.view.scrollTop && this.startY < this.moveY) {
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
        Refresher.prototype.onReset = function () {
            this.state = "pending";
            this.refresher.style["min-height"] = "0px";
            this.refresher.classList.remove("refresh");
        };
        Refresher.prototype.update = function () {
            if (this.state === "refreshing") {
                this.refresher.innerHTML = "<box><loader></loader></box>";
            }
            else {
                var icon = this.getBoxIcon();
                if (this.state === "releasing") {
                    icon.setAttribute("class", "up");
                }
                else if (this.state === "pending" || this.state === "pulling") {
                    icon.setAttribute("class", "down");
                }
            }
        };
        Refresher.prototype.destroy = function () {
            window.removeEventListener("touchstart", this.onTouchStart.bind(this));
            window.removeEventListener("touchmove", this.onTouchMove.bind(this));
            window.removeEventListener("touchend", this.onTouchEnd.bind(this));
        };
        Refresher.prototype.getBoxIcon = function () {
            var box = this.refresher.querySelector("box"), icon = null;
            if (box && box.querySelector("icon"))
                return box.querySelector("icon");
            this.refresher.innerHTML = '';
            box = this.refresher.appendChild(document.createElement("box"));
            icon = document.createElement("icon");
            box.appendChild(icon);
            return icon;
        };
        Refresher.prototype.getResistance = function () {
            return Math.min(1, (this.distance / this.threshold) / 2.5);
        };
        return Refresher;
    }());
    pure.Refresher = Refresher;
})(pure || (pure = {}));
var pure;
(function (pure) {
    var Tabs = (function () {
        function Tabs(slider) {
            this.element = slider.querySelector("tabs");
            this.timeout = 0;
            if (this.element) {
                this.exists = true;
                this.length = this.element.querySelectorAll("tab").length;
            }
            else {
                this.exists = false;
                this.length = 0;
            }
        }
        Tabs.prototype.setPosition = function (percent) {
            this.tray.style.left = percent + "%";
        };
        Tabs.prototype.setTimeout = function (timer) {
            var _this = this;
            this.element.style.transition = "transform " + timer + "ms cubic-bezier(0.5, 0, 0.5, 1)";
            this.timeout = setTimeout(function () {
                _this.element.style.transition = '';
            }, timer);
        };
        Tabs.prototype.setStyles = function (click) {
            var _this = this;
            this.tray = document.createElement("tray");
            this.tray.style.width = 100 / this.length + "%";
            this.tray.style.height = "3px";
            this.tray.style.backgroundColor = "white";
            this.element.querySelectorAll("tab").forEach(function (tab, i) {
                tab.addEventListener("click", function (e) { return click(i); });
                tab.style.width = 100 / _this.length + "%";
                tab.style.paddingBottom = "3px";
            });
            this.element.appendChild(this.tray);
        };
        return Tabs;
    }());
    var Slides = (function () {
        function Slides(slider) {
            this.element = slider.querySelector("slides");
            this.timeout = 0;
            if (this.element) {
                this.exists = true;
                this.length = this.element.querySelectorAll("slide").length;
            }
            else {
                this.exists = false;
                this.length = 0;
            }
        }
        Slides.prototype.setPosition = function (percent) {
            this.element.style.transform = "translateX(" + percent + "%)";
        };
        Slides.prototype.setTimeout = function (timer) {
            var _this = this;
            this.element.style.transition = "transform " + timer + "ms cubic-bezier(0.5, 0, 0.5, 1)";
            this.timeout = setTimeout(function () {
                _this.element.style.transition = '';
            }, timer);
        };
        Slides.prototype.setStyles = function (height) {
            if (this.exists) {
                this.element.style.width = 100 * this.length + "%";
                this.element.querySelectorAll("slide").forEach(function (slide) {
                    slide.style.minHeight = height;
                });
            }
        };
        return Slides;
    }());
    var Slider = (function () {
        function Slider(options) {
            if (options === void 0) { options = {}; }
            this.scrolling = false;
            this.slider = options.slider || $("pure-slider");
            this.active = options.active || 0;
            this.width = options.active || 0;
            this.height = options.height || 0;
            this.timer = options.timer || 300;
            this.sensitivity = options.sensitivity || 25;
        }
        Slider.prototype.setScrolling = function (angle) {
            angle >= 90 && angle < 150 || angle > 30 && angle < 90 ?
                this.scrolling = true :
                this.scrolling = false;
        };
        Slider.prototype.normalizeActive = function (active, total) {
            if (active < 0)
                this.active = 0;
            else if (active > total - 1)
                this.active = total - 1;
            else
                this.active = active;
        };
        Slider.prototype.numberToStyle = function (value, operation) {
            return value > 0 ? value + "px" : "100" + operation;
        };
        return Slider;
    }());
    var SliderHorizontal = (function (_super) {
        __extends(SliderHorizontal, _super);
        function SliderHorizontal(options) {
            var _this = _super.call(this, options) || this;
            _this.tabs = new Tabs(_this.slider);
            _this.slides = new Slides(_this.slider);
            _this.total = _this.getTotal();
            return _this;
        }
        SliderHorizontal.prototype.init = function () {
            var _this = this;
            this.setStyles();
            var manager = new Hammer.Manager(this.slides.element);
            manager.add(new Hammer.Pan({
                direction: Hammer.DIRECTION_HORIZONTAL
            }));
            manager.on("panstart", function (e) {
                _this.setScrolling(Math.abs(e.angle));
            });
            manager.on("panend", function (e) {
                _this.scrolling = false;
            });
            manager.on("pan", function (e) {
                _this.onPan(e);
            });
        };
        SliderHorizontal.prototype.onPan = function (e) {
            if (!this.scrolling) {
                var percentage = 100 / this.total * e.deltaX / (this.slides.element.clientWidth / this.total), calculated = percentage - 100 / this.total * this.active, active = Math.round(-1 * calculated / (100 / this.total));
                if (calculated < 5 && calculated > -80) {
                    this.slides.setPosition(calculated);
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
            this.slider.setAttribute("orientation", "horizontal");
            this.slider.style.width = this.numberToStyle(this.width, '%');
            this.tabs.setStyles(this.setPage.bind(this));
            this.slides.setStyles(this.numberToStyle(this.height, "vh"));
        };
        SliderHorizontal.prototype.setPage = function (active) {
            var percent = -(100 / this.total) * this.active;
            this.normalizeActive(active, this.total);
            this.tabs.setPosition(-1 * percent);
            this.slides.setPosition(percent);
            clearTimeout(this.tabs.timeout);
            clearTimeout(this.slides.timeout);
            this.tabs.setTimeout(this.timer);
            this.slides.setTimeout(this.timer);
        };
        SliderHorizontal.prototype.getTotal = function () {
            return this.slides.length;
        };
        return SliderHorizontal;
    }(Slider));
    pure.SliderHorizontal = SliderHorizontal;
})(pure || (pure = {}));
var $ = document.querySelector.bind(document);
var pure;
(function (pure) {
    var Main = (function () {
        function Main(components) {
            if (components === void 0) { components = {}; }
            [
                {
                    name: "refresher",
                    component: pure.Refresher
                },
                {
                    name: "sliderHorizontal",
                    component: pure.SliderHorizontal
                }
            ].forEach(function (item) {
                var component = components[item.name];
                if (component)
                    new item.component(component).init();
            });
        }
        return Main;
    }());
    pure.Main = Main;
})(pure || (pure = {}));
window.onload = function () {
    new pure.Main({
        refresher: { view: "page" },
        sliderHorizontal: {}
    });
};
