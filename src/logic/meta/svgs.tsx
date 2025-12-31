import { JSX, splitProps } from "solid-js";
import { Kind } from "../kind";
import { Dynamic } from "solid-js/web";
import { ShapeProps } from "./shapeProps";
import { OtherProps } from "./otherProps";
import { Content } from "../content";

const propsExcluded = (
  props: {
    shapeProps: ShapeProps<Kind>;
    otherProps: OtherProps<Kind>;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  return splitProps(props, ["shapeProps", "otherProps"])[1];
};

export const svgs: {
  [K in Kind]: (
    props: {
      shapeProps: ShapeProps<K>;
      otherProps: OtherProps<K>;
    } & JSX.ShapeElementSVGAttributes<any>
  ) => JSX.Element;
} = {
  rectangle: (props) => (
    <rect
      x={props.shapeProps.x}
      y={props.shapeProps.y}
      width={props.shapeProps.width}
      height={props.shapeProps.height}
      fill={props.otherProps.color}
      stroke={props.otherProps.strokeColor}
      stroke-width={props.otherProps.strokeWidth}
      {...propsExcluded(props)}
    />
  ),
  ellipse: (props) => (
    <ellipse
      cx={props.shapeProps.cx}
      cy={props.shapeProps.cy}
      rx={props.shapeProps.rx}
      ry={props.shapeProps.ry}
      fill={props.otherProps.color}
      stroke={props.otherProps.strokeColor}
      stroke-width={props.otherProps.strokeWidth}
      {...propsExcluded(props)}
    />
  ),
  line: (props) => (
    <polyline
      points={props.shapeProps.points.map((pt) => `${pt.x},${pt.y}`).join(" ")}
      fill="none"
      stroke={props.otherProps.color}
      stroke-width={props.otherProps.strokeWidth}
      {...propsExcluded(props)}
    />
  ),
  text: (props) => (
    <text
      x={props.shapeProps.x}
      y={props.shapeProps.y}
      font-size={props.otherProps.fontSize + "px"}
      fill={props.otherProps.color}
      {...propsExcluded(props)}
    >
      {props.otherProps.content}
    </text>
  ),
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
      shapeProps={props.content.shapeProps}
      otherProps={props.content.otherProps}
      {...contentExcluded(props)}
    />
  );
};
