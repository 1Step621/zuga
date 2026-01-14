import { JSX } from "solid-js";
import { Props } from "../props";
import { WorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { propsExcluded } from "./utils";

export const OpAmp = (
  props: {
    points: WorldPos[];
    props: Props<"op_amp">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.op_amp(props.points);

  const renderComponent = () => {
    const points = shape().points;
    if (points.length < 2) return null;
    const p0 = points[0];
    const p1 = points[1];

    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const size = 75;
    const h = 90;
    const dist = Math.max(Math.hypot(dx, dy), size);
    const angle = Math.atan2(dy, dx);
    const deg = (angle * 180) / Math.PI;

    const strokeWidth = props.props.strokeWidth;
    const color = props.props.color;
    const leadStrokeWidth = props.props.leadStrokeWidth;

    // Center between p0 and p1
    const cx = (p0.x + p1.x) / 2;
    const cy = (p0.y + p1.y) / 2;

    return (
      <g
        transform={`translate(${cx}, ${cy}) rotate(${deg})`}
        fill="none"
        stroke={color}
        stroke-width={strokeWidth}
      >
        {/* Triangle body */}
        <path d={`M ${-size / 2} ${-h / 2} L ${size / 2} 0 L ${-size / 2} ${h / 2} Z`} />
        
        {/* Input leads */}
        <line x1={-dist / 2} y1={-h / 4} x2={-size / 2} y2={-h / 4} stroke-width={leadStrokeWidth} />
        <line x1={-dist / 2} y1={h / 4} x2={-size / 2} y2={h / 4} stroke-width={leadStrokeWidth} />
        
        {/* Output lead */}
        <line x1={size / 2} y1="0" x2={dist / 2} y2="0" stroke-width={leadStrokeWidth} />

        {/* Labels */}
        <g transform={`translate(${-size / 2 + 11}, ${-h / 4})`}>
          <line x1="-6" y1="0" x2="6" y2="0" stroke={color} stroke-width={strokeWidth} />
        </g>
        <g transform={`translate(${-size / 2 + 11}, ${h / 4})`}>
          <line x1="-6" y1="0" x2="6" y2="0" stroke={color} stroke-width={strokeWidth} />
          <line x1="0" y1="-6" x2="0" y2="6" stroke={color} stroke-width={strokeWidth} />
        </g>
      </g>
    );
  };

  return (
    <g {...propsExcluded(props)}>
      {renderComponent()}
    </g>
  );
};
