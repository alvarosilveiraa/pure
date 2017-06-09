"use strict";

module pure {
  export declare const Hammer: any;
  export const $: any = document.querySelector.bind(document);
  export const $all: any = document.querySelectorAll.bind(document);
}


// tsc index.ts components/Touch.ts components/Header.ts components/Menu.ts components/Navigation.ts components/Refresher.ts components/Slider.ts components/Waves.ts --out ../js/lib/pure.js
