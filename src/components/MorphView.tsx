import { Font } from "bdfparser/dist/types";
import cx from "clsx";
import React from "react";
import { z } from "zod";

import { addRows, draw, trimEmptyRows } from "../draw.ts";
import {
  useCSSVariableDefinitionOnRootEffect,
  useInterval,
  usePersistedZodSchemaState,
} from "../hooks.ts";
import {
  MappingNameWithOptions,
  mappingNameWithOptionsToMappingWithOptions,
} from "../mapping.ts";
import { MorphDirection } from "../morphs/direction.ts";
import { morph } from "../morphs/morph.ts";
import {
  getDefaultMorpherName,
  getMorpher,
  getMorpherNames,
} from "../morphs/registry.ts";
import { MorphOptions } from "../morphs/types.ts";
import { DirectionWidget } from "./DirectionWidget.tsx";
import { Display } from "./Display.tsx";
import { MappingSelect } from "./MappingSelect.tsx";

const ORANGE = "#e05d17";

const defaultMapping: MappingNameWithOptions = {
  name: "linear",
  invertIn: false,
  invertOut: false,
};

const MappingNameWithOptionsSchema = z.object({
  name: z.string(),
  invertIn: z.boolean(),
  invertOut: z.boolean(),
});

const MorphStateSchema = z.object({
  text1: z.string(),
  text2: z.string(),
  style: z.string(),
  direction: z.nativeEnum(MorphDirection),
  speed: z.number().default(30),
  stayStart: z.number().default(0),
  stayEnd: z.number().default(0),
  mapping1: MappingNameWithOptionsSchema.default(defaultMapping),
  mapping2: MappingNameWithOptionsSchema.default(defaultMapping),
  mapping3: MappingNameWithOptionsSchema.default(defaultMapping),
  pingpong: z.boolean().default(false),
  color: z.string().default(ORANGE),
});
const defaultMorphState = MorphStateSchema.parse({
  text1: "19",
  text2: "20",
  style: getDefaultMorpherName(),
  direction: MorphDirection.Down,
  speed: 30,
  stayStart: 0,
  stayEnd: 0,
  mapping1: defaultMapping,
  mapping2: defaultMapping,
  mapping3: defaultMapping,
  pingpong: false,
  color: ORANGE,
});

function MappingUpdateWidget({
  mapping,
  setMapping,
}: {
  mapping: MappingNameWithOptions;
  setMapping: (m: MappingNameWithOptions) => void;
}) {
  return (
    <MappingSelect
      value={mapping.name}
      setValue={(name) => setMapping({ ...mapping, name })}
      invertIn={mapping.invertIn}
      setInvertIn={(invertIn) => setMapping({ ...mapping, invertIn })}
      invertOut={mapping.invertOut}
      setInvertOut={(invertOut) => setMapping({ ...mapping, invertOut })}
    />
  );
}

function addStay(
  value: number,
  stayStart: number = 0,
  stayEnd: number = 0,
): number {
  if (value < stayStart) {
    return 0;
  }
  if (value > 1 - stayEnd) {
    return 1;
  }
  return (value - stayStart) / (1 - stayStart - stayEnd);
}

