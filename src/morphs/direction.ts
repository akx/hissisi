export enum MorphDirection {
  None = "none",
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
  UpLeft = "upLeft",
  UpRight = "upRight",
  DownLeft = "downLeft",
  DownRight = "downRight",
}

export enum MorphXDirection {
  None = "none",
  Left = "left",
  Right = "right",
}

export enum MorphYDirection {
  None = "none",
  Up = "up",
  Down = "down",
}

export function decomposeDirection(
  direction: MorphDirection,
): [MorphXDirection, MorphYDirection] {
  switch (direction) {
    case MorphDirection.None:
      return [MorphXDirection.None, MorphYDirection.None];
    case MorphDirection.Up:
      return [MorphXDirection.None, MorphYDirection.Up];
    case MorphDirection.Down:
      return [MorphXDirection.None, MorphYDirection.Down];
    case MorphDirection.Left:
      return [MorphXDirection.Left, MorphYDirection.None];
    case MorphDirection.Right:
      return [MorphXDirection.Right, MorphYDirection.None];
    case MorphDirection.UpLeft:
      return [MorphXDirection.Left, MorphYDirection.Up];
    case MorphDirection.UpRight:
      return [MorphXDirection.Right, MorphYDirection.Up];
    case MorphDirection.DownLeft:
      return [MorphXDirection.Left, MorphYDirection.Down];
    case MorphDirection.DownRight:
      return [MorphXDirection.Right, MorphYDirection.Down];
  }
}
