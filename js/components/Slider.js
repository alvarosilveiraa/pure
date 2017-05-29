class Slider {
  constructor() {
    this._slider = $("pure-slider");
    this._slides = $all("pure-slider slide");
    this._start();
  }

  _start() {
    let orientation = this._slider.getAttribute("orientation")
      , slide = null
      , options = {
        active: this._getActive(),
        total: this._slides.length,
        timer: 300,
        sensitivity: 25
      };

    if(orientation && orientation == "vertical") {
      options.content = this._contentVertical();
      slide = new SliderVertical(options);
    }else {
      options.content = this._contentHorizontal();
      slide = new SliderHorizontal(options);
    }

    slide.init();
  }

  _contentVertical() {
    let content = document.createElement("div");
    this._slides.forEach(slide => {
      slide.style.display = "block";
      slide.style.width = "100%";
      slide.style.height = this._slider.getAttribute("height") || "300px";
      content.appendChild(slide);
    })
    content.style.width = "100%";
    this._slider.style.display = "block";
    this._slider.style.overflow = "hidden";
    this._slider.style.position = "relative";
    this._slider.style.width = this._slider.getAttribute("width") || "100%";
    this._slider.style.height = this._slider.getAttribute("height") || "300px";
    this._slider.innerHTML = '';
    this._slider.appendChild(content);
    return content;
  }

  _contentHorizontal() {
    let content = document.createElement("div");
    this._slides.forEach(slide => {
      slide.style.width = "100%";
      slide.style.height = this._slider.getAttribute("height") || "300px";
      content.appendChild(slide);
    })
    content.style.display = "flex";
    content.style.width = `${100 * this._slides.length}%`;
    this._slider.style.display = "block";
    this._slider.style.overflow = "hidden";
    this._slider.style.position = "relative";
    this._slider.style.width = this._slider.getAttribute("width") || "100%";
    this._slider.innerHTML = '';
    this._slider.appendChild(content);
    return content;
  }

  _getActive() {
    let active = this._slider.getAttribute("active")
    return active && active >= 0 && active < this._slides.length? active: 0;
  }
}
