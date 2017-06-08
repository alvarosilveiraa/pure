module pure {
  export class Header {
    public main: any;

    constructor(page: any) {
      this.main = page.querySelector("pure-header");
    }

    public getHeight(): number {
      return this.main? this.main.clientHeight: 0;
    }
  }
}
