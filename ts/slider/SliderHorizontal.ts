class SliderHorizontal implements iSlider {

  private transitionTimeout: number;
  private slider: any;
  private slides: any;
  private tabs: Tabs;
  private scrolling: boolean;
  public total: number;
  public active: number;
  public width: number;
  public height: number;
  public timer: number;
  public sensitivity: number;

  constructor(slider: any, tabs: Tabs) {
    this.transitionTimeout = 0;
    this.slider = slider;
    this.slides = slider.querySelector("slides");
    this.tabs = tabs;
    this.total = this.slides.querySelectorAll("slide").length;
    this.active = parseInt(this.getSliderAttribute("active", '0'));
    this.width = parseInt(this.getSliderAttribute("width", '0'));
    this.height = parseInt(this.getSliderAttribute("height", '0'));
    this.timer = parseInt(this.getSliderAttribute("timer", "300"));
    this.sensitivity = parseInt(this.getSliderAttribute("sensitivity", "25"));

    if(tabs) this.tabs.setTabs(this.setPage.bind(this));
    this.setStyles();
  }

  public init(): void {
    let manager = new Hammer.Manager(this.slides);
    manager.add(new Hammer.Pan({
      direction: Hammer.DIRECTION_HORIZONTAL,
      threshold: 0,
      pointers: 0
    }));
    manager.on("panstart", e => {
      let angle = Math.abs(e.angle);
      if(
        angle >= 90 && angle < 150 ||
        angle > 30 && angle < 90
      )
        this.scrolling = true;
      else
        this.scrolling = false;
    });
    manager.on("panend", e => {
      this.scrolling = false;
    });
    manager.on("pan", e => {
      if(!this.scrolling)
       this.onPan(e);
    });
  }

  public setPage(active: number): void {
    this.normalizeActive(active);
    let percentage = -(100 / this.total) * this.active;
    this.setSlidesPosition(percentage);
    if(this.tabs) this.tabs.setTrayPosition(percentage * -1);
    clearTimeout(this.transitionTimeout);
    this.setTransitionTimeout();
  }

  private onPan(e: any): void {
    let percentage = 100 / this.total * e.deltaX / (this.slides.clientWidth / this.total)
      , calculated = percentage - 100 / this.total * this.active
      , active = Math.round(-1 * calculated / (100 / this.total));

    if(this.slides.style.transition == '') {
      if(calculated < 5 && calculated > -80) {
        this.setSlidesPosition(calculated);
        if(this.tabs) this.tabs.setTrayPosition(calculated * -1);
        if(e.isFinal) {
          if(active != this.active) {
              this.setPage(active);
          }else {
            if(e.velocityX > 1) {
              this.setPage(this.active - 1);
            }else if(e.velocityX < -1) {
              this.setPage(this.active + 1);
            }else {
              if(percentage <= -(this.sensitivity / this.total))
                this.setPage(this.active + 1);
              else if(percentage >= this.sensitivity / this.total)
                this.setPage(this.active - 1);
              else
                this.setPage(this.active);
            }
          }
        }
      }else {
        if(e.isFinal) {
          this.setPage(active);
        }
      }
    }
  }

  private setStyles(): void {
    this.slider.style.width = this.numberToStyle(this.width, '%');
    this.slider.setAttribute("orientation", "horizontal");
    this.slides.style.width = `${100 * this.total}%`;
    this.slides.querySelectorAll("slide").forEach(slide => {
      if(this.tabs)
        slide.style.minHeight = `calc(${this.numberToStyle(this.height, "vh")} - ${this.tabs.tabs.clientHeight}px)`;
      else
        slide.style.minHeight = this.numberToStyle(this.height, "vh");
    })
  }

  private setTransitionTimeout(): void {
    this.slides.style.transition = `transform ${this.timer}ms cubic-bezier(0.5, 0, 0.5, 1)`;
    if(this.tabs) this.tabs.tray.style.transition = `left ${this.timer}ms ease`;
    this.transitionTimeout = setTimeout(() => {
      this.slides.style.transition = '';
      if(this.tabs) this.tabs.tray.style.transition = '';
    }, this.timer);
  }

  private setSlidesPosition(percentage: number): void {
    this.slides.style.transform = `translateX(${percentage}%)`;
  }

  private normalizeActive(active: number): void {
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

  private numberToStyle(value: number, operation: string): string {
    return value > 0? value + "px": "100" + operation;
  }
}
