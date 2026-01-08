import { JSX, Show, For } from "solid-js";
import { Props } from "../props";
import { WorldPos, asWorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { propsExcluded } from "./utils";

export const Gate = (
  props: {
    points: WorldPos[];
    props: Props<"gate">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.gate(props.points);

  const renderComponent = () => {
    const points = shape().points;
    if (points.length < 2) return null;
    const p0 = points[0]; // Input side
    const p1 = points[1]; // Output side

    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const dist = Math.max(Math.hypot(dx, dy), 40);
    const angle = Math.atan2(dy, dx);

    const strokeWidth = props.props.strokeWidth;
    const color = props.props.color;
    const type = props.props.type;

    const w = 30; // gate width
    const h = 30; // gate height

    return (
      <g
        transform={`translate(${(p0.x + p1.x) / 2}, ${(p0.y + p1.y) / 2}) rotate(${(angle * 180) / Math.PI})`}
        fill="none"
        stroke={color}
        stroke-width={strokeWidth}
      >
        {/* Output lead */}
        <line x1={w / 2} y1="0" x2={dist / 2} y2="0" />

        {/* Input leads */}
        <Show when={type === "not"}>
          <line x1={-dist / 2} y1="0" x2={-w / 2} y2="0" />
        </Show>
        <Show when={type !== "not"}>
          <line x1={-dist / 2} y1={-h / 4} x2={-w / 2} y2={-h / 4} />
          <line x1={-dist / 2} y1={h / 4} x2={-w / 2} y2={h / 4} />
        </Show>

        <g transform={`translate(${-w / 2}, 0)`}>
          <Show when={type === "and" || type === "nand"}>
            <path
              d={`M 0 ${-h / 2} L 0 ${h / 2} L ${w / 2} ${h / 2} A ${w / 2} ${h / 2} 0 0 0 ${w / 2} ${-h / 2} Z`}
            />
            <Show when={type === "nand"}>
              <circle cx={w + 3} cy="0" r="3" fill="white" />
            </Show>
          </Show>
          <Show when={type === "or" || type === "nor"}>
            <path
              d={`M 0 ${-h / 2} Q ${w / 4} 0 0 ${h / 2} C ${w / 2} ${h / 2} ${w} 0 ${w} 0 C ${w} 0 ${w / 2} ${-h / 2} 0 ${-h / 2} Z`}
            />
            <Show when={type === "nor"}>
              <circle cx={w + 3} cy="0" r="3" fill="white" />
            </Show>
          </Show>
          <Show when={type === "not"}>
            <path d={`M 0 ${-h / 2} L ${w * 0.8} 0 L 0 ${h / 2} Z`} />
            <circle cx={w * 0.8 + 3} cy="0" r="3" fill="white" />
          </Show>
          <Show when={type === "xor"}>
            <path d={`M ${-5} ${-h / 2} Q 0 0 ${-5} ${h / 2}`} />
            <path
              d={`M 0 ${-h / 2} Q ${w / 4} 0 0 ${h / 2} C ${w / 2} ${h / 2} ${w} 0 ${w} 0 C ${w} 0 ${w / 2} ${-h / 2} 0 ${-h / 2} Z`}
            />
          </Show>
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
