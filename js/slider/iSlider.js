class iSlider {
  constructor() {
    this._slider = $("pure-slider");
    this._tabs = this._slider.querySelector("tabs");
    this._slides = this._slider.querySelector("slides");
    this._total = this._slides.querySelectorAll("slide").length;
    this._width = this._getAttribute("width", "100%");
    this._height = this._getAttribute("height", "100vh");
    this._active = parseInt(this._getAttribute("active", '0'));
    this._timer = parseInt(this._getAttribute("timer", "300"));
    this._sensitivity = parseInt(this._getAttribute("sensitivity", "25"));

    if(this._tabs && this._total != this._tabs.querySelectorAll("tab").length)
      throw new Error("A quantidade de tabs e slides não batem!");
  }

  init() {
    throw new Error("Este metodos precisa ser implementado");
  }

  _onPan() {
    throw new Error("Este metodos precisa ser implementado");
  }

  _setDOM() {
    throw new Error("Este metodos precisa ser implementado");
  }

  _setPage() {
    throw new Error("Este metodos precisa ser implementado");
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

  _setActive(active) {
    if(active < 0)
      this._active = 0;
    else if(active > this._total - 1)
      this._active = this._total - 1;
    else
      this._active = active;
  }

  _setTranslate(percentage, translate) {
    this._slides.style.transform = `${translate}(${percentage}%)`;
    if(this._tabs) this._tabs.querySelector("tray").style.left = `${percentage * -1}%`;
  }

  _clearTransition() {
    this._slides.style.transition = `transform ${this._timer}ms cubic-bezier(0.5, 0, 0.5, 1)`;
    let tray = null;
    if(this._tabs)  {
      tray = this._tabs.querySelector("tray");
      tray.style.transition = `left ${this._timer}ms ease`;
    }
    setTimeout(() => {
      this._slides.style.transition = '';
      if(tray) tray.style.transition = '';
    }, this._timer)
  }
}
