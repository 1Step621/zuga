import { gridStore } from "~/stores/gridStore";
import { useCursorPos } from "./useCursorPos";
import { asWorldPos } from "~/utilities/pos";
import { createMemo } from "solid-js";
import { worldToScreen } from "~/utilities/coordinate";
import { cameraStore } from "~/stores/cameraStore";
import { useWindowSize } from "./useWindowSize";

export const useSnappedCursorPos = () => {
  const cursorPos = useCursorPos();
  const windowSize = useWindowSize();
  const [camera] = cameraStore;
  const [grid] = gridStore;

  const world = createMemo(() => {
    const gridSnapped = asWorldPos({
      x: Math.round(cursorPos.world().x / grid.width) * grid.width,
      y: Math.round(cursorPos.world().y / grid.height) * grid.height,
    });
    const distanceSquared =
      Math.pow(gridSnapped.x - cursorPos.world().x, 2) +
      Math.pow(gridSnapped.y - cursorPos.world().y, 2);
    if (distanceSquared <= 5 * 5) {
      return gridSnapped;
    }
    return cursorPos.world();
  });

  const screen = createMemo(() => {
    return worldToScreen(world(), camera, windowSize());
  });

  return { world, screen };
};
