export function getRandomDigit() {
  return Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function mean(a: number, b: number): number {
  return (a + b) / 2;
}
