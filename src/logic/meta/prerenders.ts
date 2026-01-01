import { asWorldPos, WorldPos } from "~/utilities/pos";
import { Kind } from "../kind";

export type Prerendered<K extends Kind> = {
  rectangle: {
    position: WorldPos;
    width: number;
    height: number;
  };
  ellipse: {
    center: WorldPos;
    rx: number;
    ry: number;
  };
  line: {
    points: WorldPos[];
  };
  text: {
    position: WorldPos;
  };
}[K];

export const prerenders: {
  [K in Kind]: (points: WorldPos[]) => Prerendered<K>;
} = {
  rectangle: (points) => {
    const [pt1, pt2] = points;
    return {
      position: asWorldPos({
        x: Math.min(pt1.x, pt2.x),
        y: Math.min(pt1.y, pt2.y),
      }),
      width: Math.abs(pt2.x - pt1.x),
      height: Math.abs(pt2.y - pt1.y),
    };
  },
  ellipse: (points) => {
    const [pt1, pt2] = points;
    return {
      center: asWorldPos({ x: (pt1.x + pt2.x) / 2, y: (pt1.y + pt2.y) / 2 }),
      rx: Math.abs(pt2.x - pt1.x) / 2,
      ry: Math.abs(pt2.y - pt1.y) / 2,
    };
  },
  line: (points) => {
    return {
      points: points,
    };
  },
  text: (points) => {
    const [pt1] = points;
    return {
      position: pt1,
    };
  },
};
