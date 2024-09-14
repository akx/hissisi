import { z } from "zod";

export function ZEnumSelectRadios<T>({
  enum: zenum,
  onChange,
  value,
  disabled,
}: {
  enum: z.EnumLike;
  value: T;
  onChange: (val: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 my-4">
      {Object.values(zenum).map((v) => (
        <label key={v}>
          <input
            type="radio"
            value={v}
            checked={v === value}
            onChange={() => onChange(v as T)}
            disabled={disabled}
          />
          {String(v)}
        </label>
      ))}
    </div>
  );
}
