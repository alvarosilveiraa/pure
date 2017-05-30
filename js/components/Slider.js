class Slider {
  constructor() {
    this._width = "100%";
    this._height = "300px";
    this._content = null;
    this._slider = $("pure-slider");
    this._slides = $all("pure-slider slide");
  }

  init() {
    let slider = null
      , options = {
      active: this._getActive(),
      total: this._slides.length,
      timer: 300,
      sensitivity: 25
    };

    this._setContent();
    options.content = this._content;
    if(this._getOrientation() == "horizontal")
      slider = new SliderHorizontal(options);
    else
      slider = new SliderVertical(options);
    slider.init();
  }

  _getOrientation() {
    let orientation = this._slider.getAttribute("orientation");
    return orientation && orientation == "vertical"? "vertical": "horizontal";
  }

  _getActive() {
    let active = this._slider.getAttribute("active");
    return active && active >= 0 && active < this._slides.length? active: 0;
  }

  _setContent() {
    this._content = document.createElement("div");
    this._setSlidesStyles();
    this._setContentStyles();
    this._setSliderStyles();
  }

  _setSlidesStyles() {
    this._slides.forEach(slide => {
      slide.style.overflow = "hidden";
      slide.style.display = "block";
      slide.style.width = "100%";
      slide.style.height = this._slider.getAttribute("height") || "300px";
      this._content.appendChild(slide);
    })
  }

  _setContentStyles() {
    if(this._getOrientation() == "horizontal") {
      this._content.style.display = "flex";
      this._content.style.width = `${100 * this._slides.length}%`;
    }else {
      this._content.style.width = "100%";
    }
  }

  _setSliderStyles() {
    this._slider.style.overflow = "hidden";
    this._slider.style.display = "block";
    this._slider.style.position = "relative";
    this._slider.style.width = this._slider.getAttribute("width") || this._width;
    this._slider.style.height = this._slider.getAttribute("height") || this._height;
    this._slider.innerHTML = '';
    this._slider.appendChild(this._content);
  }
}
