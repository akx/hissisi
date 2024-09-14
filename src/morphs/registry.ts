import { Morpher, MorpherInfo, MorpherWithInfo } from "./types.ts";

const morphers: Map<string, MorpherWithInfo> = new Map();

const defaultMorpherInfo: MorpherInfo = { supportsEasings: 0 };

export function register(
  name: string,
  morpher: Morpher,
  info: Partial<MorpherInfo> = {},
) {
  const fullInfo: MorpherInfo = { ...defaultMorpherInfo, ...info };
  morphers.set(name, Object.assign(morpher, fullInfo));
}

export function getMorpher(name: string): MorpherWithInfo | undefined {
  return morphers.get(name);
}

export function getDefaultMorpherName(): string {
  const name = morphers.keys().next().value;
  if (!name) {
    throw new Error("No morphers registered");
  }
  return name;
}

export function getMorpherNames(): string[] {
  return Array.from(morphers.keys());
}
