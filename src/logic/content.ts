import { Props } from "./meta/props";
import { Kind } from "./kind";
import { WorldPos } from "~/utilities/pos";
import { Uuid } from "~/utilities/uuid";

export type Content<K extends Kind> = {
  [K in Kind]: {
    uuid: Uuid;
    kind: K;
    points: WorldPos[];
    props: Props<K>;
  };
}[K];
