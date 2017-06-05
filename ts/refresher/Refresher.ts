class Refresher {

  private onRefresh: any;
  private refresher: any;
  private body: any;
  private state: string;
  private max: number;
  private threshold: number;
  private reload: number;
  private timer: number;
  private distance: number;
  private resisted: number;
  private timeout: number;
  private startY: number;
  private moveY: number;
  private enable: boolean;
  private text: any;
  private arrow: boolean;
  private animation: string;
  private blockeds: Array<string>;

  constructor(refresher: any, options: any = {}) {
    this.refresher = refresher;
    this.body = $("body");
    this.state = "pending";
    this.max = options.max || 80;
    this.threshold = options.threshold || 60;
    this.reload = options.reload || 50;
    this.timer = options.timer || 300;
    this.distance = 0;
    this.resisted = 0;
    this.timeout = 0;
    this.startY = 0;
    this.moveY = 0;
    this.enable = false;
    this.text = options.text || {};
    this.arrow = options.arrow || true;
    this.animation = options.animation || "circle";
    this.blockeds = options.blockeds || [];
  }

  public init(onRefresh: any): void {
    this.onRefresh = onRefresh.bind(this);
    window.addEventListener("touchend", this.onTouchEnd.bind(this));
    window.addEventListener("touchstart", this.onTouchStart.bind(this));
    window.addEventListener("touchmove", this.onTouchMove.bind(this), <any>{passive: false});
  }

  private onTouchEnd(): void {
    if(this.state === "releasing" &&  this.resisted > this.threshold) {
      this.state = "refreshing";
      this.refresher.style["min-height"] = this.reload + "px";
      this.refresher.classList.add("refresh");
      this.timeout = setTimeout(function() {
        let retval = this.onRefresh(this.onReset.bind(this));
        if(!retval && !this.onRefresh.length) this.onReset();
      }.bind(this), this.timer);
    }else {
      if(this.state === "refreshing") return;
      this.state = "pending";
      this.refresher.style["min-height"] = "0px";
    }
    this.update();
    this.refresher.classList.remove("pull");
    this.refresher.classList.remove("release");
    this.startY = this.moveY = 0;
    this.distance = this.resisted = 0;
  }

  private onTouchStart(e: any): void {
    if(!window.scrollY) this.startY = e.touches[0].screenY;
    if(this.state !== "pending") return;
    clearTimeout(this.timeout);
    this.state = "pending";
    this.enable = this.body.contains(e.target);
    if(this.blockeds.length > 0) {
      this.blockeds.forEach(blocked => {
        if(this.enable && $(blocked).contains(e.target))
          this.enable = false;
      })
    }
    this.update();
  }

  private onTouchMove(e: any): void {
    if(!this.startY) {
      if(!window.scrollY)
        this.startY = e.touches[0].screenY;
    }else {
      this.moveY = e.touches[0].screenY;
    }

    if(!this.enable || this.state === "refreshing") {
      if (!window.scrollY && this.startY < this.moveY) {
        e.preventDefault();
      }
      return;
    }

    if(this.state === "pending") {
      this.refresher.classList.add("pull");
      this.state = "pulling";
      this.update();
    }

    if(this.startY && this.moveY)
      this.distance = this.moveY - this.startY;

    if(this.distance > 0) {
      e.preventDefault();
      this.refresher.style["min-height"] = this.resisted + "px";
      this.resisted = this.getResistance() * Math.min(this.max, this.distance);

      if(this.state === "pulling" && this.resisted > this.threshold) {
        this.refresher.classList.add("release");
        this.state = "releasing";
        this.update();
      }

      if(this.state === "releasing" && this.resisted < this.threshold) {
        this.refresher.classList.remove("release");
        this.state = "pulling";
        this.update();
      }
    }
  }

  private onReset(): void {
    this.state = "pending";
    this.refresher.style["min-height"] = "0px";
    this.refresher.classList.remove("refresh");
  }

  private update(): void {
    if(this.state === "refreshing") {
      this.refresher.innerHTML = `
        <loader></loader>
      `;
    }else if(this.state === "releasing") {
      this.refresher.innerHTML = `
        <icon></icon>
        <text>${this.text.release || ''}</text>
      `;
    }else if(this.state === "pending" || this.state === "pulling") {
      this.refresher.innerHTML = `
        </icon></icon>
        <text>${this.text.pull || ''}</text>
      `;
    }
  }

  private destroy(): void {
    window.removeEventListener("touchstart", this.onTouchStart.bind(this));
    window.removeEventListener("touchend", this.onTouchEnd.bind(this));
    window.removeEventListener("touchmove", this.onTouchMove.bind(this));
  }

  private getResistance(): number {
    return Math.min(1, (this.distance / this.threshold) / 2.5);
  }
}
