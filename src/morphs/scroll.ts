import { Drawing } from "../draw.ts";
import {
  decomposeDirection,
  MorphXDirection,
  MorphYDirection,
} from "./direction.ts";
import { MorphOptions } from "./types.ts";
import { lerp } from "../helpers.ts";

function scrollSample(
  d1: Readonly<Drawing>,
  d2: Readonly<Drawing>,
  x: number,
  y: number,
  w: number,
  h: number,
): boolean {
  // In this virtual coordinate space, there's one copy of d1 at (0,0),
  // and it's surrounded by copies of d2. Therefore, sampling at a negative X
  // or Y will sample from d2, as will sampling outside the bounds of d1 (w, h).
  if (x < 0 || y < 0 || x >= w || y >= h) {
    while (y < 0) y += h;
    while (x < 0) x += w;
    return d2[y % h]?.[x % w] ?? false;
  }
  return d1[y]?.[x] ?? false;
}

export function scroll(
  d1: Readonly<Drawing>,
  d2: Readonly<Drawing>,
  w: number,
  h: number,
  phase: number,
  { direction, easing1, easing2, easing3 }: MorphOptions,
) {
  const out: Drawing = [];
  const [xd, yd] = decomposeDirection(direction);
  const ph1 = easing1(phase);
  const ph2 = easing2(phase);
  for (let y = 0; y < h; y++) {
    const row: boolean[] = [];
    const yPhase = lerp(ph1, ph2, easing3(y / h));

    for (let x = 0; x < w; x++) {
      let sx = x,
        sy = y;
      const xPhase = lerp(ph1, ph2, easing3(x / w));

      if (yd === MorphYDirection.Up) {
        sy = y + Math.floor(xPhase * h);
      }
      if (yd === MorphYDirection.Down) {
        sy = y - Math.floor(xPhase * h);
      }
      if (xd === MorphXDirection.Left) {
        sx = x + Math.floor(yPhase * w);
      }
      if (xd === MorphXDirection.Right) {
        sx = x - Math.floor(yPhase * w);
      }
      row.push(scrollSample(d1, d2, sx, sy, w, h));
    }
    out.push(row);
  }
  return out;
}
