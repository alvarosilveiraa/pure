class Tabs {

  public tabs: any;
  public total: number;
  public height: number;
  public isFixed: boolean;
  public trayHeight: number;
  public trayColor: string;
  public tray: any;

  constructor(slider: any) {
    this.tabs = slider.querySelector("tabs");
    if(!this.tabs) throw new Error("Nao existem tabs neste slider");
    this.total = this.tabs.querySelectorAll("tab").length;
    this.height = this.tabs.clientHeight;
    this.isFixed = this.tabs.getAttribute("no-fixed")? false: true;
    this.trayHeight = parseInt(this.tabs.getAttribute("tray-height")) || 3;
    this.trayColor = this.tabs.getAttribute("tray-color") || "white";
    this.tray = this.getTray();
  }

  public setTabs(click: any): void {
    this.tabs.querySelectorAll("tab").forEach((tab, i) => {
      tab.addEventListener("click", e => click(i));
      tab.style.width = `${100 / this.total}%`;
      tab.style.paddingBottom = this.trayHeight + "px";
    })
    this.tabs.appendChild(this.tray);
  }

  public setTrayPosition(percentage: number): void {
    this.tray.style.left = percentage + "%";
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
