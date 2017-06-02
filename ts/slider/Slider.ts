class Slider {

  private slider: any;

  constructor() {
    this.slider = $("pure-slider");
    this.exec();
  }

  private exec(): void {

    let sync = new Sync(document.body, null);
    sync.init();

    let tabs = null;
    try {
      tabs = new Tabs(this.slider);
    }catch(e) {}
    let horizontal = new SliderHorizontal(this.slider, tabs);
    horizontal.init();
  }
}
