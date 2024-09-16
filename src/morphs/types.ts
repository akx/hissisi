import { Drawing, Size } from "../draw.ts";
import { MorphDirection } from "./direction.ts";
import { MappingWithOptions } from "../mapping.ts";

export type Morpher = (
  d1: Readonly<Drawing>,
  d2: Readonly<Drawing>,
  size: Size,
  phase: number,
  opts: MorphOptions,
) => Drawing;

export interface MorphOptions {
  direction: MorphDirection;
  mapping1: MappingWithOptions;
  mapping2: MappingWithOptions;
  mapping3: MappingWithOptions;
}

export interface MorpherInfo {
  supportsMappings: 0 | 1 | 2 | 3;
  mapping1Name?: string;
  mapping2Name?: string;
  mapping3Name?: string;
}

export type MorpherWithInfo = Morpher & MorpherInfo;
