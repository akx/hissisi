import { MorphDirection } from "../morphs/direction.ts";
import cx from "classnames";

const directionButtons: [string, MorphDirection][] = [
  ["↖️", MorphDirection.UpLeft],
  ["⬆️", MorphDirection.Up],
  ["↗️", MorphDirection.UpRight],
  ["⬅️", MorphDirection.Left],
  ["⏹️", MorphDirection.None],
  ["➡️", MorphDirection.Right],
  ["↙️", MorphDirection.DownLeft],
  ["⬇️", MorphDirection.Down],
  ["↘️", MorphDirection.DownRight],
] as const;

export function DirectionWidget({
  direction,
  setDirection,
}: {
  direction: MorphDirection;
  setDirection: (d: MorphDirection) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-px">
      {directionButtons.map(([label, d]) => (
        <button
          key={d}
          onClick={() => setDirection(d)}
          className={cx(
            "p-2",
            "border-1",
            d === direction ? "!bg-blue-500" : "bg-slate-700",
            "hover:bg-slate-600",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
