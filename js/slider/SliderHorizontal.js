class SliderHorizontal extends iSlider {
  constructor() {
    super();
    this._isHorizontal = true;
  }

  init() {
    this._setDOM();
    let manager = new Hammer.Manager(this._slides);
    manager.add(new Hammer.Pan({threshold: 0, pointers: 0}));
    manager.on('panstart', e => {
      if(e.additionalEvent === 'panup' || e.additionalEvent === 'pandown')
        this._isHorizontal = false;
    })
    manager.on('panend', () => this._isHorizontal = true);
    manager.on("pan", e => {
      if(this._isHorizontal)
        this._onPan(e);
    })
  }

  _onPan(e) {
    let percentage = 100 / this._total * e.deltaX / (this._slides.clientWidth / this._total)
      , calculated = percentage - 100 / this._total * this._active
      , active = parseInt(-1 * calculated / (100 / this._total));

    if(this._slides.style.transition == '') {
      if(calculated < 5 && calculated > -80) {
        this._setTranslate(calculated, "translateX");
        if(e.isFinal) {
          if(active != this._active) {
            if(percentage <= -(this._sensitivity / this._total))
              this._setPage(active + 1);
            else
              this._setPage(active);
          }else {
            if(e.velocityX > 1) {
              this._setPage(this._active - 1);
            }else if(e.velocityX < -1) {
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
    this._slider.setAttribute("orientation", "horizontal");
    if(this._tabs) {
      let fixedTabs = this._tabs.getAttribute("fixed") == "true" || false
        , trayColor = this._tabs.getAttribute("tray-color") || "white"
        , trayHeight = this._tabs.getAttribute("tray-height") || "2px";

      this._height = `calc(${this._height} - ${this._tabs.clientHeight}px)`;
      this._tabs.querySelectorAll("tab").forEach((tab, i) => {
        tab.addEventListener("click", e => {
          this._setPage(i);
        })
        tab.style.width = `${100 / this._total}%`;
        tab.style.paddingBottom = trayHeight;
      })
      let tray = document.createElement("tray");
      tray.style.width = `${100 / this._total}%`;
      tray.style.height = trayHeight;
      tray.style.backgroundColor = trayColor;
      this._tabs.appendChild(tray);
    }
    this._slides.style.width = `${100 * this._total}%`;
    this._slides.querySelectorAll("slide").forEach(slide => {
      slide.style.minHeight = this._height;
    })
    this._setPage(this._active);
  }

  _setPage(active) {
    this._setActive(active);
    let percentage = -(100 / this._total) * this._active;
    this._setTranslate(percentage, "translateX");
    clearTimeout(this._clearTransition());
  }
}
