import { Drawing } from "../draw.ts";
import {
  decomposeDirection,
  MorphXDirection,
  MorphYDirection,
} from "./direction.ts";
import { MorphOptions } from "./types.ts";
import { lerp } from "../helpers.ts";
import { applyMappingWithOptions } from "../mapping.ts";
import {
  Neighborhood,
  scrollSampleNeighborhood,
} from "../helpers/scrollSample.ts";

const vertNeighborhood: Neighborhood = [0, 2, 0, 0, 1, 0, 0, 2, 0];
const horzNeighborhood: Neighborhood = [0, 0, 0, 2, 1, 2, 0, 0, 0];
const diagNeighborhood: Neighborhood = [2, 0, 2, 0, 1, 0, 2, 0, 2];

export function scroll(
  d1: Readonly<Drawing>,
  d2: Readonly<Drawing>,
  w: number,
  h: number,
  phase: number,
  { direction, mapping1, mapping2, mapping3 }: MorphOptions,
) {
  const out: Drawing = [];
  const [xd, yd] = decomposeDirection(direction);
  const ph1 = applyMappingWithOptions(mapping1, phase);
  const ph2 = applyMappingWithOptions(mapping2, phase);
  const neighborhood =
    xd != MorphXDirection.None
      ? yd != MorphYDirection.None
        ? diagNeighborhood
        : horzNeighborhood
      : vertNeighborhood;
  for (let y = 0; y < h; y++) {
    const row: boolean[] = [];
    const yPhase = lerp(ph1, ph2, applyMappingWithOptions(mapping3, y / h));

    for (let x = 0; x < w; x++) {
      let sx = x,
        sy = y;
      const xPhase = lerp(ph1, ph2, applyMappingWithOptions(mapping3, x / w));

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
      row.push(scrollSampleNeighborhood(d1, d2, sx, sy, w, h, neighborhood));
    }
    out.push(row);
  }
  return out;
}
