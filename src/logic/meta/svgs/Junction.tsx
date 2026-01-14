import { JSX } from "solid-js";
import { Props } from "../props";
import { WorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { propsExcluded } from "./utils";

export const Junction = (
  props: {
    points: WorldPos[];
    props: Props<"junction">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.junction(props.points);

  const radius = 2;

  return (
    <g {...propsExcluded(props)}>
      <circle
        cx={shape().position.x}
        cy={shape().position.y}
        r={radius}
        fill={props.props.fill ? props.props.color : "white"}
        stroke={props.props.color}
        stroke-width={props.props.strokeWidth}
      />
    </g>
  );
};
