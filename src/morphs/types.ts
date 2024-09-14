import { Drawing, Size } from "../draw.ts";
import { MorphDirection } from "./direction.ts";

export type Morpher = (
  d1: Readonly<Drawing>,
  d2: Readonly<Drawing>,
  size: Size,
  direction: MorphDirection,
  phase: number,
) => Drawing;
