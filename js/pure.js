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
            var _loop_1 = function (i) {
                if (filter[i]) {
                    var word_1 = filter[i].toLowerCase();
                    var item = document.createElement("span");
                    item.classList.add(this_1.classItem);
                    item.innerHTML = word_1.replace(search, "<b>" + search + "</b>");
                    item.addEventListener("click", function (e) {
                        e.stopPropagation();
                        _this.input.value = word_1;
                        _this.input.focus();
                        _this.removeItems();
                    });
                    this_1.items.appendChild(item);
                }
            };
            var this_1 = this;
            for (var i = 0; i < this.max; i++) {
                _loop_1(i);
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
