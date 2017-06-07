module pure {
  export class Navigation {

    public main: any;
    public pages: Array<any>;
    public active: number;

    private os: string;
    private root: string;
    private timer: number;

    constructor(options: any = {}) {
      this.main = $("pure-navigation");
      this.pages = this.main.querySelectorAll("page");
      this.active = 0;

      this.os = options.os || "android";
      this.root = options.root;
      this.timer = options.timer || 300;
    }

    public init(): void {
      this.main.classList.add(this.os);
      this.setRoot(this.root);
    }

    public setRoot(name: string): void {
      let root: any;
      if(name)
        root = this.getPageByName(name);
      else
        root = this.pages[this.active];

      if(root) {
        let child: any = document.createElement("page");
        child.classList.add("active");
        child.innerHTML = root.innerHTML;
        this.main.innerHTML = '';
        this.main.appendChild(child);
      }
    }

    public setPage(name: string): void {
      let page: any = this.getPageByName(name);
      if(page) {
        let child: any = document.createElement("page");
        child.innerHTML = page.innerHTML;
        this.main.appendChild(child);
        setTimeout(function() {
          child.classList.add("active");
        }, 0);
      }
    }

    public pop(index: number = 0): void {
      let pages: Array<any> = this.main.querySelectorAll("page");

      for(let i = pages.length - 1; i > 0; i--) {
        let page: any = pages[i];
        if(page.classList.contains("active")) {
          page.classList.remove("active");
          setTimeout(function() {
            this.main.removeChild(page);
          }.bind(this), this.timer);
          return;
        }
      }
    }

    private getPageByName(name: string): any {
      for(let i = 0; i < this.pages.length; i++) {
        let page: any = this.pages[i];
        if(page.getAttribute("name") === name)
          return page;
      }
      return null;
    }
  }
}
