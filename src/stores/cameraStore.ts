import { createStore } from "solid-js/store";
import { toWorldPos } from "../utilities/pos";

export const cameraStore = createStore({
  center: toWorldPos({ x: 0, y: 0 }),
  scale: 1,
});
