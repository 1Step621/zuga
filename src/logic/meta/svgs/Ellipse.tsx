import { JSX, Show } from "solid-js";
import { Props } from "../props";
import { WorldPos, asWorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { getLabelPos, MultilineText, propsExcluded } from "./utils";

export const Ellipse = (
  props: {
    points: WorldPos[];
    props: Props<"ellipse">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.ellipse(props.points);
  const labelPos = () =>
    getLabelPos(
      {
        position: asWorldPos({
          x: shape().center.x - shape().radius.x,
          y: shape().center.y - shape().radius.y,
        }),
        size: { x: shape().radius.x * 2, y: shape().radius.y * 2 },
      },
      props.props
    );
  return (
    <g {...propsExcluded(props)}>
      <ellipse
        cx={shape().center.x}
        cy={shape().center.y}
        rx={shape().radius.x}
        ry={shape().radius.y}
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
