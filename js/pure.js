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
    var AutoComplete = (function () {
        function AutoComplete(options) {
            if (options === void 0) { options = {}; }
            this.main = pure.$("pure-autocomplete");
            this.input = this.main.querySelector("input");
            this.items = this.main.querySelector("items");
            this.max = options.max || 4;
            this.words = options.words || [];
        }
        AutoComplete.prototype.init = function () {
            var _this = this;
            this.input.addEventListener("keyup", function (e) {
                _this.removeItems();
                if (_this.input.value)
                    _this.setItems(_this.input.value.toLowerCase());
            });
            window.addEventListener("click", function (e) {
                _this.removeItems();
            });
        };
        AutoComplete.prototype.removeItems = function () {
            var items = this.items.querySelectorAll("item");
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
                    var item = document.createElement("item");
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
            var controller = eval(page.getAttribute("controller"));
            if (controller && typeof controller === "function")
                controller(page, params);
        };
        return Navigation;
    }());
    pure.Navigation = Navigation;
})(pure || (pure = {}));
