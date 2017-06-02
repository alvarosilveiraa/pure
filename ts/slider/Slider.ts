class Slider implements iSlider {

  private slider: any;
  private slides: any;
  public total: number;
  public width: number;
  public height: number;
  public active: number;
  public timer: number;
  public sensitivity: number;

  constructor() {
    this.slider = $("pure-slider");
    this.slides = this.slider.querySelector("slides");
    this.total = this.slides.querySelectorAll("slide").length;
    this.width = parseInt(this.getSliderAttribute("width", '0'));
    this.height = parseInt(this.getSliderAttribute("height", '0'));
    this.active = parseInt(this.getSliderAttribute("active", '0'));
    this.timer = parseInt(this.getSliderAttribute("timer", "300"));
    this.sensitivity = parseInt(this.getSliderAttribute("sensitivity", "25"));
  }

  public normalizeActive(active: number): void {
    if(active < 0)
      this.active = 0;
    else if(active > this.total - 1)
      this.active = this.total - 1;
    else
      this.active = active;
  }

  private getSliderAttribute(name: string, value: string): string {
    return this.slider.getAttribute(name) || value;
  }
}
