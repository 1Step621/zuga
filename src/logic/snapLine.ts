import { WorldPos } from "../utilities/pos";

export type SnapVerticalLine = {
  type: "vertical";
  x: number;
  anchors: WorldPos[];
};
export type SnapHorizontalLine = {
  type: "horizontal";
  y: number;
  anchors: WorldPos[];
};
export type SnapLine = SnapVerticalLine | SnapHorizontalLine;
