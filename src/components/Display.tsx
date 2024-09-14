import { Drawing } from "../draw.ts";

export function Display({ drawing }: { drawing: Readonly<Drawing> }) {
  return (
    <div className="display">
      {drawing.map((row, y) => (
        <div className="row" key={y} data-y={y}>
          {row.map((c, x) => (
            <div key={`${y}.${x}`} className={c ? "c on" : "c off"} />
          ))}
        </div>
      ))}
    </div>
  );
}
