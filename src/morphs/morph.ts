import { Drawing, ensureSizes, pixelwise } from "../draw.ts";
import { scroll } from "./scroll.ts";
import { getNormPhase, getPixelPhaseWidth } from "./phase.ts";
import { getMorpher, register } from "./registry.ts";
import { MorphOptions } from "./types.ts";

register("Flicker", (d1, d2, [w, h], phase, { direction }) =>
  pixelwise(d1, d2, (c1, c2, x, y) =>
    Math.random() * getNormPhase(x, y, w, h, direction, 1) > phase ? c1 : c2,
  ),
);

register("Cover", (d1, d2, [w, h], phase, { direction }) =>
  pixelwise(d1, d2, (c1, c2, x, y) =>
    getNormPhase(x, y, w, h, direction) < phase ? c2 : c1,
  ),
);

register("CoverWithBorder", (d1, d2, [w, h], phase, { direction }) => {
  const ppw = getPixelPhaseWidth(direction, w, h) / 2;
  return pixelwise(d1, d2, (c1, c2, x, y) => {
    const nph = getNormPhase(x, y, w, h, direction);
    if (Math.abs(nph - phase) < ppw) {
      return false;
    }
    return nph < phase ? c2 : c1;
  });
});

register(
  "Scroll",
  (d1, d2, [w, h], phase, opts) => scroll(d1, d2, w, h, phase, opts),
  { supportsEasings: true },
);

export function morph(
  drawing1: Readonly<Drawing>,
  drawing2: Readonly<Drawing>,
  phase: number,
  style: string,
  opts: MorphOptions,
): Readonly<Drawing> {
  const [d1, d2, size] = ensureSizes(drawing1, drawing2);
  const morpher = getMorpher(style);
  if (phase < 0 || !morpher) {
    return d1;
  }
  if (phase >= 1) {
    return d2;
  }
  return morpher(d1, d2, size, phase, opts);
}
