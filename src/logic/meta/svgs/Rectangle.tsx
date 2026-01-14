import { JSX, Show } from "solid-js";
import { Props } from "../props";
import { WorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { getLabelPos, MultilineText, propsExcluded } from "./utils";

export const Rectangle = (
  props: {
    points: WorldPos[];
    props: Props<"rectangle">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.rectangle(props.points);
  const labelPos = () =>
    getLabelPos(
      { position: shape().position, size: shape().size },
      props.props
    );
  return (
    <g {...propsExcluded(props)}>
      <rect
        x={shape().position.x}
        y={shape().position.y}
        width={shape().size.x}
        height={shape().size.y}
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
