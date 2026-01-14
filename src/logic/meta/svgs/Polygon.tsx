import { JSX, Show } from "solid-js";
import { Props } from "../props";
import { WorldPos, asWorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { getLabelPos, MultilineText, propsExcluded } from "./utils";

export const Polygon = (
  props: {
    points: WorldPos[];
    props: Props<"polygon">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.polygon(props.points);
  const labelPos = () => {
    const pts = shape().points;
    if (pts.length === 0)
      return {
        x: 0,
        y: 0,
        anchor: "middle" as const,
        baseline: "middle" as const,
      };
    const xMin = Math.min(...pts.map((p) => p.x));
    const xMax = Math.max(...pts.map((p) => p.x));
    const yMin = Math.min(...pts.map((p) => p.y));
    const yMax = Math.max(...pts.map((p) => p.y));
    return getLabelPos(
      {
        position: asWorldPos({ x: xMin, y: yMin }),
        size: { x: xMax - xMin, y: yMax - yMin },
      },
      props.props
    );
  };
  return (
    <g {...propsExcluded(props)}>
      <polygon
        points={shape()
          .points.map((pt) => `${pt.x},${pt.y}`)
          .join(" ")}
        fill={props.props.color}
        stroke={props.props.strokeColor}
        stroke-width={props.props.strokeWidth}
      />
      <Show when={props.props.label}>
        <MultilineText
          text={props.props.label!}
          x={labelPos().x}
          y={labelPos().y}
          fill={props.props.labelColor ?? "black"}
          fontSize={props.props.labelSize ?? 16}
          align={labelPos().anchor}
          baseline={labelPos().baseline}
        />
      </Show>
    </g>
  );
};
