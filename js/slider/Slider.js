class Slider extends iSlider {
  constructor() {
    super();
  }

  init() {
    this._setStyles();
    this._setPage(this._active);
    let manager = new Hammer.Manager(this._slides);
    manager.add(new Hammer.Pan({threshold: 0, pointers: 0}));
    manager.on("pan", e => {
      this._onPan(e);
    })
  }

  _onPan(e) {
    let orientationAttributes = this._getOrientationAttributes()
      , percentage = 100 / this._total * e[orientationAttributes.delta] / (this._slides[orientationAttributes.client] / this._total)
      , calculated = percentage - 100 / this._total * this._active
      , active = parseInt(-1 * calculated / (100 / this._total));

    if(this._slides.style.transition == '') {
      if(calculated < 5 && calculated > -80) {
        this._setTranslate(calculated);
        if(e.isFinal) {
          if(active != this._active) {
            this._setPage(active);
          }else {
            if(e[orientationAttributes.velocity] > 1) {
              this._setPage(this._active - 1);
            }else if(e[orientationAttributes.velocity] < -1) {
              this._setPage(this._active + 1);
            }else {
              if(percentage <= -(this._sensitivity / this._total))
                this._setPage(this._active + 1);
              else if(percentage >= this._sensitivity / this._total)
                this._setPage(this._active - 1);
              else
                this._setPage(this._active);
            }
          }
        }
      }else {
        if(e.isFinal) {
          this._setPage(active);
        }
      }
    }
  }

  _getOrientationAttributes() {
    return {
      letter: this._orientation == "horizontal"? 'X': 'Y',
      client: this._orientation == "horizontal"? "clientWidth":"clientHeight",
      delta: this._orientation == "horizontal"? "deltaX": "deltaY",
      velocity: this._orientation == "horizontal"? "velocityX": "velocityY",
      translate: this._orientation == "horizontal"? "translateX": "translateY"
    };
  }

  _setPage(active) {
    this._validateActive(active);
    this._setTranslate(-(100 / this._total) * this._active);
    clearTimeout(this._clearTransition());
  }

  _setTranslate(percentage) {
    let orientationAttributes = this._getOrientationAttributes();
    this._slides.style.transform = `${orientationAttributes.translate}(${percentage}%)`;
  }

  _validateActive(active) {
    if(active < 0)
      this._active = 0;
    else if(active > this._total - 1)
      this._active = this._total - 1;
    else
      this._active = active;
  }

  _clearTransition() {
    this._slides.style.transition = `transform ${this._timer}ms cubic-bezier(0.5, 0, 0.5, 1)`;
    setTimeout(() => {
      this._slides.style.transition = '';
    }, this._timer)
  }
}
