module pure {
  export class Navigation {

    public main: any;
    public pages: Array<any>;
    public menu: Menu;
    private os: string;
    private root: string;
    private timer: number;

    constructor(options: any = {}) {
      this.main = $("pure-navigation");
      this.pages = this.main.querySelectorAll("page");

      try {
        this.menu = new Menu(options.menu);
      }catch(e) {}

      this.os = options.os || "android";
      this.root = options.root || "home";
      this.timer = options.timer || 300;
    }

    public init(): void {
      if(this.menu)
        this.menu.init();

      this.main.classList.add(this.os);
      this.setPage(this.root, true);
    }

    public setPage(name: string, isRoot: boolean = false): void {
      let page: any = this.getPageByName(name);
      if(page) {

        if(this.menu && this.menu.active)
          this.menu.close();

        let child: any = this.getChild(page);


        if(isRoot) {
          child.classList.add("active");
          this.main.innerHTML = '';
        }

        this.main.appendChild(child);
        this.startController(child);

        this.onLoad(function() {

          if(!isRoot) {
            this.getPageContainsClass("active").page.classList.add("behind");
            child.classList.add("active");
          }

          child.style.paddingTop = new Header(child).getHeight() + "px";
          new Waves();
        }, 10);
      }
    }

    public pop(): void {
      let active: any = this.getPageContainsClass("active");
      let behind: any = this.getPageContainsClass("behind");
      if(!active || active.index == 0) return;
      behind.page.classList.remove("behind");
      active.page.classList.remove("active");
      this.startController(behind.page);
      this.onLoad(function() {
        this.main.removeChild(active.page);
      }, this.timer);
    }

    public isRoot(): boolean {
      return this.main.querySelectorAll("page").length == 1;
    }

    private onLoad(exec: any, timer: number): void {
      setTimeout(exec.bind(this), timer);
    }

    private getPageByName(name: string): any {
      for(let i = 0; i < this.pages.length; i++) {
        let page: any = this.pages[i];
        if(page.getAttribute("name") === name)
          return page;
      }
      return null;
    }

    private getPageContainsClass(className: string): any {
      let pages: Array<any> = this.main.querySelectorAll("page");
      for(let i = pages.length - 1; i >= 0; i--) {
        if(pages[i].classList.contains(className))
          return {page: pages[i], index: i};
      }
      return null;
    }

    private getChild(page: any): any {
      let child: any = document.createElement("page");
      child.setAttribute("style", page.getAttribute("style"));
      child.setAttribute("class", page.getAttribute("class"));
      child.setAttribute("name", page.getAttribute("name"));
      child.setAttribute("controller", page.getAttribute("controller"));
      child.innerHTML = page.innerHTML;
      return child;
    }

    private startController(page: any): void {
      let controller = eval(page.getAttribute("controller"));
      if(controller && typeof controller === "function")
        controller(page);
    }
  }
}
