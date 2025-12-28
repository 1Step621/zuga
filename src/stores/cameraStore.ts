import { createStore } from "solid-js/store";
import { WorldPos } from "../utilities/pos";

export const cameraStore = createStore({
  center: { x: 0, y: 0 } as WorldPos,
  scale: 1,
});
