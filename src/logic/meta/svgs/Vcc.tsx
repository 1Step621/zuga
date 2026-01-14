import { JSX, Show } from "solid-js";
import { Props } from "../props";
import { WorldPos, asWorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { propsExcluded } from "./utils";

export const Vcc = (
  props: {
    points: WorldPos[];
    props: Props<"vcc">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.vcc(props.points);

  const renderComponent = () => {
    const points = shape().points;
    if (points.length < 2) return null;
    const start = points[1];
    const end = points[0];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const deg = (angle * 180) / Math.PI;

    const strokeWidth = props.props.strokeWidth;
    const color = props.props.color;
    const leadStrokeWidth = props.props.leadStrokeWidth;

    return (
      <g
        transform={`translate(${start.x}, ${start.y}) rotate(${deg})`}
        fill="none"
        stroke={color}
        stroke-width={strokeWidth}
      >
        <line x1="0" y1="0" x2={dist} y2="0" stroke-width={leadStrokeWidth} />
        <line x1={dist} y1="-10" x2={dist} y2="10" />
      </g>
    );
  };

  return <g {...propsExcluded(props)}>{renderComponent()}</g>;
};