export function MorphView({ font }: { font: Font }) {
  const [state, setState] = usePersistedZodSchemaState(
    "hissisi.state.v1",
    MorphStateSchema,
    defaultMorphState,
  );

  const [increment, setIncrement] = React.useState(0);
  const [showDebug, setShowDebug] = React.useState(false);
  const {
    color,
    direction,
    mapping1,
    mapping2,
    mapping3,
    pingpong,
    speed,
    stayStart,
    stayEnd,
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
  React.useEffect(() => {
    if (increment && rawPhase % 100 === 99) {
      setState((s) => {
        const targetNum = Number.parseInt(s.text1, 10) || 0;
        return {
          ...s,
          text1: (targetNum + increment).toString(),
          text2: (targetNum + increment * 2).toString(),
        };
      });
    }
  }, [rawPhase, increment, setState]);
  const phase = pingpong
    ? Math.abs((rawPhase % 200) - 100) / 100
    : (rawPhase % 100) / 100;
  const morphDrawing = React.useMemo(() => {
    const phaseWithStay = Math.min(1, addStay(phase, stayStart, stayEnd));
    const opts: MorphOptions = {
      direction,
      mapping1: mappingNameWithOptionsToMappingWithOptions(mapping1!),
      mapping2: mappingNameWithOptionsToMappingWithOptions(mapping2!),
      mapping3: mappingNameWithOptionsToMappingWithOptions(mapping3!),
    };
    return morph(drawing1, drawing2, phaseWithStay, style, opts);
  }, [
    direction,
    drawing1,
    drawing2,
    phase,
    stayStart,
    stayEnd,
    style,
    mapping1,
    mapping2,
    mapping3,
  ]);
  useInterval(() => setRawPhase((r) => r + 1), 1000 / (speed ?? 30));
  const currentMorpher = React.useMemo(() => getMorpher(style), [style]);
  useCSSVariableDefinitionOnRootEffect("--color-dot", color ?? ORANGE);

  const nMappings = currentMorpher?.supportsMappings ?? 0;
  return (
    <>
      <div className="flex flex-col w-80 p-2 text-sm">
        <progress
          value={phase}
          max={1}
          className="w-full h-4 my-2 [&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-value]:bg-violet-400 [&::-moz-progress-bar]:bg-violet-400"
        />
        <div className="grid grid-cols-[1fr_2fr] gap-y-2 items-center">
          <label>Text 1</label>
          <input
            type="text"
            value={text1}
            onChange={(e) => setState((s) => ({ ...s, text1: e.target.value }))}
          />
          <label>Text 2</label>
          <input
            type="text"
            value={text2}
            onChange={(e) => setState((s) => ({ ...s, text2: e.target.value }))}
          />
          <label>Increment</label>
          <div className="grid grid-cols-3 gap-px">
            <button
              onClick={() => setIncrement(-1)}
              className={cx(
                "p-2",
                "border-1",
                increment < 0 ? "!bg-blue-500" : "bg-slate-700",
                "hover:bg-slate-600",
              )}
            >
              ⬇️
            </button>
            <button
              onClick={() => setIncrement(0)}
              className={cx(
                "p-2",
                "border-1",
                increment === 0 ? "!bg-blue-500" : "bg-slate-700",
                "hover:bg-slate-600",
              )}
            >
              ⏹️
            </button>
            <button
              onClick={() => setIncrement(1)}
              className={cx(
                "p-2",
                "border-1",
                increment > 0 ? "!bg-blue-500" : "bg-slate-700",
                "hover:bg-slate-600",
              )}
            >
              ⬆️
            </button>
          </div>
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
          <div className="grid grid-cols-2">
            <input
              type="range"
              value={stayStart}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  stayStart: Math.min(e.target.valueAsNumber, 0.75),
                }))
              }
              min={0}
              max={1}
              step={0.01}
            />
            <input
              type="range"
              value={stayEnd}
              onChange={(e) =>
                setState((s) => ({
                  ...s,
                  stayEnd: Math.min(e.target.valueAsNumber, 0.75),
                }))
              }
              min={0}
              max={1}
              step={0.01}
              className="scale-[-1]"
            />
          </div>
          <label>Pingpong</label>
          <label>
            <input
              type="checkbox"
              checked={pingpong}
              onChange={(e) =>
                setState((s) => ({ ...s, pingpong: e.target.checked }))
              }
            />{" "}
            Everyday I'm pingponging
          </label>
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
        <DirectionWidget
          direction={direction}
          setDirection={(direction) => setState((s) => ({ ...s, direction }))}
        />
        <div className="flex flex-col gap-2 py-2">
          {nMappings > 0 ? (
            <div>
              <b>{currentMorpher?.mapping1Name ?? "Mapping 1"}</b>
              <MappingUpdateWidget
                mapping={mapping1!}
                setMapping={(mapping1) => setState((s) => ({ ...s, mapping1 }))}
              />
            </div>
          ) : null}
          {nMappings > 1 ? (
            <div>
              <b>{currentMorpher?.mapping2Name ?? "Mapping 2"}</b>
              <MappingUpdateWidget
                mapping={mapping2!}
                setMapping={(mapping2) => setState((s) => ({ ...s, mapping2 }))}
              />
            </div>
          ) : null}
          {nMappings > 2 ? (
            <div>
              <b>{currentMorpher?.mapping3Name ?? "Mapping 3"}</b>
              <MappingUpdateWidget
                mapping={mapping3!}
                setMapping={(mapping3) => setState((s) => ({ ...s, mapping3 }))}
              />
            </div>
          ) : null}
        </div>
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
