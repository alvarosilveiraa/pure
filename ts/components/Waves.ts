module pure {
  export class Waves {
    constructor() {
      $all("[pure-waves]").forEach(element => {
        element.addEventListener("click", this.click(element));
        element.removeAttribute("pure-waves");
      })
    }

    private click(element): any {
      return e => {

        //disabled return;

        if(!element.style.position || element.style.position === "static")
          element.style.position = "relative";

        let offset: any = element.getBoundingClientRect();
        let x: number = e.pageX - offset.left;
        let y: number = e.pageY - offset.top;
        let diameter: number = Math.min(offset.height, offset.width, 100);

        let container: any = document.createElement("div");
        container.setAttribute("class", "wave-container");
        element.appendChild(container);
        let wave: any = document.createElement("div");
        wave.setAttribute("class", "wave");
        wave.style.backgroundColor = this.getAttribute(element.getAttribute("wave-color"));
        wave.style.width = diameter + "px";
        wave.style.height = diameter + "px";
        wave.style.top = y - (diameter / 2) + "px";
        wave.style.left = x - (diameter / 2) + "px";
        container.appendChild(wave);

        setTimeout(function() {
          element.removeChild(container);
        }, 2000);
      }
    }

    private getAttribute(attribute: string): string {
      return attribute || "#FFFFFF";
    }
  }
}
