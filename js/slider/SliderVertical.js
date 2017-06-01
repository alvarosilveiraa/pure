class SliderVertical extends iSlider {
  constructor() {
    super();
    this._isVertical = true;
  }

  init() {
    this._setDOM();
    let manager = new Hammer.Manager(this._slides);
    manager.add(new Hammer.Pan({threshold: 0, pointers: 0}));
    manager.on('panstart', e => {
      if(e.additionalEvent === 'panleft' || e.additionalEvent === 'panright')
        this._isVertical = false;
    })
    manager.on('panend', () => this._isVertical = true);
    manager.on("pan", e => {
      if(this._isVertical)
        this._onPan(e);
    })
  }

  _onPan(e) {
    let percentage = 100 / this._total * e.deltaY / (this._slides.clientHeight / this._total)
      , calculated = percentage - 100 / this._total * this._active
      , active = parseInt(-1 * calculated / (100 / this._total));

    if(this._slides.style.transition == '') {
      if(calculated < 5 && calculated > -80) {
        this._setTranslate(calculated, "translateY");
        if(e.isFinal) {
          if(active != this._active) {
            this._setPage(active);
          }else {
            if(e.velocityY > 1) {
              this._setPage(this._active - 1);
            }else if(e.velocityY < -1) {
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

  _setDOM() {
    this._slider.style.width = this._width;
    this._slider.style.height = this._height;
    this._slider.setAttribute("orientation", "vertical");
    if(this._tabs)
      this._tabs.style.display = "none";
    this._slides.style.height = this._height;
    this._slides.querySelectorAll("slide").forEach(slide => {
      slide.style.height = this._height;
    })
    this._setPage(this._active);
  }

  _setPage(active) {
    this._setActive(active);
    this._setTranslate(-(100 / this._total) * this._active, "translateY");
    clearTimeout(this._clearTransition());
  }
}
