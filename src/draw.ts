import { $Font, type Font } from "bdfparser";

async function* getLines(text: string) {
  const lines = text.split("\n");
  for (const line of lines) {
    yield line;
  }
}

export type Drawing = boolean[][];
export type Size = [number, number];

export function draw(font: Font, digit: string): Drawing {
  const bitmap = font.draw(digit);
  return bitmap
    .todata(0)
    .split("\n")
    .map((l) => Array.from(l).map((c) => c == "1"));
}

export function loadFontFromString(bdf: string) {
  return $Font(getLines(bdf));
}

export function trimEmptyRows(drawing: Readonly<Drawing>): Readonly<Drawing> {
  const firstNonEmptyRow = drawing.findIndex((row) => row.some((c) => c));
  if (firstNonEmptyRow === -1) {
    return [];
  }
  let lastNonEmptyRow = drawing.length - 1;
  while (!drawing[lastNonEmptyRow]?.some((c) => c)) {
    lastNonEmptyRow--;
  }
  return drawing.slice(firstNonEmptyRow, lastNonEmptyRow + 1);
}

export function addRows(
  drawing: Readonly<Drawing>,
  rows: number,
): Readonly<Drawing> {
  const w = drawing[0]?.length ?? 0;
  return [...drawing, ...Array(rows).fill(Array(w).fill(false))];
}

export function getSize(drawing: Readonly<Drawing>): Size {
  return [drawing[0]?.length ?? 0, drawing.length];
}

export function maxSize(size1: Size, size2: Size): Size {
  const [w1, h1] = size1;
  const [w2, h2] = size2;
  return [Math.max(w1, w2), Math.max(h1, h2)];
}

export function ensureSize(drawing: Readonly<Drawing>, size: Size): Drawing {
  const [width, height] = size;
  const drawingWithCorrectWidth = drawing
    .slice(0, height)
    .map((row) => [
      ...row.slice(0, width),
      ...Array(width - row.length).fill(false),
    ]);
  while (drawingWithCorrectWidth.length < height) {
    drawingWithCorrectWidth.push(Array(width).fill(false));
  }
  return drawingWithCorrectWidth;
}

export function ensureSizes(
  drawing1: Readonly<Drawing>,
  drawing2: Readonly<Drawing>,
): [Readonly<Drawing>, Readonly<Drawing>, Size] {
  const size = maxSize(getSize(drawing1), getSize(drawing2));
  drawing1 = ensureSize(drawing1, size);
  drawing2 = ensureSize(drawing2, size);
  return [drawing1, drawing2, size];
}

export function pixelwise(
  drawing1: Readonly<Drawing>,
  drawing2: Readonly<Drawing>,
  op: (a: boolean, b: boolean, x: number, y: number) => boolean,
): Drawing {
  // NB: assumes drawings are the same size
  return drawing1.map((row, y) =>
    row.map((c1, x) => op(c1, drawing2[y]![x]!, x, y)),
  );
}
