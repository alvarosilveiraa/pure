module pure {
  export class Tabs {

    public main: any;
    public tabs: any;
    private active: number;
    private total: number;
    private threshold: number;
    private restraint: number;
    private allowedTime: number;
    private timer: number;
    private direction: string;
    private startX: number;
    private startY: number;
    private distX: number;
    private distY: number;
    private timeout: number;
    private startTime: number;
    private trayColor: string;

    constructor(options: any = {}) {
      this.main = options.view? options.view.querySelector(".pure-tabs"): $(".pure-tabs");
      if(!this.main) throw new Error("Elemento não existe!");
      this.tabs = options.view? options.view.querySelector(".pure-tabs_btn"): $(".pure-tabs_btn");
      this.total = this.main.querySelectorAll("[tab]").length;
      this.active = options.active || 0;
      this.trayColor = options.trayColor || "#FFFFFF";
      this.threshold = options.threshold || 80;
      this.restraint = options.restraint || 100;
      this.allowedTime = options.allowedTime || 300;
      this.timer = options.timer || 200;
      this.direction = "none";
      this.startX = 0;
      this.startY = 0;
      this.timeout = 0;
      this.startTime = 0;
    }

    public init(): void {
      this.createTabs();
      this.createPages();
      this.createTray();
    }

    public onTouchStart(e: any): void {
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY;
      this.startTime = new Date().getTime();
    }

    public onTouchMove(e: any): void {
      let width = this.main.clientWidth;
      let pageX = e.touches[0].pageX;
      let pageY = e.touches[0].pageY;
      let distX = pageX - this.startX;
      let distY = pageY - this.startY;
      this.setDirection(distX, distY);
      let calc = this.active * width + (this.startX - pageX);
      let percentage = calc * 100 / width;
      this.setPan(percentage);
    }

    public onTouchEnd(e: any): void {
      let elapsedTime = new Date().getTime() - this.startTime;
      if(this.isHorizontal() && elapsedTime <= this.allowedTime) {
        this.update();
      }else {
        this.setPan(100 * this.active);
      }
      this.setTransition();
      this.direction = "none";
    }

    private update(): void {
      this.setActive();
      this.setPan(100 * this.active);
      this.setTab();
    }

    private isHorizontal(): boolean {
      return this.direction == "left" || this.direction == "right";
    }

    private setDirection(distX: number, distY: number) {
      if(Math.abs(distX) >= this.threshold && Math.abs(distY) <= this.restraint) {
        this.direction = (distX < 0)? 'left' : 'right';
      }else if(Math.abs(distY) >= this.threshold && Math.abs(distX) <= this.restraint) {
        this.direction = (distY < 0)? 'up' : 'down'
      }
    }

    private setActive(): void {
      if(this.direction == "left" && this.active < this.total - 1)
        this.active++;
      else if(this.direction == "right" && this.active > 0)
        this.active--;
    }

    private setPan(percentage: number): void {
      if(percentage >= 0 && percentage <= 100 * (this.total - 1)) {
        this.main.querySelector(".tabs").style.transform = `translateX(${(percentage * -1) / this.total}%)`;
        let tray = this.tabs.querySelector(".tray");
        tray.style.left = `${percentage / this.total}%`;
      }
    }

    private setTab(): void {
      let tabs = this.tabs.querySelectorAll("[tab]");
      for(let i = 0; i < this.total; i++) {
        tabs[i].classList.remove("active");
      }
      tabs[this.active].classList.add("active");
    }

    private setTransition(): void {
      let tray = this.tabs.querySelector(".tray");
      let tabs = this.main.querySelector(".tabs");
      tray.style.transition = `left ${this.timer}ms`;
      tabs.style.transition = `transform ${this.timer}ms`;
      this.timeout = setTimeout(() => {
        tray.style.transition = '';
        tabs.style.transition = '';
      }, this.timer);
    }

    private createTabs(): void {
      let tabs = this.tabs.querySelectorAll("[tab]");
      for(let i = 0; i < this.total; i++) {
        let tab = tabs[i];
        tab.style.width = `${100 / this.total}%`;
        tab.addEventListener("click", e => {
          this.active = i;
          this.setTab();
          this.setPan(100 * i);
          this.setTransition();
        })
      }
      tabs[this.active].classList.add("active");
    }

    private createPages(): void {
      let pages = this.main.querySelectorAll("[tab]");
      for(let i = 0; i < this.total; i++) {
        pages[i].style.width = `${100 / this.total}%`;
      }
      this.main.querySelector(".tabs").style.width = `${100 * this.total}%`;
      this.main.querySelector(".tabs").style.transform = `translateX(${(-100 * this.active) / this.total}%)`;
    }

    private createTray(): void {
      let tray = document.createElement("div");
      tray.classList.add("tray");
      tray.style.width = `${100 / this.total}%`;
      tray.style.left = `${this.active * (100 / this.total)}%`;
      tray.style.backgroundColor = this.trayColor;
      this.tabs.appendChild(tray);
    }
  }
}
