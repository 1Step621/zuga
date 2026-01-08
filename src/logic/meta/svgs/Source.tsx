import { JSX, Show } from "solid-js";
import { Props } from "../props";
import { WorldPos, asWorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { propsExcluded } from "./utils";

export const Source = (
  props: {
    points: WorldPos[];
    props: Props<"source">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.source(props.points);

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

    const sWidth = 10;
    if (dist < sWidth * 2) {
      return ComponentGroup(<line x1="0" y1="0" x2={dist} y2="0" />);
    }
    const sMargin = (dist - sWidth) / 2;
    return ComponentGroup(
      <>
        <line x1="0" y1="0" x2={sMargin} y2="0" />
        <line x1={sMargin} y1="-15" x2={sMargin} y2="15" />
        <line x1={sMargin + sWidth} y1="-7.5" x2={sMargin + sWidth} y2="7.5" />
        <line x1={sMargin + sWidth} y1="0" x2={dist} y2="0" />
      </>
    );
  };

  return (
    <g {...propsExcluded(props)}>
      {renderComponent()}
    </g>
  );
};
