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
      this.menu = options.menu || null;
      this.os = options.os || "android";
      this.root = options.root || "home";
      this.timer = options.timer || 300;
    }

    public init(): void {
      if(this.menu) this.menu.init();
      this.main.classList.add(this.os);
      this.setRoot(this.root);
    }

    public setRoot(name: string): void {
      let root: any = this.getPageByName(name);
      if(root) {

        if(this.menu && this.menu.active)
          this.menu.close();

        let child: any = this.getChild(root);
        child.classList.add("active");
        this.main.innerHTML = '';
        this.main.appendChild(child);

        this.onLoad(function() {
          child.style.paddingTop = new Header(child).getHeight() + "px";
          new Waves();
        }, 10);
      }
    }

    public setPage(name: string): void {
      let page: any = this.getPageByName(name);
      if(page) {

        if(this.menu && this.menu.active)
          this.menu.close();

        let child: any = this.getChild(page);
        this.main.appendChild(child);

        this.onLoad(function() {
          this.getPageByLengthLessIndex(2).classList.add("behind");
          child.classList.add("active");
          child.style.paddingTop = new Header(child).getHeight() + "px";
          new Waves();
        }, 10);
      }
    }

    public pop(): void {
      let pages: Array<any> = this.main.querySelectorAll("page");
      for(let i = pages.length - 1; i > 0; i--) {
        let page: any = pages[i];
        if(page.classList.contains("active")) {
          this.getPageByLengthLessIndex(2).classList.remove("behind");
          page.classList.remove("active");

          this.onLoad(function() {
            this.main.removeChild(page);
          }, this.timer);
          return;
        }
      }
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

    private getPageByLengthLessIndex(i: number = 1): any {
      let pages = this.main.querySelectorAll("page");
      return pages[pages.length - i];
    }

    private getChild(page: any): any {
      let child: any = document.createElement("page");
      child.style.cssText = page.style.cssText;
      child.classList = page.classList;
      child.innerHTML = page.innerHTML;
      return child;
    }
  }
}
