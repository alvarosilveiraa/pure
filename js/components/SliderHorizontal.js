class SliderHorizontal extends iSlider {
  constructor(options) {
    super(options);
    this._count = this._active;
  }

  init() {
    let manager = new Hammer.Manager(this._content);
    manager.add(new Hammer.Pan({threshold: 0, pointers: 0}));
    manager.on("pan", e => {
      this._onPan(e);
    })
  }

  _onPan(e) {
    let percentage = 100 / this._total * e.deltaX / (this._content.clientWidth / this._total)
      , calculated = percentage - 100 / this._total * this._active;

    let a = (100 / this._total) * this._count * -1;
    let b = (100 / this._total) * (this._count - 1) * -1;

    if(calculated < 0 && calculated > -75) {
      if(calculated < a)
        this._count++;
      else if(calculated > b)
        this._count--;
    }

    console.log(a);
    console.log(this._count);
    console.log(calculated);

    if(calculated < 5 && calculated > -80) {
      this._content.style.transform = `translateX(${calculated}%)`;
      if(e.isFinal) {
        if(e.velocityX > 1) {
          this._setPage(this._active - 1);
        }else if(e.velocityX < -1) {
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
    this._content.style.transform = `translateX(${percentage}%)`;
    clearTimeout(this._clearTransition());
  }

  _clearTransition() {
    setTimeout(() => {
      this._content.style.transition = '';
    }, this._timer)
  }
}
