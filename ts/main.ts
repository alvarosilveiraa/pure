// tsc slider/iSlider.ts slider/SliderHorizontal.ts slider/Tabs.ts slider/Slider.ts main.ts --out ../js/main.js
declare const Hammer: any;
const $ = document.querySelector.bind(document);
window.onload = () => {
  let refresher = new Refresher($("pure-refresher"), {
    text: {
      pull: "Pull",
      release: "Release"
    },
    animation: "circle",
    arrow: true
  });
  refresher.init(function(done) { setTimeout(function() { done(); }, 1000) });

  let tabs = null, slider = $("pure-slider");
  try {
    tabs = new Tabs(slider);
  }catch(e) {}
  let horizontal = new SliderHorizontal(slider, tabs);
  horizontal.init();
}

function range(percent: number, min: number, max: number): number {
  return (percent * (max - min) / 100) + min;
}
