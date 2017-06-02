interface iSlider {
  total: number;
  width: number;
  height: number;
  active: number;
  timer: number;
  sensitivity: number;
  normalizeActive(active: number): void;
}
