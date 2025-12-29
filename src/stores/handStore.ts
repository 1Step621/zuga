import { createStore } from "solid-js/store";
import { Hand } from "~/utilities/hand";
import { WorldPos } from "~/utilities/pos";
import { Kind } from "~/utilities/props";

export const handStore = createStore({
  mode: "draw",
  kind: "rectangle" as Kind,
  points: [] as WorldPos[],
} as Hand);
