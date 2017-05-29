class SliderVertical extends iSlider {
  constructor(options) {
    super(options);
  }

  init() {
    let manager = new Hammer.Manager(this._content);
    manager.add(new Hammer.Pan({threshold: 0, pointers: 0}));
    manager.on("pan", e => {
      this._onPan(e);
    })
  }

  _onPan(e) {
    let percentage = 100 / this._total * e.deltaY / (this._content.clientHeight / this._total)
      , calculated = percentage - 100 / this._total * this._active;

    if(calculated < 5 && calculated > -80) {
      this._content.style.transform = `translateY(${calculated}%)`;
      if(e.isFinal) {
        if(e.velocityY > 1) {
          this._setPage(this._active - 1);
        }else if(e.velocityY < -1) {
          this._setPage(this._active + 1);
        }else {
          if(percentage <= - (this._sensitivity / this._total))
            this._setPage(this._active + 1);
          else if(percentage >= this._sensitivity / this._total)
            this._setPage(this._active - 1);
          else
            this._setPage(this._active);
        }
      }
    }else {
      if(e.isFinal)
        this._setPage(this._active);
    }
  }

  _setPage(n) {
    if(n < 0)
      this._active = 0;
    else if(n > this._total - 1)
      this._active = this._total - 1;
    else
      this._active = n;

    this._content.style.transition = `transform ${this._timer}ms cubic-bezier(0.5, 0, 0.5, 1)`;
    let percentage = - (100 / this._total) * this._active;
    this._content.style.transform = `translateY(${percentage}%)`;
    clearTimeout(this._clearTransition());
  }

  _clearTransition() {
    setTimeout(() => {
      this._content.style.transition = '';
    }, this._timer)
  }
}
