import useSWR from "swr";
import bdf from "./Bm437_Nix8810_M15-16.bdf?raw";
import React from "react";
import { Font } from "bdfparser/dist/types";
import { addRows, draw, loadFontFromString, trimEmptyRows } from "./draw.ts";
import { Display } from "./components/Display.tsx";
import { useInterval, usePersistedZodSchemaState } from "./hooks.ts";
import { z } from "zod";
import { morph } from "./morphs/morph.ts";
import cx from "classnames";
import { MorphDirection } from "./morphs/direction.ts";
import { getDefaultMorpherName, getMorpherNames } from "./morphs/registry.ts";

const MorphStateSchema = z.object({
  text1: z.string(),
  text2: z.string(),
  style: z.string(),
  direction: z.nativeEnum(MorphDirection),
  speed: z.number().default(30),
  stay: z.number().default(0),
});

const defaultMorphState = MorphStateSchema.parse({
  text1: "19",
  text2: "20",
  style: getDefaultMorpherName(),
  direction: MorphDirection.Down,
  speed: 30,
  stay: 0,
});

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

function MorphView({ font }: { font: Font }) {
  const [state, setState] = usePersistedZodSchemaState(
    "state",
    MorphStateSchema,
    defaultMorphState,
  );
  const [showDebug, setShowDebug] = React.useState(false);
  const { text1, text2, style, direction, speed, stay } = state;
  const drawing1 = React.useMemo(
    () => addRows(trimEmptyRows(draw(font, text1)), 1),
    [font, text1],
  );
  const drawing2 = React.useMemo(
    () => addRows(trimEmptyRows(draw(font, text2)), 1),
    [font, text2],
  );
  const [phase, setPhase] = React.useState(0);
  const morphDrawing = React.useMemo(() => {
    const phaseWithStay = Math.min(1, phase / (100 * (1 - (stay ?? 0))));
    return morph(drawing1, drawing2, phaseWithStay, style, direction);
  }, [direction, drawing1, drawing2, phase, stay, style]);
  useInterval(() => setPhase((phase + 1) % 100), 1000 / (speed ?? 30));

  return (
    <div className="flex">
      <div className="flex flex-col w-80">
        <progress value={phase} max={100} className="w-full h-4 my-2" />
        <div className="grid grid-cols-2 gap-y-2">
          <label>Text 1</label>
          <input
            value={text1}
            onChange={(e) => setState((s) => ({ ...s, text1: e.target.value }))}
          />
          <label>Text 2</label>
          <input
            value={text2}
            onChange={(e) => setState((s) => ({ ...s, text2: e.target.value }))}
          />
          <label>Speed</label>
          <input
            type="range"
            value={speed}
            onChange={(e) =>
              setState((s) => ({ ...s, speed: e.target.valueAsNumber }))
            }
            min={1}
            max={500}
          />
          <label>Stay</label>
          <input
            type="range"
            value={stay}
            onChange={(e) =>
              setState((s) => ({ ...s, stay: e.target.valueAsNumber }))
            }
            min={0}
            max={1}
            step={0.01}
          />
        </div>

        <div className="grid grid-cols-2">
          {getMorpherNames().map((name) => (
            <label key={name} className="p-1 text-nowrap">
              <input
                type="radio"
                value={name}
                checked={style === name}
                onChange={() => setState((s) => ({ ...s, style: name }))}
              />
              {name}
            </label>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {directionButtons.map(([label, d]) => (
            <button
              key={d}
              onClick={() => setState((s) => ({ ...s, direction: d }))}
              className={cx("p-2", "border-1", {
                "bg-blue-500": d === direction,
              })}
            >
              {label}
            </button>
          ))}
        </div>
        <hr />
        <button onClick={() => setShowDebug((s) => !s)}>
          {showDebug ? "Hide" : "Show"} Debug
        </button>
      </div>
      <div className="grow flex">
        {showDebug ? <Display drawing={drawing1} /> : null}
        <Display drawing={morphDrawing} />
        {showDebug ? <Display drawing={drawing2} /> : null}
      </div>
    </div>
  );
}

function App() {
  const fontSWR = useSWR("font", () => loadFontFromString(bdf));
  const font = fontSWR.data;
  return font ? <MorphView font={font} /> : null;
}

export default App;
