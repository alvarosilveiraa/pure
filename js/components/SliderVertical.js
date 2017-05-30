class SliderVertical extends iSlider {
  constructor(options) {
    super(options);
  }

  _onPan(e) {
    let percentage = 100 / this._total * e.deltaY / (this._content.clientHeight / this._total)
      , calculated = percentage - 100 / this._total * this._active
      , limit = (100 / this._total) * this._count * -1;

    this._setCount(calculated, limit);
    if(calculated < 5 && calculated > -80) {
      this._content.style.transform = `translateY(${calculated}%)`;
      if(e.isFinal) {
        if(this._count != this._active) {
          this._setPage(this._count);
        }else {
          if(e.velocityY > 1)
            this._setPage(this._active - 1);
          else if(e.velocityY < -1)
            this._setPage(this._active + 1);
          else {
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
        if(this._count != this._active)
          this._setPage(this._count);
        else
          this._setPage(this._active);
      }
    }
  }

  _setTranslate() {
    this._content.style.transform = `translateY(${this._getPercentage()}%)`;
  }
}
