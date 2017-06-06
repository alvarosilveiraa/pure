"use strict";

declare const Hammer: any;
const $ = document.querySelector.bind(document);

module pure {
  export class Main {
    constructor(components: any = {}) {
      [
        {
          name: "refresher",
          component: Refresher
        },
        {
          name: "sliderHorizontal",
          component: SliderHorizontal
        }
      ].forEach(item => {
        let component: any = components[item.name];
        if(component) new item.component(component).init();
      })
    }
  }
}

window.onload = function() {
  new pure.Main({
    refresher: {view: "page"},
    sliderHorizontal: {}
  })
}
