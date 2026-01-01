import { JSX, splitProps } from "solid-js";
import { Kind } from "../kind";
import { Dynamic } from "solid-js/web";
import { Props } from "./props";
import { Content } from "../content";
import { WorldPos } from "~/utilities/pos";
import { prerenders } from "./prerenders";

const propsExcluded = (
  props: {
    points: WorldPos[];
    props: Props<Kind>;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  return splitProps(props, ["points", "props"])[1];
};

export const svgs: {
  [K in Kind]: (
    props: {
      points: WorldPos[];
      props: Props<K>;
    } & JSX.ShapeElementSVGAttributes<any>
  ) => JSX.Element;
} = {
  rectangle: (props) => {
    const shape = () => prerenders.rectangle(props.points);
    return (
      <rect
        x={shape().position.x}
        y={shape().position.y}
        width={shape().width}
        height={shape().height}
        fill={props.props.color}
        stroke={props.props.strokeColor}
        stroke-width={props.props.strokeWidth}
        {...propsExcluded(props)}
      />
    );
  },
  ellipse: (props) => {
    const shape = () => prerenders.ellipse(props.points);
    return (
      <ellipse
        cx={shape().center.x}
        cy={shape().center.y}
        rx={shape().rx}
        ry={shape().ry}
        fill={props.props.color}
        stroke={props.props.strokeColor}
        stroke-width={props.props.strokeWidth}
        {...propsExcluded(props)}
      />
    );
  },
  line: (props) => {
    const shape = () => prerenders.line(props.points);
    return (
      <polyline
        points={shape()
          .points.map((pt) => `${pt.x},${pt.y}`)
          .join(" ")}
        fill="none"
        stroke={props.props.color}
        stroke-width={props.props.strokeWidth}
        {...propsExcluded(props)}
      />
    );
  },
  text: (props) => {
    const shape = () => prerenders.text(props.points);
    return (
      <text
        x={shape().position.x}
        y={shape().position.y}
        font-size={props.props.fontSize + "px"}
        fill={props.props.color}
        {...propsExcluded(props)}
      >
        {props.props.content}
      </text>
    );
  },
};

const contentExcluded = <K extends Kind>(
  props: {
    content: Content<K>;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  return splitProps(props, ["content"])[1];
};

export const Svg = <K extends Kind>(
  props: {
    content: Content<K>;
  } & JSX.ShapeElementSVGAttributes<any>
): JSX.Element => {
  return (
    <Dynamic
      component={svgs[props.content.kind] as () => JSX.Element}
      points={props.content.points}
      props={props.content.props}
      {...contentExcluded(props)}
    />
  );
};
