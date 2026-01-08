import { splitProps } from "solid-js";
import { JSX } from "solid-js";
import { WorldPos } from "~/utilities/pos";
import { Props } from "../props";
import { Kind } from "../../kind";

export const getLabelPos = (
  shape: { position: WorldPos; size: { x: number; y: number } },
  props: { labelPlacement?: string },
  extraPadding: number = 0
) => {
  const p = props.labelPlacement ?? "center";
  const cx = shape.position.x + shape.size.x / 2;
  const cy = shape.position.y + shape.size.y / 2;
  const padding = 5 + extraPadding;
  switch (p) {
    case "top":
      return {
        x: cx,
        y: shape.position.y - padding,
        anchor: "middle" as const,
        baseline: "auto" as const,
      };
    case "bottom":
      return {
        x: cx,
        y: shape.position.y + shape.size.y + padding,
        anchor: "middle" as const,
        baseline: "hanging" as const,
      };
    case "left":
      return {
        x: shape.position.x - padding,
        y: cy,
        anchor: "end" as const,
        baseline: "middle" as const,
      };
    case "right":
      return {
        x: shape.position.x + shape.size.x + padding,
        y: cy,
        anchor: "start" as const,
        baseline: "middle" as const,
      };
    case "center":
    default:
      return {
        x: cx,
        y: cy,
        anchor: "middle" as const,
        baseline: "middle" as const,
      };
  }
};

export const propsExcluded = (
  props: {
    points: WorldPos[];
    props: Props<Kind>;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  return splitProps(props, ["points", "props"])[1];
};
