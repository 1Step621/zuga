import { JSX } from "solid-js";
import { Kind, OtherProps, ShapeProps } from "./props";
import { Dynamic } from "solid-js/web";

export const svgs: {
  [K in Kind]: (props: {
    shape: ShapeProps[K];
    other: OtherProps[K];
    selected?: boolean;
  }) => JSX.Element;
} = {
  rectangle: (props) => (
    <rect
      x={props.shape.x}
      y={props.shape.y}
      width={props.shape.width}
      height={props.shape.height}
      fill={props.other.color}
      stroke={props.selected ? "var(--color-cyan-500)" : props.other.strokeColor}
      stroke-width={props.other.strokeWidth}
    />
  ),
  ellipse: (props) => (
    <ellipse
      cx={props.shape.cx}
      cy={props.shape.cy}
      rx={props.shape.rx}
      ry={props.shape.ry}
      fill={props.other.color}
      stroke={props.selected ? "var(--color-cyan-500)" : props.other.strokeColor}
      stroke-width={props.other.strokeWidth}
    />
  ),
  line: (props) => (
    <polyline
      points={props.shape.points.map((pt) => `${pt.x},${pt.y}`).join(" ")}
      fill="none"
      stroke={props.selected ? "var(--color-cyan-500)" : props.other.color}
      stroke-width={props.other.strokeWidth}
    />
  ),
  text: (props) => (
    <text
      x={props.shape.x}
      y={props.shape.y}
      font-size={props.other.fontSize + "px"}
      fill={props.selected ? "var(--color-cyan-500)" : props.other.color}
    >
      {props.other.content}
    </text>
  ),
};

export const Svg = <K extends Kind>(props: {
  kind: K;
  shape: ShapeProps[K];
  other: OtherProps[K];
  selected?: boolean;
}): JSX.Element => {
  return (
    <Dynamic
      component={
        svgs[props.kind] as (props: {
          shape: ShapeProps[K];
          other: OtherProps[K];
          selected?: boolean;
        }) => JSX.Element
      }
      shape={props.shape as ShapeProps[K]}
      other={props.other as OtherProps[K]}
      selected={props.selected}
    />
  );
};
