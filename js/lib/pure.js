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
var pure;
(function (pure) {
    pure.$ = document.querySelector.bind(document);
    pure.$all = document.querySelectorAll.bind(document);
})(pure || (pure = {}));
var pure;
(function (pure) {
    var Touch = (function () {
        function Touch() {
        }
        Touch.prototype.init = function (options) {
            if (options === void 0) { options = {}; }
            if (this.onStart && this.onMove && this.onEnd)
                this.destroy();
            this.element = options.element || window;
            this.onStart = options.onStart;
            this.onMove = options.onMove;
            this.onEnd = options.onEnd;
            this.element.addEventListener("touchstart", this.onStart);
            this.element.addEventListener("touchmove", this.onMove, { passive: false });
            this.element.addEventListener("touchend", this.onEnd);
        };
        Touch.prototype.destroy = function () {
            this.element.removeEventListener("touchstart", this.onStart);
            this.element.removeEventListener("touchmove", this.onMove, { passive: false });
            this.element.removeEventListener("touchend", this.onEnd);
        };
        return Touch;
    }());
    pure.Touch = Touch;
})(pure || (pure = {}));
var pure;
(function (pure) {
    var Header = (function () {
        function Header(page) {
            this.main = page.querySelector("pure-header");
        }
        Header.prototype.getHeight = function () {
            return this.main ? this.main.clientHeight : 0;
        };
        return Header;
    }());
    pure.Header = Header;
})(pure || (pure = {}));
var pure;
(function (pure) {
    var Menu = (function () {
        function Menu(options) {
            if (options === void 0) { options = {}; }
            this.main = pure.$("pure-menu");
            if (!this.main)
                throw new Error("Elemento não encontrado!");
            this.content = this.main.querySelector("content");
            this.overlay = this.main.querySelector("overlay");
            this.side = options.side || "left";
            this.timer = options.timer || 300;
        }
        Menu.prototype.init = function () {
            var _this = this;
            this.main.classList.add(this.side);
            this.main.style.display = "none";
            this.content.style.transition = "transform " + this.timer + "ms, left " + this.timer + "ms, right " + this.timer + "ms";
            this.overlay.style.transition = "opacity " + this.timer + "ms";
            this.overlay.onclick = function (e) { return _this.close(); };
        };
        Menu.prototype.open = function () {
            this.active = true;
            this.main.style.display = "block";
            setTimeout(function () {
                this.main.classList.add("open");
            }.bind(this), 10);
        };
        Menu.prototype.close = function () {
            if (this.active) {
                this.active = false;
                this.main.classList.remove("open");
                setTimeout(function () {
                    this.main.style.display = "none";
                }.bind(this), this.timer);
            }
        };
        return Menu;
    }());
    pure.Menu = Menu;
})(pure || (pure = {}));
var pure;
(function (pure) {
    var Navigation = (function () {
        function Navigation(options) {
            if (options === void 0) { options = {}; }
            this.main = pure.$("pure-navigation");
            this.pages = this.main.querySelectorAll("page");
            try {
                this.menu = new pure.Menu(options.menu);
            }
            catch (e) { }
            this.os = options.os || "android";
            this.root = options.root || "home";
            this.timer = options.timer || 300;
        }
        Navigation.prototype.init = function () {
            if (this.menu)
                this.menu.init();
            this.main.classList.add(this.os);
            this.setPage(this.root, true);
        };
        Navigation.prototype.setPage = function (name, isRoot) {
            if (isRoot === void 0) { isRoot = false; }
            var page = this.getPageByName(name);
            if (page) {
                if (this.menu && this.menu.active)
                    this.menu.close();
                var child_1 = this.getChild(page);
                if (isRoot) {
                    child_1.classList.add("active");
                    this.main.innerHTML = '';
                }
                this.main.appendChild(child_1);
                this.startController(child_1);
                this.onLoad(function () {
                    if (!isRoot) {
                        this.getPageContainsClass("active").page.classList.add("behind");
                        child_1.classList.add("active");
                    }
                    child_1.style.paddingTop = new pure.Header(child_1).getHeight() + "px";
                    new pure.Waves();
                }, 10);
            }
        };
        Navigation.prototype.pop = function () {
            var active = this.getPageContainsClass("active");
            var behind = this.getPageContainsClass("behind");
            if (!active || active.index == 0)
                return;
            behind.page.classList.remove("behind");
            active.page.classList.remove("active");
            this.startController(behind.page);
            this.onLoad(function () {
                this.main.removeChild(active.page);
            }, this.timer);
        };
        Navigation.prototype.isRoot = function () {
            return this.main.querySelectorAll("page").length == 1;
        };
        Navigation.prototype.onLoad = function (exec, timer) {
            setTimeout(exec.bind(this), timer);
        };
        Navigation.prototype.getPageByName = function (name) {
            for (var i = 0; i < this.pages.length; i++) {
                var page = this.pages[i];
                if (page.getAttribute("name") === name)
                    return page;
            }
            return null;
        };
        Navigation.prototype.getPageContainsClass = function (className) {
            var pages = this.main.querySelectorAll("page");
            for (var i = pages.length - 1; i >= 0; i--) {
                if (pages[i].classList.contains(className))
                    return { page: pages[i], index: i };
            }
            return null;
        };
        Navigation.prototype.getChild = function (page) {
            var child = document.createElement("page");
            child.setAttribute("style", page.getAttribute("style"));
            child.setAttribute("class", page.getAttribute("class"));
            child.setAttribute("name", page.getAttribute("name"));
            child.setAttribute("controller", page.getAttribute("controller"));
            child.innerHTML = page.innerHTML;
            return child;
        };
        Navigation.prototype.startController = function (page) {
            var controller = eval(page.getAttribute("controller"));
            if (controller && typeof controller === "function")
                controller(page);
        };
        return Navigation;
    }());
    pure.Navigation = Navigation;
})(pure || (pure = {}));
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
            this.main = options.view.querySelector("pure-refresher") || pure.$("pure-refresher");
            this.max = options.max || 80;
            this.threshold = options.threshold || 60;
            this.reload = options.reload || 50;
            this.timer = options.timer || 300;
            this.loader = options.loader || "circle";
            this.blockeds = options.blockeds || [];
            this.view = options.view || pure.$("body");
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
        // public init(): void {
        //   window.addEventListener("touchstart", this.onTouchStart.bind(this));
        //   window.addEventListener("touchmove", this.onTouchMove.bind(this), <any>{passive: false});
        //   window.addEventListener("touchend", this.onTouchEnd.bind(this));
        // }
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
                    if (_this.enable && pure.$(blocked).contains(e.target))
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
                this.main.classList.add("pull");
                this.state = "pulling";
                this.update();
            }
            if (this.startY && this.moveY)
                this.distance = this.moveY - this.startY;
            if (this.distance > 0) {
                e.preventDefault();
                this.main.style["min-height"] = this.resisted + "px";
                this.resisted = this.getResistance() * Math.min(this.max, this.distance);
                if (this.state === "pulling" && this.resisted > this.threshold) {
                    this.main.classList.add("release");
                    this.state = "releasing";
                    this.update();
                }
                if (this.state === "releasing" && this.resisted < this.threshold) {
                    this.main.classList.remove("release");
                    this.state = "pulling";
                    this.update();
                }
            }
        };
        Refresher.prototype.onTouchEnd = function () {
            if (this.state === "releasing" && this.resisted > this.threshold) {
                this.state = "refreshing";
                this.main.style["min-height"] = this.reload + "px";
                this.main.classList.add("refresh");
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
                this.main.style["min-height"] = "0px";
            }
            this.update();
            this.main.classList.remove("pull");
            this.main.classList.remove("release");
            this.startY = this.moveY = 0;
            this.distance = this.resisted = 0;
        };
        Refresher.prototype.onReset = function () {
            this.state = "pending";
            this.main.style["min-height"] = "0px";
            this.main.classList.remove("refresh");
        };
        Refresher.prototype.update = function () {
            if (this.state === "refreshing") {
                this.main.innerHTML = "<box><loader></loader></box>";
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
            var box = this.main.querySelector("box"), icon = null;
            if (box && box.querySelector("icon"))
                return box.querySelector("icon");
            this.main.innerHTML = '';
            box = this.main.appendChild(document.createElement("box"));
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
            this.tray.style.left = percent + '%';
        };
        Tabs.prototype.setTimeout = function (timer) {
            var _this = this;
            this.tray.style.transition = "left " + timer + "ms";
            this.timeout = setTimeout(function () {
                _this.tray.style.transition = '';
            }, timer);
        };
        Tabs.prototype.setStyles = function (click) {
            var _this = this;
            this.tray = document.createElement("tray");
            this.tray.style.width = 100 / this.length + "%";
            this.tray.style.height = "3px";
            this.tray.style.backgroundColor = "black";
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
            this.slider = options.slider || pure.$("pure-slider");
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
            var manager = new pure.Hammer.Manager(this.slides.element);
            manager.add(new pure.Hammer.Pan({
                direction: pure.Hammer.DIRECTION_HORIZONTAL
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
                    this.tabs.setPosition(-1 * calculated);
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
            this.normalizeActive(active, this.total);
            var percent = -(100 / this.total) * this.active;
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
var pure;
(function (pure) {
    var Waves = (function () {
        function Waves() {
            this.timer = 800;
            var waves = pure.$all("[pure-waves]");
            for (var i = 0; i < waves.length; i++) {
                var element = waves[i];
                element.addEventListener("click", this.click(element));
                element.removeAttribute("pure-waves");
            }
        }
        Waves.prototype.click = function (element) {
            var _this = this;
            return function (e) {
                //disabled return;
                if (!element.style.position || element.style.position === "static")
                    element.style.position = "relative";
                var offset = element.getBoundingClientRect();
                var x = e.pageX - offset.left;
                var y = e.pageY - offset.top;
                var diameter = Math.min(offset.height, offset.width, 100);
                var container = document.createElement("div");
                container.setAttribute("class", "wave-container");
                element.appendChild(container);
                var wave = document.createElement("div");
                wave.setAttribute("class", "wave");
                wave.style.animation = "wave " + _this.timer + "ms forwards";
                wave.style.backgroundColor = _this.getAttribute(element.getAttribute("wave-color"));
                wave.style.width = diameter + "px";
                wave.style.height = diameter + "px";
                wave.style.top = y - (diameter / 2) + "px";
                wave.style.left = x - (diameter / 2) + "px";
                container.appendChild(wave);
                setTimeout(function () {
                    element.removeChild(container);
                }, _this.timer);
            };
        };
        Waves.prototype.getAttribute = function (attribute) {
            return attribute || "#FFFFFF";
        };
        return Waves;
    }());
    pure.Waves = Waves;
})(pure || (pure = {}));
