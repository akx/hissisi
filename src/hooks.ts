import React from "react";
import { z } from "zod";

export function useInterval(callback: () => void, delay: number) {
  const savedCallback = React.useRef<() => void>(undefined);
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
    return;
  }, [delay]);
}

export function usePersistedZodSchemaState<T>(
  key: string,
  schema: z.ZodType<T>,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, rawSetState] = React.useState(() => {
    const item = globalThis.localStorage.getItem(key);
    return item ? schema.parse(JSON.parse(item)) : initialValue;
  });
  React.useEffect(() => {
    globalThis.localStorage.setItem(key, JSON.stringify(schema.parse(state)));
  }, [key, schema, state]);
  const setState = React.useCallback(
    (newState: React.SetStateAction<T>) => {
      rawSetState((oldState) => {
        return typeof newState === "function"
          ? schema.parse((newState as (x: T) => T)(oldState))
          : schema.parse(newState);
      });
    },
    [schema],
  );
  return [state, setState];
}

export function useCSSVariableDefinitionOnRootEffect(
  name: string,
  value: string,
): void {
  React.useEffect(() => {
    document.documentElement.style.setProperty(name, value);
  }, [name, value]);
}
