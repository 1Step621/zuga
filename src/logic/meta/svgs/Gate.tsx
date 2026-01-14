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
    const dist = Math.max(Math.hypot(dx, dy), 80);
    const angle = Math.atan2(dy, dx);

    const strokeWidth = props.props.strokeWidth;
    const color = props.props.color;
    const type = props.props.type;
    const leadStrokeWidth = props.props.leadStrokeWidth;

    const w = 45; // gate width
    const h = 30; // gate height
    const notW = (h * Math.sqrt(3)) / 2; // width for equilateral triangle with height h

    return (
      <g
        transform={`translate(${(p0.x + p1.x) / 2}, ${(p0.y + p1.y) / 2}) rotate(${(angle * 180) / Math.PI})`}
        fill="none"
        stroke={color}
        stroke-width={strokeWidth}
      >
        {/* Output lead */}
        <Show when={type === "not"}>
          <line x1={notW / 2} y1="0" x2={dist / 2} y2="0" stroke-width={leadStrokeWidth} />
        </Show>
        <Show when={type !== "not"}>
          <line x1={w / 2} y1="0" x2={dist / 2} y2="0" stroke-width={leadStrokeWidth} />
        </Show>

        {/* Input leads */}
        <Show when={type === "not"}>
          <line x1={-dist / 2} y1="0" x2={-notW / 2} y2="0" stroke-width={leadStrokeWidth} />
        </Show>
        <Show when={type === "and" || type === "nand"}>
          <line x1={-dist / 2} y1={-h / 4} x2={-w / 2} y2={-h / 4} stroke-width={leadStrokeWidth} />
          <line x1={-dist / 2} y1={h / 4} x2={-w / 2} y2={h / 4} stroke-width={leadStrokeWidth} />
        </Show>
        <Show when={type === "or" || type === "nor" || type === "xor"}>
          <line x1={-dist / 2} y1={-h / 4} x2={-w / 2 + w / 8 - 1} y2={-h / 4} stroke-width={leadStrokeWidth} />
          <line x1={-dist / 2} y1={h / 4} x2={-w / 2 + w / 8 - 1} y2={h / 4} stroke-width={leadStrokeWidth} />
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
            <g transform={`translate(${(w - notW) / 2}, 0)`}>
              <path d={`M 0 ${-h / 2} L ${notW} 0 L 0 ${h / 2} Z`} />
              <circle cx={notW + 3} cy="0" r="3" fill="white" />
            </g>
          </Show>
          <Show when={type === "xor"}>
            <path d={`M ${-w / 6} ${-h / 2} Q 0 0 ${-w / 6} ${h / 2}`} />
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
