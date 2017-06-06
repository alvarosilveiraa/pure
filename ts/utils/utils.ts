function range(percent: number, min: number, max: number): number {
  return (percent * (max - min) / 100) + min;
}

// tsc refresher/Refresher.ts slider/iSlider.ts slider/SliderHorizontal.ts slider/Tabs.ts Pure.ts --out ../js/main.js
