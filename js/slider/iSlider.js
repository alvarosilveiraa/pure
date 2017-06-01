class iSlider {
  constructor() {
    this._slider = $("pure-slider");
    this._tabs = this._slider.querySelector("tabs");
    this._slides = this._slider.querySelector("slides");
    this._total = this._slides.querySelectorAll("slide").length;
    this._width = this._getAttribute("width", "100%");
    this._height = this._getAttribute("height", "100vh");
    this._active = this._getAttribute("active", '0');
    this._timer = this._getAttribute("timer", "300");
    this._sensitivity = this._getAttribute("sensitivity", "25");
    this._orientation = this._getAttribute("orientation", "horizontal");

    if(this._tabs && this._total != this._tabs.querySelectorAll("tab").length)
      throw new Error("A quantidade de tabs e slides não batem!");
  }

  _getAttribute(name, value) {
    let attribute = this._slider.getAttribute(name);
    if(!attribute) {
      this._slider.setAttribute(name, value);
      return value;
    }else {
      return attribute;
    }
  }

  _setStyles() {
    this._slider.style.width = this._width;
    this._slider.style.height = this._height;
    if(this._orientation == "horizontal")
      this._slides.style.width = `${100 * this._total}%`;
    if(this._tabs) {
      this._height = `calc(${this._height} - ${this._tabs.clientHeight}px)`;
      this._tabs.querySelectorAll("tab").forEach(tab => {
        tab.style.width = `${100 / this._total}%`;
      })
      console.log(this._height);
    }
    this._slides.querySelectorAll("slide").forEach(slide => {
      slide.style.height = this._height;
    })
  }
}
