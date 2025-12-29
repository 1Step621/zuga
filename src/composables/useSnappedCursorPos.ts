import { gridStore } from "~/stores/gridStore";
import { useCursorPos } from "./useCursorPos";
import { toWorldPos } from "~/utilities/pos";
import { createMemo } from "solid-js";

export const useSnappedCursorPos = () => {
  const cursorPos = useCursorPos();
  const [grid] = gridStore;

  const snappedCursorPos = createMemo(() => {
    return toWorldPos({
      x: Math.round(cursorPos().x / grid.width) * grid.width,
      y: Math.round(cursorPos().y / grid.height) * grid.height,
    });
  });

  return snappedCursorPos;
};
