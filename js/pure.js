"use strict";
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
    var Refresher = (function () {
        function Refresher(options) {
            if (options === void 0) { options = {}; }
            this.main = pure.$("#pure-refresher");
            if (!this.main)
                throw new Error("Elemento nao encontrado!");
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
                this.main.innerHTML = "<div class='box'><div class='loader'></div></div>";
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
        Refresher.prototype.getBoxIcon = function () {
            var box = this.main.querySelector(".box"), icon = null;
            if (box && box.querySelector("i"))
                return box.querySelector("i");
            this.main.innerHTML = '';
            var element = document.createElement("div");
            element.classList.add("box");
            box = this.main.appendChild(element);
            icon = document.createElement("i");
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
        function Tabs(options) {
            if (options === void 0) { options = {}; }
            this.main = options.view ? options.view.querySelector(".pure-tabs") : pure.$(".pure-tabs");
            if (!this.main)
                throw new Error("Elemento não existe!");
            this.tabs = options.view ? options.view.querySelector(".pure-tabs_btn") : pure.$(".pure-tabs_btn");
            this.total = this.main.querySelectorAll("[tab]").length;
            this.active = options.active || 0;
            this.trayColor = options.trayColor || "#FFFFFF";
            this.threshold = options.threshold || 80;
            this.restraint = options.restraint || 100;
            this.allowedTime = options.allowedTime || 300;
            this.timer = options.timer || 200;
            this.direction = "none";
            this.startX = 0;
            this.startY = 0;
            this.timeout = 0;
            this.startTime = 0;
        }
        Tabs.prototype.init = function () {
            this.createTabs();
            this.createPages();
            this.createTray();
        };
        Tabs.prototype.onTouchStart = function (e) {
            this.startX = e.touches[0].pageX;
            this.startY = e.touches[0].pageY;
            this.startTime = new Date().getTime();
        };
        Tabs.prototype.onTouchMove = function (e) {
            var width = this.main.clientWidth;
            var pageX = e.touches[0].pageX;
            var pageY = e.touches[0].pageY;
            var distX = pageX - this.startX;
            var distY = pageY - this.startY;
            this.setDirection(distX, distY);
            var calc = this.active * width + (this.startX - pageX);
            var percentage = calc * 100 / width;
            this.setPan(percentage);
        };
        Tabs.prototype.onTouchEnd = function (e) {
            var elapsedTime = new Date().getTime() - this.startTime;
            if (this.isHorizontal() && elapsedTime <= this.allowedTime) {
                this.update();
            }
            else {
                this.setPan(100 * this.active);
            }
            this.setTransition();
            this.direction = "none";
        };
        Tabs.prototype.update = function () {
            this.setActive();
            this.setPan(100 * this.active);
            this.setTab();
        };
        Tabs.prototype.isHorizontal = function () {
            return this.direction == "left" || this.direction == "right";
        };
        Tabs.prototype.setDirection = function (distX, distY) {
            if (Math.abs(distX) >= this.threshold && Math.abs(distY) <= this.restraint) {
                this.direction = (distX < 0) ? 'left' : 'right';
            }
            else if (Math.abs(distY) >= this.threshold && Math.abs(distX) <= this.restraint) {
                this.direction = (distY < 0) ? 'up' : 'down';
            }
        };
        Tabs.prototype.setActive = function () {
            if (this.direction == "left" && this.active < this.total - 1)
                this.active++;
            else if (this.direction == "right" && this.active > 0)
                this.active--;
        };
        Tabs.prototype.setPan = function (percentage) {
            if (percentage >= 0 && percentage <= 100 * (this.total - 1)) {
                this.main.querySelector(".tabs").style.transform = "translateX(" + (percentage * -1) / this.total + "%)";
                var tray = this.tabs.querySelector(".tray");
                tray.style.left = percentage / this.total + "%";
            }
        };
        Tabs.prototype.setTab = function () {
            var tabs = this.tabs.querySelectorAll("[tab]");
            for (var i = 0; i < this.total; i++) {
                tabs[i].classList.remove("active");
            }
            tabs[this.active].classList.add("active");
        };
        Tabs.prototype.setTransition = function () {
            var tray = this.tabs.querySelector(".tray");
            var tabs = this.main.querySelector(".tabs");
            tray.style.transition = "left " + this.timer + "ms";
            tabs.style.transition = "transform " + this.timer + "ms";
            this.timeout = setTimeout(function () {
                tray.style.transition = '';
                tabs.style.transition = '';
            }, this.timer);
        };
        Tabs.prototype.createTabs = function () {
            var _this = this;
            var tabs = this.tabs.querySelectorAll("[tab]");
            var _loop_1 = function (i) {
                var tab = tabs[i];
                tab.style.width = 100 / this_1.total + "%";
                tab.addEventListener("click", function (e) {
                    _this.active = i;
                    _this.setTab();
                    _this.setPan(100 * i);
                    _this.setTransition();
                });
            };
            var this_1 = this;
            for (var i = 0; i < this.total; i++) {
                _loop_1(i);
            }
            tabs[this.active].classList.add("active");
        };
        Tabs.prototype.createPages = function () {
            var pages = this.main.querySelectorAll("[tab]");
            for (var i = 0; i < this.total; i++) {
                pages[i].style.width = 100 / this.total + "%";
            }
            this.main.querySelector(".tabs").style.width = 100 * this.total + "%";
            this.main.querySelector(".tabs").style.transform = "translateX(" + (-100 * this.active) / this.total + "%)";
        };
        Tabs.prototype.createTray = function () {
            var tray = document.createElement("div");
            tray.classList.add("tray");
            tray.style.width = 100 / this.total + "%";
            tray.style.left = this.active * (100 / this.total) + "%";
            tray.style.backgroundColor = this.trayColor;
            this.tabs.appendChild(tray);
        };
        return Tabs;
    }());
    pure.Tabs = Tabs;
})(pure || (pure = {}));
var pure;
(function (pure) {
    var Waves = (function () {
        function Waves(options) {
            if (options === void 0) { options = {}; }
            this.timer = options.timer || 800;
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
                if (getComputedStyle(element).position === "static")
                    element.style.position = "relative";
                var offset = element.getBoundingClientRect();
                var x = e.pageX - offset.left;
                var y = e.pageY - offset.top;
                var diameter = Math.min(offset.height, offset.width, 100);
                var container = document.createElement("div");
                container.classList.add("pure-waves");
                element.appendChild(container);
                var wave = document.createElement("div");
                wave.classList.add("wave");
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
var pure;
(function (pure) {
    var AutoComplete = (function () {
        function AutoComplete(options) {
            if (options === void 0) { options = {}; }
            if (!options.view)
                throw new Error("Necessario informar uma view");
            this.main = options.view.querySelector("[pure-autocomplete]");
            if (!this.main)
                throw new Error("Elemento nao encontrado!");
            this.input = this.main.querySelector("input");
            this.items = this.getItems();
            this.max = options.max || 4;
            this.classItem = options.classItem || '';
            this.words = options.words || [];
            this.startEvents();
        }
        AutoComplete.prototype.startEvents = function () {
            var _this = this;
            this.input.addEventListener("keyup", function (e) {
                _this.removeItems();
                if (e.keyCode != 13 && _this.input.value)
                    _this.setItems(_this.input.value.toLowerCase());
            });
            window.addEventListener("click", function (e) {
                _this.removeItems();
            });
        };
        AutoComplete.prototype.getItems = function () {
            var items = document.createElement("div");
            items.classList.add("items");
            this.main.appendChild(items);
            return items;
        };
        AutoComplete.prototype.removeItems = function () {
            var items = this.items.querySelectorAll("span");
            for (var i = 0; i < items.length; i++) {
                this.items.removeChild(items[i]);
            }
        };
        AutoComplete.prototype.setItems = function (search) {
            var _this = this;
            var filter = this.words.filter(function (word) {
                return new RegExp(search, 'i').test(word);
            });
            var _loop_2 = function (i) {
                if (filter[i]) {
                    var word_1 = filter[i].toLowerCase();
                    var item = document.createElement("span");
                    item.classList.add(this_2.classItem);
                    item.innerHTML = word_1.replace(search, "<b>" + search + "</b>");
                    item.addEventListener("click", function (e) {
                        e.stopPropagation();
                        _this.input.value = word_1;
                        _this.input.focus();
                        _this.removeItems();
                    });
                    this_2.items.appendChild(item);
                }
            };
            var this_2 = this;
            for (var i = 0; i < this.max; i++) {
                _loop_2(i);
            }
        };
        return AutoComplete;
    }());
    pure.AutoComplete = AutoComplete;
})(pure || (pure = {}));
var pure;
(function (pure) {
    var Navigation = (function () {
        function Navigation(options) {
            if (options === void 0) { options = {}; }
            this.main = pure.$("#pure-navigation");
            if (!this.main)
                throw new Error("Elemento nao encontrado!");
            this.pages = this.main.querySelectorAll("[page]");
            this.root = options.root;
            this.timer = options.timer || 300;
        }
        Navigation.prototype.init = function () {
            if (!this.main.getAttribute("platform"))
                this.main.setAttribute("platform", "android");
            if (!this.root && this.pages.length > 0)
                this.setRoot(this.pages[0].getAttribute("page"));
            else
                this.setRoot(this.root);
        };
        Navigation.prototype.setRoot = function (name, params) {
            if (params === void 0) { params = {}; }
            var root = this.getPageByName(name).cloneNode(true);
            root.classList.add("active");
            this.main.innerHTML = '';
            this.main.appendChild(root);
            this.startController(root, params);
        };
        Navigation.prototype.setPage = function (name, params) {
            if (params === void 0) { params = {}; }
            var page = this.getPageByName(name).cloneNode(true);
            var active = this.main.querySelector("[page].active:last-child");
            active.classList.add("behind");
            page.classList.add("animated");
            page.classList.add("active");
            this.main.appendChild(page);
            this.startController(page, params);
        };
        Navigation.prototype.pop = function () {
            var active = this.main.querySelector("[page].active:last-child");
            var behind = this.main.querySelectorAll("[page].behind");
            if (!active || !behind || this.isRoot())
                return;
            active.classList.remove("active");
            behind[behind.length - 1].classList.remove("behind");
            setTimeout(function () {
                this.main.removeChild(active);
            }.bind(this), this.timer);
        };
        Navigation.prototype.isRoot = function () {
            return this.main.querySelectorAll("[page]").length == 1;
        };
        Navigation.prototype.getPageByName = function (name) {
            for (var i = 0; i < this.pages.length; i++) {
                if (this.pages[i].getAttribute("page") == name)
                    return this.pages[i];
            }
            return document.createElement("div");
        };
        Navigation.prototype.startController = function (page, params) {
            var attr = page.getAttribute("controller");
            var controller = eval(attr);
            if (controller && typeof controller === "function") {
                new controller(page, params);
            }
        };
        return Navigation;
    }());
    pure.Navigation = Navigation;
})(pure || (pure = {}));
