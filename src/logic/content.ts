import { Props } from "./meta/props";
import { Kind } from "./kind";
import { WorldPos } from "~/utilities/pos";

export type Content<K extends Kind> = {
  [K in Kind]: {
    uuid: `${string}-${string}-${string}-${string}-${string}`;
    kind: K;
    points: WorldPos[];
    props: Props<K>;
  };
}[K];
