class Sync {

  private sync: any;
  private scroller: any;
  private min: number;
  private max: number;
  private timer: number;
  private transitionTimeout: number;

  constructor(element: any, exec: any) {
    // this.onSync(exec);
    this.sync = $("pure-sync");
    this.scroller = element;
    this.min = -30;
    this.max = 80;
    this.timer = 300;
    this.transitionTimeout = 0;
  }

  public init() {
    let manager = new Hammer.Manager(this.scroller, {touchAction: ''});
    manager.add(new Hammer.Pan({
      direction: Hammer.DIRECTION_VERTICAL
    }));
    manager.on("pan", e => {
      this.onPan(e);
    });
  }

  private onPan(e) {
    if(this.scroller.scrollTop == 0 && e.additionalEvent == "pandown" && (e.angle > 80 && e.angle < 100)) {
      this.scroller.style.touchAction = "pan-x";

      let percentage = 100 * e.deltaY / this.max - this.min;
      if(percentage <= 100)
        this.sync.style.top = this.range(percentage, this.min, this.max) + "px";
      else if(e.isFinal)
        this.close();
    }else {
      if(e.isFinal)
        this.close();
      else
        this.scroller.style.touchAction = '';
    }
  }

  private onSync(exec: any): void {

  }

  private close(): void {
    this.scroller.style.touchAction = '';
    this.sync.style.top = this.min + "px";
    clearTimeout(this.transitionTimeout);
    this.setTransitionTimeout();
  }

  private setTransitionTimeout(): void {
    this.sync.style.transition = `top ${this.timer}ms ease`;
    this.transitionTimeout = setTimeout(() => {
      this.sync.style.transition = '';
    }, this.timer);
  }

  private range(percent: number, min: number, max: number): number {
    return (percent * (max - min) / 100) + min;
  }
}
