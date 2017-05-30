class iSlider {
  constructor(options) {

    /****************************** ATTRIBUTES **********************************/

    this._width = options.width;
    this._height = options.width;
    this._active = options.active;
    this._count = options.active;
    this._total = options.total;
    this._timer = options.timer;
    this._content = options.content;
    this._sensitivity = options.sensitivity;

    /****************************** METODOS ************************************/

    if(this._onPan === undefined)
      throw new Error("O médoto '_onPan' precisa ser implementado");

    if(this._setTranslate === undefined)
      throw new Error("O médoto '_setTranslate' precisa ser implementado");
  }

  init() {
    this._setPage(this._active);
    let manager = new Hammer.Manager(this._content);
    manager.add(new Hammer.Pan({threshold: 0, pointers: 0}));
    manager.on("pan", e => {
      this._onPan(e);
    })
  }

  _getPercentage() {
    return -(100 / this._total) * this._active;
  }

  _setPage(active) {
    this._validateActive(active);
    this._setTranslate();
    clearTimeout(this._clearTransition());
  }

  _setCount(calculated, limit) {
    if(calculated < 1 && calculated > -75) {
      if(calculated < limit)
        this._count++;
      else if(calculated > limit)
        this._count--;
    }
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
    this._content.style.transition = `transform ${this._timer}ms cubic-bezier(0.5, 0, 0.5, 1)`;
    setTimeout(() => {
      this._content.style.transition = '';
    }, this._timer)
  }
}
