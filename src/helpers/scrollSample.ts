import { Drawing } from "../draw.ts";
type Trit = 0 | 1 | 2; // 0: void, 1: d1, 2: d2
export type Neighborhood = [
  Trit,
  Trit,
  Trit,
  Trit,
  Trit,
  Trit,
  Trit,
  Trit,
  Trit,
];

export function scrollSampleInfinite(
  d1: Readonly<Drawing>,
  d2: Readonly<Drawing>,
  x: number,
  y: number,
  w: number,
  h: number,
): boolean {
  if (x < 0 || y < 0 || x >= w || y >= h) {
    while (y < 0) y += h;
    while (x < 0) x += w;
    return d2[y % h]?.[x % w] ?? false;
  }
  return d1[y]?.[x] ?? false;
}

export function scrollSampleNeighborhood(
  d1: Readonly<Drawing>,
  d2: Readonly<Drawing>,
  x: number,
  y: number,
  w: number,
  h: number,
  neighborhood: Neighborhood,
): boolean {
  // Determine which cell in the 3x3 neighborhood we're in
  const cellX = Math.floor(x / w) + 1;
  const cellY = Math.floor(y / h) + 1;

  if (cellX < 0 || cellX > 2 || cellY < 0 || cellY > 2) {
    return false; // Outside the 3x3 neighborhood, treat as void
  }

  const drawingType = neighborhood[cellY * 3 + cellX];
  const normalizedX = ((x % w) + w) % w;
  const normalizedY = ((y % h) + h) % h;

  switch (drawingType) {
    case 1:
      return d1![normalizedY]![normalizedX]!;
    case 2:
      return d2![normalizedY]![normalizedX]!;
    default:
      return false;
  }
}
