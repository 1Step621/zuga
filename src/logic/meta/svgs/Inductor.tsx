import { JSX, Show } from "solid-js";
import { Props } from "../props";
import { WorldPos, asWorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { propsExcluded } from "./utils";

export const Inductor = (
  props: {
    points: WorldPos[];
    props: Props<"inductor">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.inductor(props.points);

  const renderComponent = () => {
    const points = shape().points;
    if (points.length < 2) return null;
    const p0 = points[0];
    const p1 = points[1];
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const deg = (angle * 180) / Math.PI;

    const strokeWidth = props.props.strokeWidth;
    const color = props.props.color;

    const ComponentGroup = (children: JSX.Element) => (
      <g
        transform={`translate(${p0.x}, ${p0.y}) rotate(${deg})`}
        fill="none"
        stroke={color}
        stroke-width={strokeWidth}
      >
        {children}
      </g>
    );

    const leadStrokeWidth = props.props.leadStrokeWidth;

    const lWidth = 64;
    if (dist < lWidth) {
      return ComponentGroup(<line x1="0" y1="0" x2={dist} y2="0" stroke-width={leadStrokeWidth} />);
    }
    const lMargin = (dist - lWidth) / 2;
    return ComponentGroup(
      <>
        <line x1="0" y1="0" x2={lMargin} y2="0" stroke-width={leadStrokeWidth} />
        <path
          d={`M ${lMargin} 0
             A 8 8 0 0 1 ${lMargin + 16} 0
             A 8 8 0 0 1 ${lMargin + 32} 0
             A 8 8 0 0 1 ${lMargin + 48} 0
             A 8 8 0 0 1 ${lMargin + 64} 0`}
          fill="none"
          stroke-width={strokeWidth}
        />
        <line x1={lMargin + lWidth} y1="0" x2={dist} y2="0" stroke-width={leadStrokeWidth} />
      </>
    );
  };

  return (
    <g {...propsExcluded(props)}>
      {renderComponent()}
    </g>
  );
};
