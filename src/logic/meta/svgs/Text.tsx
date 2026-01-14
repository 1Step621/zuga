import { JSX, Show } from "solid-js";
import { Props } from "../props";
import { WorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { MultilineText, propsExcluded } from "./utils";

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
        return "hanging";
      case "middle":
        return "middle";
      case "bottom":
        return "auto";
    }
  };
  return (
    <MultilineText
      text={props.props.content}
      x={shape().position.x}
      y={shape().position.y}
      fontSize={props.props.fontSize}
      align={props.props.align}
      baseline={verticalAlign() as any}
      fill={props.props.color}
      propsExcluded={propsExcluded(props)}
    />
  );
};
