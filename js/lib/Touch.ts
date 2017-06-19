module pure {
  export class Touch {

    private element: any;
    private onStart: any;
    private onMove: any;
    private onEnd: any;

    constructor() {}

    public init(options: any = {}) {
      if(this.onStart && this.onMove && this.onEnd) this.destroy();
      this.element = options.element || window;
      this.onStart = options.onStart;
      this.onMove = options.onMove;
      this.onEnd = options.onEnd;
      this.element.addEventListener("touchstart", this.onStart);
      this.element.addEventListener("touchmove", this.onMove, <any>{passive: false});
      this.element.addEventListener("touchend", this.onEnd);
    }

    private destroy() {
      this.element.removeEventListener("touchstart", this.onStart);
      this.element.removeEventListener("touchmove", this.onMove, <any>{passive: false});
      this.element.removeEventListener("touchend", this.onEnd);
    }
  }
}
