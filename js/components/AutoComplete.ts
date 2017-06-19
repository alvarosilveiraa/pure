module pure {
  export class AutoComplete {

    public main: any;
    public input: any;
    public items: any;
    private max: number;
    private words: Array<string>;

    constructor(options: any = {}) {
      this.main = $("pure-autocomplete");
      this.input = this.main.querySelector("input");
      this.items = this.main.querySelector("items");
      this.max = options.max || 4;
      this.words = options.words || [];
    }

    public init(): void {
      this.input.addEventListener("keyup", e => {
        this.removeItems();
        if(this.input.value)
          this.setItems(this.input.value.toLowerCase());
      })

      window.addEventListener("click", e => {
        this.removeItems();
      })
    }

    private removeItems(): void {
      let items: Array<any> = this.items.querySelectorAll("item");
      for(let i = 0; i < items.length; i++) {
        this.items.removeChild(items[i]);
      }
    }

    private setItems(search: string): void {
      let filter: Array<string> = this.words.filter(word => {
        return new RegExp(search, 'i').test(word);
      })

      for(let i = 0; i < this.max; i++) {
        if(filter[i]) {
          let word: string = filter[i].toLowerCase();
          let item: any = document.createElement("item");
          item.innerHTML = word.replace(search, "<b>" + search + "</b>");
          item.addEventListener("click", e => {
            e.stopPropagation();
            this.input.value = word;
            this.input.focus();
            this.removeItems();
          })
          this.items.appendChild(item);
        }
      }
    }
  }
}
