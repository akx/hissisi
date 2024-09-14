import { Morpher } from "./types.ts";

const morphers: Map<string, Morpher> = new Map();

export function register(name: string, morpher: Morpher) {
  morphers.set(name, morpher);
}

export function getMorpher(name: string): Morpher | undefined {
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
