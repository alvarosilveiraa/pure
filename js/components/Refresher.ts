/***
  options = {
    onRefresh: any,
    refresher: any,
    max: number,
    threshold: number,
    reload: number,
    timer: number,
    loader: string,
    blockeds: Array<string>
  }
***/

module pure {
  export class Refresher {

    public main: any;
    public max: number;
    public threshold: number;
    public reload: number;
    public timer: number;
    public loader: string;
    public blockeds: Array<string>;

    private view: any;
    private state: string;
    private distance: number;
    private resisted: number;
    private startY: number;
    private moveY: number;
    private enable: boolean;
    private onRefresh: any;
    private timeout: number;

    constructor(options: any = {}) {
      this.main = options.view.querySelector("pure-refresher") || $("pure-refresher");
      this.max = options.max || 80;
      this.threshold = options.threshold || 60;
      this.reload = options.reload || 50;
      this.timer = options.timer || 300;
      this.loader = options.loader || "circle";
      this.blockeds = options.blockeds || [];

      this.view = options.view || $("body");
      this.state = "pending";
      this.distance = 0;
      this.resisted = 0;
      this.startY = 0;
      this.moveY = 0;
      this.enable = false;
      this.onRefresh = options.onRefresh?
        options.onRefresh.bind(this):
        done => done();
    }

    // public init(): void {
    //   window.addEventListener("touchstart", this.onTouchStart.bind(this));
    //   window.addEventListener("touchmove", this.onTouchMove.bind(this), <any>{passive: false});
    //   window.addEventListener("touchend", this.onTouchEnd.bind(this));
    // }

    public onTouchStart(e: any): void {
      if(!this.view.scrollTop) this.startY = e.touches[0].screenY;
      if(this.state !== "pending") return;
      clearTimeout(this.timeout);
      this.state = "pending";
      this.enable = this.view.contains(e.target);
      if(this.blockeds.length > 0) {
        this.blockeds.forEach(blocked => {
          if(this.enable && $(blocked).contains(e.target))
            this.enable = false;
        })
      }
      this.update();
    }

    public onTouchMove(e: any): void {
      if(!this.startY) {
        if(!this.view.scrollTop)
          this.startY = e.touches[0].screenY;
      }else {
        this.moveY = e.touches[0].screenY;
      }

      if(!this.enable || this.state === "refreshing") {
        if (!this.view.scrollTop && this.startY < this.moveY) {
          e.preventDefault();
        }
        return;
      }

      if(this.state === "pending") {
        this.main.classList.add("pull");
        this.state = "pulling";
        this.update();
      }

      if(this.startY && this.moveY)
        this.distance = this.moveY - this.startY;

      if(this.distance > 0) {
        e.preventDefault();
        this.main.style["min-height"] = this.resisted + "px";
        this.resisted = this.getResistance() * Math.min(this.max, this.distance);

        if(this.state === "pulling" && this.resisted > this.threshold) {
          this.main.classList.add("release");
          this.state = "releasing";
          this.update();
        }

        if(this.state === "releasing" && this.resisted < this.threshold) {
          this.main.classList.remove("release");
          this.state = "pulling";
          this.update();
        }
      }
    }

    public onTouchEnd(): void {
      if(this.state === "releasing" &&  this.resisted > this.threshold) {
        this.state = "refreshing";
        this.main.style["min-height"] = this.reload + "px";
        this.main.classList.add("refresh");
        this.timeout = setTimeout(function() {
          let retval = this.onRefresh(this.onReset.bind(this));
          if(!retval && !this.onRefresh.length) this.onReset();
        }.bind(this), this.timer);
      }else {
        if(this.state === "refreshing") return;
        this.state = "pending";
        this.main.style["min-height"] = "0px";
      }
      this.update();
      this.main.classList.remove("pull");
      this.main.classList.remove("release");
      this.startY = this.moveY = 0;
      this.distance = this.resisted = 0;
    }

    private onReset(): void {
      this.state = "pending";
      this.main.style["min-height"] = "0px";
      this.main.classList.remove("refresh");
    }

    private update(): void {
      if(this.state === "refreshing") {
        this.main.innerHTML = "<box><loader></loader></box>";
      }else {
        let icon: any = this.getBoxIcon();
        if(this.state === "releasing") {
          icon.setAttribute("class", "up");
        }else if(this.state === "pending" || this.state === "pulling") {
          icon.setAttribute("class", "down");
        }
      }
    }

    private destroy(): void {
      window.removeEventListener("touchstart", this.onTouchStart.bind(this));
      window.removeEventListener("touchmove", this.onTouchMove.bind(this));
      window.removeEventListener("touchend", this.onTouchEnd.bind(this));
    }

    private getBoxIcon(): any {
      let box: any = this.main.querySelector("box"), icon: any = null;
      if(box && box.querySelector("icon")) return box.querySelector("icon");
      this.main.innerHTML = '';
      box = this.main.appendChild(document.createElement("box"));
      icon = document.createElement("icon");
      box.appendChild(icon);
      return icon;
    }

    private getResistance(): number {
      return Math.min(1, (this.distance / this.threshold) / 2.5);
    }
  }
}
