module pure {
  export interface iSlider {
    total: number;
    active: number;
    width: number;
    height: number;
    timer: number;
    sensitivity: number;
    init(): void;
    setPage(active: number): void;
  }
}
