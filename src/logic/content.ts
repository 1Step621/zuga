import { OtherProps } from "./meta/otherProps";
import { ShapeProps } from "./meta/shapeProps";
import { Kind } from "./kind";

export type Content<K extends Kind> = {
  [K in Kind]: {
    uuid: `${string}-${string}-${string}-${string}-${string}`;
    kind: K;
    shapeProps: ShapeProps<K>;
    otherProps: OtherProps<K>;
  };
}[K];
