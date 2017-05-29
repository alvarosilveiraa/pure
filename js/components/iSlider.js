class iSlider {
  constructor(options) {

    /****************************** ATTRIBUTES **********************************/

    this._width = options.width;
    this._height = options.width;
    this._active = options.active;
    this._total = options.total;
    this._timer = options.timer;
    this._content = options.content;
    this._sensitivity = options.sensitivity;

    /****************************** METODOS ************************************/

    if(this.init === undefined)
      throw new Error("O médoto 'init' precisa ser implementado");

    if(this._onPan === undefined)
      throw new Error("O médoto '_onPan' precisa ser implementado");

    if(this._setPage === undefined)
      throw new Error("O médoto '_setPage' precisa ser implementado");

    if(this._clearTransition === undefined)
      throw new Error("O médoto '_clearTransition' precisa ser implementado");
  }
}
