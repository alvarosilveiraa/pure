module pure {
  export class Menu {
    public main: any;
    public content: any;
    public overlay: any;
    public active: boolean;
    private side: string;
    private timer: number;

    constructor(options: any = {}) {
      this.main = $("pure-menu");
      if(!this.main) throw new Error("Elemento não encontrado!");
      this.content = this.main.querySelector("content");
      this.overlay = this.main.querySelector("overlay");
      this.side = options.side || "left";
      this.timer = options.timer || 300;
    }

    public init(): void {
      this.main.classList.add(this.side);
      this.main.style.display = "none";
      this.content.style.transition = `transform ${this.timer}ms, left ${this.timer}ms, right ${this.timer}ms`;
      this.overlay.style.transition = `opacity ${this.timer}ms`;
      this.overlay.onclick = e => this.close();
    }

    public open(): void {
      this.active = true;
      this.main.style.display = "block";

      setTimeout(function() {
        this.main.classList.add("open");
      }.bind(this), 10);
    }

    public close():void {
      if(this.active) {
        this.active = false;
        this.main.classList.remove("open");
        setTimeout(function() {
          this.main.style.display = "none";
        }.bind(this), this.timer);
      }
    }
  }
}
