module pure {
  export class Tabs {

    public tray: any;
    public isValid: boolean;
    public total: number;
    public isFixed: boolean;

    private tabs: any;
    private click: any;
    private trayHeight: number;
    private trayColor: string;

    constructor(slider: any, click: any) {
      this.tabs = slider.querySelector("tabs");

      if(this.tabs && this.tabs.querySelectorAll("tab").length == slider.querySelectorAll("slides slide").length)
        this.isValid = true;
      else this.isValid = false;

      if(this.isValid) {
      this.total = this.tabs.querySelectorAll("tab").length;
        this.isFixed = this.tabs.getAttribute("no-fixed")? false: true;
        this.trayHeight = parseInt(this.tabs.getAttribute("tray-height")) || 3;
        this.trayColor = this.tabs.getAttribute("tray-color") || "white";
        this.tray = this.getTray();
        this.setTabs()
      }

      this.click = click;
    }

    public setTrayPosition(percentage: number): void {
      this.tray.style.left = percentage + "%";
    }

    public getHeight(): number {
      return this.tabs.clientHeight;
    }

    private setTabs(): void {
      this.tabs.querySelectorAll("tab").forEach((tab, i) => {
        tab.addEventListener("click", e => this.click(i));
        tab.style.width = `${100 / this.total}%`;
        tab.style.paddingBottom = this.trayHeight + "px";
      })
      this.tabs.appendChild(this.tray);
    }

    private getTray(): any {
      let tray = document.createElement("tray");
      if(this.isFixed)
        tray.style.width = `${100 / this.total}%`;

      tray.style.height = this.trayHeight + "px";
      tray.style.backgroundColor = this.trayColor;
      return tray;
    }
  }
}
