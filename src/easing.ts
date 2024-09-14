// Via https://github.com/streamich/ts-easing

export const easings = {
  linear: (t: number) => t,
  // quadratic: (t: number) => t * (-(t * t) * t + 4 * t * t - 6 * t + 4),
  // cubic: (t: number) => t * (4 * t * t - 9 * t + 6),
  inQuad: (t: number) => t * t,
  outQuad: (t: number) => t * (2 - t),
  inOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  inCubic: (t: number) => t * t * t,
  outCubic: (t: number) => --t * t * t + 1,
  inOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  inQuart: (t: number) => t * t * t * t,
  outQuart: (t: number) => 1 - --t * t * t * t,
  inOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  inQuint: (t: number) => t * t * t * t * t,
  outQuint: (t: number) => 1 + --t * t * t * t * t,
  inOutQuint: (t: number) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
  inSine: (t: number) => -Math.cos(t * (Math.PI / 2)) + 1,
  outSine: (t: number) => Math.sin(t * (Math.PI / 2)),
  inOutSine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  inExpo: (t: number) => Math.pow(2, 10 * (t - 1)),
  outExpo: (t: number) => -Math.pow(2, -10 * t) + 1,
  inOutExpo: (t: number) => {
    t /= 0.5;
    if (t < 1) return Math.pow(2, 10 * (t - 1)) / 2;
    t--;
    return (-Math.pow(2, -10 * t) + 2) / 2;
  },
  inCirc: (t: number) => -Math.sqrt(1 - t * t) + 1,
  outCirc: (t: number) => Math.sqrt(1 - (t = t - 1) * t),
  inOutCirc: (t: number) => {
    t /= 0.5;
    if (t < 1) return -(Math.sqrt(1 - t * t) - 1) / 2;
    t -= 2;
    return (Math.sqrt(1 - t * t) + 1) / 2;
  },
  halfsine: (t: number) => Math.sin(t * Math.PI),
  halfsineQuad: (t: number) => Math.pow(Math.sin(t * Math.PI), 2),
  halfsineSqrt: (t: number) => Math.sqrt(Math.sin(t * Math.PI)),
  tri: (t: number) => Math.abs(t - Math.floor(t + 0.5)),
} as const;

export const easingNames = Object.keys(easings) as ReadonlyArray<EasingType>;
export type EasingType = keyof typeof easings;

export interface EasingWithOptions {
  func: (t: number) => number;
  invert: boolean;
}

export function applyEasingWithOptions(
  { func, invert }: EasingWithOptions,
  t: number,
): number {
  return invert ? 1 - func(1 - t) : func(t);
}
