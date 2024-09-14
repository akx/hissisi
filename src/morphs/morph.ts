import { Drawing, ensureSizes, pixelwise } from "../draw.ts";
import { MorphDirection } from "./direction.ts";
import { scroll } from "./scroll.ts";
import { getNormPhase, getPixelPhaseWidth } from "./phase.ts";

export enum MorphStyle {
  Flicker = "flicker",
  Cover = "cover",
  CoverWithBorder = "coverWithBorder",
  Scroll = "scroll",
}

function morph2(
  d1: Readonly<Drawing>,
  d2: Readonly<Drawing>,
  [w, h]: [number, number],
  phase: number,
  style: MorphStyle,
  direction: MorphDirection,
) {
  if (phase < 0) {
    return d1;
  }
  if (phase >= 1) {
    return d2;
  }
  switch (style) {
    case MorphStyle.Flicker:
      return pixelwise(d1, d2, (c1, c2, x, y) =>
        Math.random() * getNormPhase(x, y, w, h, direction, 1) > phase
          ? c1
          : c2,
      );
    case MorphStyle.Cover:
      return pixelwise(d1, d2, (c1, c2, x, y) =>
        getNormPhase(x, y, w, h, direction) < phase ? c2 : c1,
      );
    case MorphStyle.CoverWithBorder: {
      const ppw = getPixelPhaseWidth(direction, w, h) / 2;
      return pixelwise(d1, d2, (c1, c2, x, y) => {
        const nph = getNormPhase(x, y, w, h, direction);
        if (Math.abs(nph - phase) < ppw) {
          return false;
        }
        return nph < phase ? c2 : c1;
      });
    }
    case MorphStyle.Scroll:
      return scroll(d1, d2, w, h, phase, direction);

    default:
      return d1;
  }
}

export function morph(
  drawing1: Readonly<Drawing>,
  drawing2: Readonly<Drawing>,
  phase: number,
  style: MorphStyle,
  direction: MorphDirection,
): Readonly<Drawing> {
  const [d1, d2, size] = ensureSizes(drawing1, drawing2);
  return morph2(d1, d2, size, phase, style, direction);
}
