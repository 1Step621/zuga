import { JSX, Show } from "solid-js";
import { Props } from "../props";
import { WorldPos, asWorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { propsExcluded } from "./utils";

export const Resistor = (
  props: {
    points: WorldPos[];
    props: Props<"resistor">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.resistor(props.points);

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

    const width = 50;
    if (dist < width) {
      return ComponentGroup(<line x1="0" y1="0" x2={dist} y2="0" stroke-width={leadStrokeWidth} />);
    }
    const margin = (dist - width) / 2;
    return ComponentGroup(
      <>
        <line x1="0" y1="0" x2={margin} y2="0" stroke-width={leadStrokeWidth} />
        <rect
          x={margin}
          y="-10"
          width={width}
          height="20"
          fill="none"
          stroke={color}
          stroke-width={strokeWidth}
        />
        <Show when={props.props.variable}>
          <g transform={`translate(${margin + width / 2}, 0) rotate(45)`}>
            <line x1="-25" y1="0" x2="25" y2="0" stroke-width={strokeWidth} />
            <polyline points="15,-5 25,0 15,5" stroke-width={strokeWidth} />
          </g>
        </Show>
        <line x1={margin + width} y1="0" x2={dist} y2="0" stroke-width={leadStrokeWidth} />
      </>
    );
  };

  return (
    <g {...propsExcluded(props)}>
      {renderComponent()}
    </g>
  );
};
