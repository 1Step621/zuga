import { JSX, Show } from "solid-js";
import { Props } from "../props";
import { WorldPos, asWorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { propsExcluded } from "./utils";

export const Transistor = (
  props: {
    points: WorldPos[];
    props: Props<"transistor">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.transistor(props.points);

  const renderComponent = () => {
    const points = shape().points;
    if (points.length < 2) return null;
    const p0 = points[0];
    const p1 = points[1];

    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const dist = Math.max(Math.hypot(dx, dy), 40);
    const angle = Math.atan2(dy, dx);

    const strokeWidth = props.props.strokeWidth;
    const color = props.props.color;
    const leadStrokeWidth = props.props.leadStrokeWidth;
    const isNpn = props.props.type === "npn";
    const isPhoto = props.props.photo ?? false;

    return (
      <g
        transform={`translate(${(p0.x + p1.x) / 2}, ${(p0.y + p1.y) / 2}) rotate(${(angle * 180) / Math.PI + 90})`}
        fill="none"
        stroke={color}
        stroke-width={strokeWidth}
      >
        {/* Base lead */}
        <Show when={!isPhoto}>
          <line x1="-50" y1="0" x2="-20" y2="0" stroke-width={leadStrokeWidth} />
        </Show>
        {/* Base plate */}
        <line x1="-20" y1="-20" x2="-20" y2="20" stroke-width={strokeWidth * 2} />

        {/* Collector lead */}
        <path d={`M 0 ${-dist / 2} L 0 ${-20} L -20 -8`} stroke-width={leadStrokeWidth} />
        {/* Emitter lead */}
        <path d={`M 0 ${dist / 2} L 0 ${20} L -20 8`} stroke-width={leadStrokeWidth} />

        {/* Light arrows */}
        <Show when={isPhoto}>
          <g stroke-width={leadStrokeWidth}>
            <g transform="translate(-16, -30) rotate(40)">
              <line x1="-12" y1="0" x2="0" y2="0" />
              <path d="M -4 -3 L 0 0 L -4 3" />
            </g>
            <g transform="translate(-20, -24) rotate(40)">
              <line x1="-12" y1="0" x2="0" y2="0" />
              <path d="M -4 -3 L 0 0 L -4 3" />
            </g>
          </g>
        </Show>

        {/* Arrow for Emitter */}
        <Show when={isNpn}>
          <polygon
            points={`0,0 -4,8 4,8`}
            fill={color}
            transform={`translate(-2, 18) rotate(125)`}
          />
        </Show>
        <Show when={!isNpn}>
          <polygon
            points={`0,0 -4,8 4,8`}
            fill={color}
            transform={`translate(-20, 8) rotate(-55)`}
          />
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
