module pure {
  interface iContent {
    element: any;
    exists: boolean;
    length: number;
    timeout: number;
    setPosition(percent: number): void;
    setTimeout(timer: number): void;
  }

  class Tabs implements iContent {
    public element: any;
    public exists: boolean;
    public length: number;
    public timeout: number;
    private tray: any;
    constructor(slider: any) {
      this.element = slider.querySelector("tabs");
      this.timeout = 0;

      if(this.element) {
        this.exists = true;
        this.length = this.element.querySelectorAll("tab").length;
      }else {
        this.exists = false;
        this.length = 0;
      }
    }

    public setPosition(percent: number): void {
      this.tray.style.left = percent + '%';
    }

    public setTimeout(timer: number): void {
      this.tray.style.transition = `left ${timer}ms`;
      this.timeout = setTimeout(() => {
        this.tray.style.transition = '';
      }, timer);
    }

    public setStyles(click: any): void {
      this.tray = document.createElement("tray");
      this.tray.style.width = `${100 / this.length}%`;
      this.tray.style.height = "3px";
      this.tray.style.backgroundColor = "black";

      this.element.querySelectorAll("tab").forEach((tab, i) => {
        tab.addEventListener("click", e => click(i));
        tab.style.width = `${100 / this.length}%`;
        tab.style.paddingBottom = "3px";
      })
      this.element.appendChild(this.tray);
    }
  }

  class Slides implements iContent {
    public element: any;
    public exists: boolean;
    public length: number;
    public timeout: number;
    constructor(slider: any) {
      this.element = slider.querySelector("slides");
      this.timeout = 0;

      if(this.element) {
        this.exists = true;
        this.length = this.element.querySelectorAll("slide").length;
      }else {
        this.exists = false;
        this.length = 0;
      }
    }

    public setPosition(percent: number): void {
      this.element.style.transform = `translateX(${percent}%)`;
    }

    public setTimeout(timer: number): void {
      this.element.style.transition = `transform ${timer}ms cubic-bezier(0.5, 0, 0.5, 1)`;
      this.timeout = setTimeout(() => {
        this.element.style.transition = '';
      }, timer);
    }

    public setStyles(height: string): void {
      if(this.exists) {
        this.element.style.width = `${100 * this.length}%`;
        this.element.querySelectorAll("slide").forEach(slide => {
          slide.style.minHeight = height;
        });
      }
    }
  }

  abstract class Slider {
    public scrolling: boolean;
    public slider: any;
    public active: number;
    public width: number;
    public height: number;
    public timer: number;
    public sensitivity: number;

    constructor(options: any = {}) {
      this.scrolling = false;
      this.slider = options.slider || $("pure-slider");
      this.active = options.active || 0;
      this.width = options.active || 0;
      this.height = options.height || 0;
      this.timer = options.timer || 300;
      this.sensitivity = options.sensitivity || 25;
    }

    abstract init(): void;
    abstract onPan(e: any): void;
    abstract setStyles(): void;
    abstract setPage(active: number): void;

    public setScrolling(angle: number): void {
      angle >= 90 && angle < 150 || angle > 30 && angle < 90?
        this.scrolling = true:
        this.scrolling = false;
    }

    public normalizeActive(active: number, total: number): void {
      if(active < 0)
        this.active = 0;
      else if(active > total - 1)
        this.active = total - 1;
      else
        this.active = active;
    }

    public numberToStyle(value: number, operation: string): string {
      return value > 0? value + "px": "100" + operation;
    }
  }

  export class SliderHorizontal extends Slider {
    private tabs: Tabs;
    private slides: Slides;
    private total: number;
    constructor(options) {
      super(options);
      this.tabs = new Tabs(this.slider);
      this.slides = new Slides(this.slider);
      this.total = this.getTotal();
    }

    public init(): void {
      this.setStyles();
      let manager: any = new Hammer.Manager(this.slides.element);
      manager.add(new Hammer.Pan({
        direction: Hammer.DIRECTION_HORIZONTAL
      }));
      manager.on("panstart", e => {
        this.setScrolling(Math.abs(e.angle));
      });
      manager.on("panend", e => {
        this.scrolling = false;
      });
      manager.on("pan", e => {
        this.onPan(e);
      });
    }

    public onPan(e: any): void {
      if(!this.scrolling) {
        let percentage = 100 / this.total * e.deltaX / (this.slides.element.clientWidth / this.total)
          , calculated = percentage - 100 / this.total * this.active
          , active = Math.round(-1 * calculated / (100 / this.total));

        if(calculated < 5 && calculated > -80) {
          this.tabs.setPosition(-1 * calculated);
          this.slides.setPosition(calculated);
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

    public setStyles(): void {
      this.slider.setAttribute("orientation", "horizontal");
      this.slider.style.width = this.numberToStyle(this.width, '%');
      this.tabs.setStyles(this.setPage.bind(this));
      this.slides.setStyles(this.numberToStyle(this.height, "vh"));
    }

    public setPage(active: number): void {
      this.normalizeActive(active, this.total);
      let percent: number = -(100 / this.total) * this.active;
      this.tabs.setPosition(-1 * percent);
      this.slides.setPosition(percent);
      clearTimeout(this.tabs.timeout);
      clearTimeout(this.slides.timeout);
      this.tabs.setTimeout(this.timer);
      this.slides.setTimeout(this.timer);
    }

    private getTotal(): number {
      return this.slides.length;
    }
  }
}
