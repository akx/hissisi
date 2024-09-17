import { Drawing } from "../draw.ts";

const commonClass = "size-4 m-0.5 rounded-full transition-all duration-[80ms]";
const onClass = `${commonClass} bg-[var(--color-dot)] shadow-[0_0_8px_var(--color-dot)]`;
const offClass = `${commonClass} bg-black`;

export function Display({ drawing }: { drawing: Readonly<Drawing> }) {
  return (
    <div className="display">
      {drawing.map((row, y) => (
        <div className="flex bg-neutral-950" key={y} data-y={y}>
          {row.map((c, x) => (
            <div key={`${y}.${x}`} className={c ? onClass : offClass} />
          ))}
        </div>
      ))}
    </div>
  );
}
