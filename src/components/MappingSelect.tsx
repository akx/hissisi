import { mappingNames, mappings, MappingType } from "../mapping.ts";
import React from "react";

type MappingSelectProps = {
  value: string | MappingType | undefined;
  setValue: (t: MappingType) => void;
  invertIn: boolean;
  setInvertIn: (t: boolean) => void;
  invertOut: boolean;
  setInvertOut: (t: boolean) => void;
};

function MappingPreview({
  name,
  className,
  width = 100,
  height = 60,
  res = 20,
}: {
  name: MappingType;
  className?: string;
  width?: number;
  height?: number;
  res?: number;
}) {
  const mapping = mappings[name];
  if (!mapping) return <>{name}</>;
  const heightSansMargin = height - 1;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className}>
      <polyline
        points={Array.from(
          { length: res },
          (_, i) =>
            `${(i / (res - 1)) * width},${height - mapping(i / (res - 1)) * heightSansMargin}`,
        ).join(" ")}
        fill="none"
        stroke="currentColor"
      ></polyline>
    </svg>
  );
}

export function MappingSelect({
  value,
  setValue,
  invertIn,
  setInvertIn,
  invertOut,
  setInvertOut,
}: MappingSelectProps) {
  return (
    <div>
      <div className="grid grid-cols-4 text-xs">
        {mappingNames.map((name) => (
          <label key={name} className="p-1 text-nowrap" title={name}>
            <input
              type="radio"
              value={name}
              checked={value === name}
              onChange={() => setValue(name)}
            />
            <MappingPreview
              name={name}
              width={40}
              height={20}
              className="w-8 h-4 inline"
            />
          </label>
        ))}
      </div>
      <div className="grid grid-cols-2">
        <label>
          <input
            type="checkbox"
            checked={invertIn}
            onChange={(e) => setInvertIn(e.target.checked)}
          />{" "}
          Invert In
        </label>
        <label>
          <input
            type="checkbox"
            checked={invertOut}
            onChange={(e) => setInvertOut(e.target.checked)}
          />{" "}
          Invert Out
        </label>
      </div>
    </div>
  );
}
