module pure {
  export class Menu {
    public main: any;
    public active: boolean;
    private side: string;
    private timer: number;

    constructor(options: any = {}) {
      this.main = $("pure-menu");
      this.side = options.side || "left";
      this.timer = options.timer || 300;
    }

    public init(): void {
      this.main.classList.add(this.side);
      this.close();
    }

    public open(): void {
      this.active = true;
      this.main.style.display = "block";
      setTimeout(function() {
        this.main.classList.add("open");
      }.bind(this), 0);
    }

    public close():void {
      this.active = false;
      this.main.classList.remove("open");
      setTimeout(function() {
        this.main.style.display = "none";
      }.bind(this), this.timer);
    }
  }
}
