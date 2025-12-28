import { WorldPos } from "./pos";

export type Kind = keyof ShapeProps | keyof OtherProps;
export const kinds: Kind[] = ["rectangle", "ellipse", "line", "text"];

export type ShapeProps = {
  "rectangle": { x: number; y: number; width: number; height: number; };
  "ellipse": { cx: number; cy: number; rx: number; ry: number; };
  "line": { points: WorldPos[]; };
  "text": { x: number; y: number; };
};

export type OtherProps = {
  "rectangle": { color: string; strokeColor: string; strokeWidth: number; };
  "ellipse": { color: string; strokeColor: string, strokeWidth: number; };
  "line": { color: string; strokeWidth: number; };
  "text": { content: string; fontSize: number; color: string; };
};

export const shapeProps: { [K in Kind]: (props: WorldPos[]) => ShapeProps[K] } = {
  "rectangle": (points: WorldPos[]) => {
    const x = Math.min(points[0].x, points[1].x);
    const y = Math.min(points[0].y, points[1].y);
    const width = Math.abs(points[1].x - points[0].x);
    const height = Math.abs(points[1].y - points[0].y);
    return { x, y, width, height };
  },
  "ellipse": (points: WorldPos[]) => {
    const x1 = points[0].x;
    const y1 = points[0].y;
    const x2 = points[1].x;
    const y2 = points[1].y;
    return { cx: (x1 + x2) / 2, cy: (y1 + y2) / 2, rx: Math.abs(x2 - x1) / 2, ry: Math.abs(y2 - y1) / 2 };
  },
  "line": (points: WorldPos[]) => {
    return { points };
  },
  "text": (points: WorldPos[]) => {
    return { x: points[0].x, y: points[0].y };
  },
};

export const shapeProp = <K extends Kind>(kind: K, points: WorldPos[]): ShapeProps[K] => {
  return shapeProps[kind](points);
}

export const defaultOtherProps: { [K in Kind]: OtherProps[K] } = {
  "rectangle": { color: "transparent", strokeColor: "black", strokeWidth: 2 },
  "ellipse": { color: "transparent", strokeColor: "black", strokeWidth: 2 },
  "line": { color: "black", strokeWidth: 2 },
  "text": { content: "Text", fontSize: 16, color: "black" },
};

export const defaultOtherProp = <K extends Kind>(kind: K): OtherProps[K] => {
  return defaultOtherProps[kind];
}
