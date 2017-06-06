/***
  options = {
    slider: any,
    active: number,
    width: number,
    height: number,
    timer: number,
    sensitivity: number
  }
***/

module pure {
  export class SliderHorizontal2 implements iSlider {

    public slider: any;
    public tabs: any;
    public slides: any;
    public total: number;
    public active: number;
    public width: number;
    public height: number;
    public timer: number;
    public sensitivity: number;

    private timeout: number;
    private scrolling: boolean;

    constructor(options: any = {}) {
      this.slider = options.slider || $("pure-slider");
      this.tabs = new Tabs(this.slider, this.setPage.bind(this));
      this.slides = this.slider.querySelector("slides");
      this.total = this.slides.querySelectorAll("slide").length;
      this.active = options.active || 0;
      this.width = options.width || 0;
      this.height = options.height || 0;
      this.timer = options.timer || 300;
      this.sensitivity = options.sensitivity || 25;

      this.timeout = 0;
      this.scrolling = false;

      this.init();
    }

    public init(): void {
      this.setStyles();
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
      if(this.tabs.isValid) this.tabs.setTrayPosition(percentage * -1);
      clearTimeout(this.timeout);
      this.setTransitionTimeout();
    }

    private onPan(e: any): void {
      let percentage = 100 / this.total * e.deltaX / (this.slides.clientWidth / this.total)
        , calculated = percentage - 100 / this.total * this.active
        , active = Math.round(-1 * calculated / (100 / this.total));

      if(this.slides.style.transition == '') {
        if(calculated < 5 && calculated > -80) {
          this.setSlidesPosition(calculated);
          if(this.tabs.isValid) this.tabs.setTrayPosition(calculated * -1);
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
        if(this.tabs.isValid)
          slide.style.minHeight = `calc(${this.numberToStyle(this.height, "vh")} - ${this.tabs.getHeight()}px)`;
        else
          slide.style.minHeight = this.numberToStyle(this.height, "vh");
      })
    }

    private setTransitionTimeout(): void {
      this.slides.style.transition = `transform ${this.timer}ms cubic-bezier(0.5, 0, 0.5, 1)`;
      if(this.tabs.isValid) this.tabs.tray.style.transition = `left ${this.timer}ms ease`;
      this.timeout = setTimeout(() => {
        this.slides.style.transition = '';
        if(this.tabs.isValid) this.tabs.tray.style.transition = '';
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

    private numberToStyle(value: number, operation: string): string {
      return value > 0? value + "px": "100" + operation;
    }
  }
}
