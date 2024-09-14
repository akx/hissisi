import React from "react";
import { z } from "zod";

export function useInterval(callback: () => void, delay: number) {
  const savedCallback = React.useRef<() => void>();
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return undefined;
  }, [delay]);
}

export function usePersistedZodSchemaState<T>(
  key: string,
  schema: z.ZodType<T>,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, rawSetState] = React.useState(() => {
    const item = window.localStorage.getItem(key);
    return item ? schema.parse(JSON.parse(item)) : initialValue;
  });
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(schema.parse(state)));
  }, [key, schema, state]);
  const setState = React.useCallback(
    (newState: React.SetStateAction<T>) => {
      rawSetState((oldState) => {
        if (typeof newState === "function") {
          return schema.parse((newState as (x: T) => T)(oldState));
        } else {
          return schema.parse(newState);
        }
      });
    },
    [schema],
  );
  return [state, setState];
}
