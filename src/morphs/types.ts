import { Drawing, Size } from "../draw.ts";
import { MorphDirection } from "./direction.ts";
import { EasingWithOptions } from "../easing.ts";

export type Morpher = (
  d1: Readonly<Drawing>,
  d2: Readonly<Drawing>,
  size: Size,
  phase: number,
  opts: MorphOptions,
) => Drawing;

export interface MorphOptions {
  direction: MorphDirection;
  easing1: EasingWithOptions;
  easing2: EasingWithOptions;
  easing3: EasingWithOptions;
}

export interface MorpherInfo {
  supportsEasings: 0 | 1 | 2 | 3;
  easing1Name?: string;
  easing2Name?: string;
  easing3Name?: string;
}

export type MorpherWithInfo = Morpher & MorpherInfo;
