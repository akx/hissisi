import { Drawing, Size } from "../draw.ts";
import { MorphDirection } from "./direction.ts";

export type Morpher = (
  d1: Readonly<Drawing>,
  d2: Readonly<Drawing>,
  size: Size,
  phase: number,
  opts: MorphOptions,
) => Drawing;

export interface MorphOptions {
  direction: MorphDirection;
  easing1: (t: number) => number;
  easing2: (t: number) => number;
}

export interface MorpherInfo {
  supportsEasings: boolean;
}

export type MorpherWithInfo = Morpher & MorpherInfo;
