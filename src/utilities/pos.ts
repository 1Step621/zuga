const screenSymbol = Symbol();
const worldSymbol = Symbol();

export type ScreenPos = { x: number; y: number } & { [screenSymbol]: unknown };
export type WorldPos = { x: number; y: number } & { [worldSymbol]: unknown };

export const toScreenPos = (pos: { x: number; y: number }): ScreenPos => {
  return pos as ScreenPos;
};

export const toWorldPos = (pos: { x: number; y: number }): WorldPos => {
  return pos as WorldPos;
};
