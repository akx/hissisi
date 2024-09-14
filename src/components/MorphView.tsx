import { Font } from "bdfparser/dist/types";
import {
  useCSSVariableDefinitionOnRootEffect,
  useInterval,
  usePersistedZodSchemaState,
} from "../hooks.ts";
import React from "react";
import { addRows, draw, trimEmptyRows } from "../draw.ts";
import { morph } from "../morphs/morph.ts";
import {
  getDefaultMorpherName,
  getMorpher,
  getMorpherNames,
} from "../morphs/registry.ts";
import cx from "classnames";
import { Display } from "./Display.tsx";
import { MorphDirection } from "../morphs/direction.ts";
import { z } from "zod";
import { easingNames, easings, EasingType } from "../easing.ts";
import { MorphOptions } from "../morphs/types.ts";
import { EasingSelect } from "./EasingSelect.tsx";

const ORANGE = "#e05d17";
const MorphStateSchema = z.object({
  text1: z.string(),
  text2: z.string(),
  style: z.string(),
  direction: z.nativeEnum(MorphDirection),
  speed: z.number().default(30),
  stay: z.number().default(0),
  easing1: z.string().default("linear"),
  easing2: z.string().default("linear"),
  easing3: z.string().default("linear"),
  pingpong: z.boolean().default(false),
  color: z.string().default(ORANGE),
});
const defaultMorphState = MorphStateSchema.parse({
  text1: "19",
  text2: "20",
  style: getDefaultMorpherName(),
  direction: MorphDirection.Down,
  speed: 30,
  stay: 0,
  easing1: "linear",
  easing2: "linear",
  easing3: "linear",
  pingpong: false,
  color: ORANGE,
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

export function MorphView({ font }: { font: Font }) {
  const [state, setState] = usePersistedZodSchemaState(
    "state",
    MorphStateSchema,
    defaultMorphState,
  );
  const [showDebug, setShowDebug] = React.useState(false);
  const {
    color,
    direction,
    easing1,
    easing2,
    easing3,
    pingpong,
    speed,
    stay,
    style,
    text1,
    text2,
  } = state;
  const drawing1 = React.useMemo(
    () => addRows(trimEmptyRows(draw(font, text1)), 1),
    [font, text1],
  );
  const drawing2 = React.useMemo(
    () => addRows(trimEmptyRows(draw(font, text2)), 1),
    [font, text2],
  );
  const [rawPhase, setRawPhase] = React.useState(0);
  const phase = pingpong
    ? Math.abs((rawPhase % 200) - 100) / 100
    : (rawPhase % 100) / 100;
  const morphDrawing = React.useMemo(() => {
    const phaseWithStay = Math.min(1, phase / (1 - (stay ?? 0)));
    const opts: MorphOptions = {
      direction,
      easing1: easings[easing1 as EasingType] ?? easings.linear,
      easing2: easings[easing2 as EasingType] ?? easings.linear,
      easing3: easings[easing3 as EasingType] ?? easings.linear,
    };
    return morph(drawing1, drawing2, phaseWithStay, style, opts);
  }, [
    direction,
    drawing1,
    drawing2,
    phase,
    stay,
    style,
    easing1,
    easing2,
    easing3,
  ]);
  useInterval(() => setRawPhase((r) => r + 1), 1000 / (speed ?? 30));
  const currentMorpher = React.useMemo(() => getMorpher(style), [style]);
  useCSSVariableDefinitionOnRootEffect("--color-dot", color ?? ORANGE);

  return (
    <>
      <div className="flex flex-col w-80 p-2">
        <progress value={phase} max={1} className="w-full h-4 my-2" />
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
          <label>Pingpong</label>
          <input
            type="checkbox"
            checked={pingpong}
            onChange={(e) =>
              setState((s) => ({ ...s, pingpong: e.target.checked }))
            }
          />
          <label>Color</label>
          <input
            type="color"
            value={state.color}
            onChange={(e) => setState((s) => ({ ...s, color: e.target.value }))}
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
        {currentMorpher?.supportsEasings ? (
          <>
            <div>
              <b>Easing 1</b>
              <EasingSelect
                value={easing1}
                setValue={(v) => setState((s) => ({ ...s, easing1: v }))}
              />
            </div>
            <div>
              <b>Easing 2</b>
              <EasingSelect
                value={easing2}
                setValue={(v) => setState((s) => ({ ...s, easing2: v }))}
              />
            </div>
            <div>
              <b>Easing 3</b>
              <EasingSelect
                value={easing3}
                setValue={(v) => setState((s) => ({ ...s, easing3: v }))}
              />
            </div>
          </>
        ) : null}
        <hr />
        <button onClick={() => setShowDebug((s) => !s)}>
          {showDebug ? "Hide" : "Show"} Debug
        </button>
      </div>
      <div className="grow flex flex-col">
        {showDebug ? <Display drawing={drawing1} /> : null}
        <Display drawing={morphDrawing} />
        {showDebug ? <Display drawing={drawing2} /> : null}
      </div>
    </>
  );
}
