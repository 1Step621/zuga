import { JSX, Show } from "solid-js";
import { Props } from "../props";
import { WorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { propsExcluded } from "./utils";

export const Diode = (
  props: {
    points: WorldPos[];
    props: Props<"diode">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.diode(props.points);

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

    const leadStrokeWidth = props.props.leadStrokeWidth;

    const dWidth = 30;
    if (dist < dWidth) {
      return (
        <g transform={`translate(${p0.x}, ${p0.y}) rotate(${deg})`} fill="none" stroke={color} stroke-width={leadStrokeWidth}>
          <line x1="0" y1="0" x2={dist} y2="0" />
        </g>
      );
    }
    const margin = (dist - dWidth) / 2;

    return (
      <g
        transform={`translate(${p0.x}, ${p0.y}) rotate(${deg})`}
        fill="none"
        stroke={color}
        stroke-width={strokeWidth}
      >
        <line x1="0" y1="0" x2={margin} y2="0" stroke-width={leadStrokeWidth} />
        <path d={`M ${margin} -15 L ${margin + dWidth} 0 L ${margin} 15 Z`} fill="none" />
        <line x1={margin + dWidth} y1="-15" x2={margin + dWidth} y2="15" />
        <line x1={margin + dWidth} y1="0" x2={dist} y2="0" stroke-width={leadStrokeWidth} />
        <Show when={props.props.led}>
          <g transform={`translate(${margin + 10}, -18)`} stroke-width={leadStrokeWidth}>
            <g transform="rotate(26.5)">
              <line x1="12" y1="0" x2="0" y2="0" />
              <path d="M 4 -3 L 0 0 L 4 3" />
            </g>
            <g transform="translate(8, -4) rotate(26.5)">
              <line x1="12" y1="0" x2="0" y2="0" />
              <path d="M 4 -3 L 0 0 L 4 3" />
            </g>
          </g>
        </Show>
      </g>
    );
  };

  return (
    <g {...propsExcluded(props)}>
      {renderComponent()}
    </g>
  );
};
