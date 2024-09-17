import { mean } from "../helpers.ts";
import { MorphDirection } from "./direction.ts";

export function getNormPhase(
  x: number,
  y: number,
  w: number,
  h: number,
  direction: MorphDirection,
  defaultValue = 0.5,
): number {
  switch (direction) {
    case MorphDirection.Up: {
      return 1 - y / h;
    }
    case MorphDirection.Left: {
      return 1 - x / w;
    }
    case MorphDirection.Down: {
      return y / h;
    }
    case MorphDirection.Right: {
      return x / w;
    }
    case MorphDirection.UpLeft: {
      return mean(1 - y / h, 1 - x / w);
    }
    case MorphDirection.UpRight: {
      return mean(1 - y / h, x / w);
    }
    case MorphDirection.DownLeft: {
      return mean(y / h, 1 - x / w);
    }
    case MorphDirection.DownRight: {
      return mean(y / h, x / w);
    }
    default: {
      return defaultValue;
    }
  }
}

export function getPixelPhaseWidth(
  direction: MorphDirection,
  width: number,
  height: number,
): number {
  switch (direction) {
    case MorphDirection.Up:
    case MorphDirection.Down: {
      return 1 / height;
    }
    case MorphDirection.Left:
    case MorphDirection.Right: {
      return 1 / width;
    }
    default: {
      return 1 / Math.min(width, height);
    }
  }
}
