module pure {
  export class Navigation {
    public main: any;
    public pages: Array<any>;
    public root: string;
    private timer: number;

    constructor(options: any = {}) {
      this.main = $("#pure-navigation");
      if(!this.main) throw new Error("Elemento nao encontrado!");
      this.pages = this.main.querySelectorAll("[page]");
      this.root = options.root;
      this.timer = options.timer || 300;
    }

    public init(): void {
      if(!this.main.getAttribute("platform"))
        this.main.setAttribute("platform", "android");

      if(!this.root && this.pages.length > 0)
        this.setRoot(this.pages[0].getAttribute("page"));
      else this.setRoot(this.root);
    }

    public setRoot(name: string, params: any = {}): void {
      let root: any = this.getPageByName(name).cloneNode(true);
      root.classList.add("active");
      this.main.innerHTML = '';
      this.main.appendChild(root);
      this.startController(root, params);
    }

    public setPage(name: string, params: any = {}): void {
      let page: any = this.getPageByName(name).cloneNode(true);
      let active: any = this.main.querySelector("[page].active:last-child");
      active.classList.add("behind");
      page.classList.add("animated");
      page.classList.add("active");
      this.main.appendChild(page);
      this.startController(page, params);
    }

    public pop(): void {
      let active: any = this.main.querySelector("[page].active:last-child");
      let behind: Array<any> = this.main.querySelectorAll("[page].behind");

      if(!active || !behind || this.isRoot()) return;
      active.classList.remove("active");
      behind[behind.length - 1].classList.remove("behind");
      setTimeout(function() {
        this.main.removeChild(active);
      }.bind(this), this.timer);
    }

    public isRoot(): boolean {
      return this.main.querySelectorAll("[page]").length == 1;
    }

    private getPageByName(name: string): any {
      for(let i = 0; i < this.pages.length; i++) {
        if(this.pages[i].getAttribute("page") == name)
          return this.pages[i];
      }
      return document.createElement("div");
    }

    private startController(page: any, params: any): void {
      let controller: any = eval(page.getAttribute("controller"));
      if(controller && typeof controller === "function")
        controller(page, params);
    }
  }
}
