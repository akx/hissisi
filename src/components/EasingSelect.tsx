import { easingNames, EasingType } from "../easing.ts";

export function EasingSelect({
  value,
  setValue,
}: {
  value: string | EasingType | undefined;
  setValue: (t: EasingType) => void;
}) {
  return (
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
  );
}
