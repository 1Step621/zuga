import { JSX, Show } from "solid-js";
import { Props } from "../props";
import { WorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { propsExcluded } from "./utils";

export const Text = (
  props: {
    points: WorldPos[];
    props: Props<"text">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.text(props.points);
  const verticalAlign = () => {
    switch (props.props.verticalAlign) {
      case "top":
        return "text-before-edge";
      case "middle":
        return "central";
      case "bottom":
        return "text-after-edge";
    }
  };
  return (
    <text
      x={shape().position.x}
      y={shape().position.y}
      font-size={props.props.fontSize + "px"}
      fill={props.props.color}
      text-anchor={props.props.align}
      dominant-baseline={verticalAlign() as any}
      {...propsExcluded(props)}
    >
      {props.props.content}
    </text>
  );
};
