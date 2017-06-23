module pure {
  export class Waves {

    private timer: number;

    constructor(options: any = {}) {
      this.timer = options.timer || 800;

      let waves: Array<any> = $all("[pure-waves]");
      for(let i = 0; i < waves.length; i++) {
        let element = waves[i];
        element.addEventListener("click", this.click(element));
        element.removeAttribute("pure-waves");
      }
    }

    private click(element): any {
      return e => {

        //disabled return;

        if(getComputedStyle(element).position === "static")
          element.style.position = "relative";

        let offset: any = element.getBoundingClientRect();
        let x: number = e.pageX - offset.left;
        let y: number = e.pageY - offset.top;
        let diameter: number = Math.min(offset.height, offset.width, 100);

        let container: any = document.createElement("div");
        container.classList.add("pure-waves");
        element.appendChild(container);
        let wave: any = document.createElement("div");
        wave.classList.add("wave");
        wave.style.animation = `wave ${this.timer}ms forwards`;
        wave.style.backgroundColor = this.getAttribute(element.getAttribute("wave-color"));
        wave.style.width = diameter + "px";
        wave.style.height = diameter + "px";
        wave.style.top = y - (diameter / 2) + "px";
        wave.style.left = x - (diameter / 2) + "px";
        container.appendChild(wave);

        setTimeout(function() {
          element.removeChild(container);
        }, this.timer);
      }
    }

    private getAttribute(attribute: string): string {
      return attribute || "#FFFFFF";
    }
  }
}
