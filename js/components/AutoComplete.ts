module pure {
  export class AutoComplete {

    public main: any;
    public input: any;
    public items: any;
    private max: number;
    private classItem: string;
    private words: Array<string>;

    constructor(options: any = {}) {
      if(!options.view) throw new Error("Necessario informar uma view");
      this.main = options.view.querySelector("[pure-autocomplete]");
      if(!this.main) throw new Error("Elemento nao encontrado!");
      this.input = this.main.querySelector("input");
      this.items = this.getItems();
      this.max = options.max || 4;
      this.classItem = options.classItem || '';
      this.words = options.words || [];
      this.startEvents();
    }

    private startEvents(): void {
      this.input.addEventListener("keyup", e => {
        this.removeItems();
        if(e.keyCode != 13 && this.input.value)
          this.setItems(this.input.value.toLowerCase());
      })
      window.addEventListener("click", e => {
        this.removeItems();
      })
    }

    private getItems() {
      let items: any = document.createElement("div");
      items.classList.add("items");
      this.main.appendChild(items);
      return items;
    }

    private removeItems(): void {
      let items: Array<any> = this.items.querySelectorAll("span");
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
          let item: any = document.createElement("span");
          item.classList.add(this.classItem);
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
