import { easingNames, EasingType } from "../easing.ts";

type EasingSelectProps = {
  value: string | EasingType | undefined;
  setValue: (t: EasingType) => void;
  invert?: boolean;
  setInvert: (t: boolean) => void;
};

export function EasingSelect({
  value,
  setValue,
  invert,
  setInvert,
}: EasingSelectProps) {
  return (
    <div>
      <div className="grid grid-cols-4 text-xs">
        {easingNames.map((name) => (
          <label key={name} className="p-1 text-nowrap">
            <input
              type="radio"
              value={name}
              checked={value === name}
              onChange={() => setValue(name)}
            />
            {name}
          </label>
        ))}
      </div>
      <label>
        <input
          type="checkbox"
          checked={invert}
          onChange={(e) => setInvert(e.target.checked)}
        />
        Invert
      </label>
    </div>
  );
}
