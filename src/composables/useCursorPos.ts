import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { cameraStore } from "~/stores/cameraStore";
import { asScreenPos } from "~/utilities/pos";
import { useWindowSize } from "./useWindowSize";
import { screenToWorld } from "~/utilities/coordinate";

export const useCursorPos = () => {
  const [camera] = cameraStore;
  const windowSize = useWindowSize();
  const [pos, setPos] = createSignal(asScreenPos({ x: 0, y: 0 }));
  const world = createMemo(() => {
    return screenToWorld(pos(), camera, windowSize());
  });

  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos(asScreenPos({ x: e.clientX, y: e.clientY }));
    };

    window.addEventListener("mousemove", handleMouseMove, { capture: true });
    onCleanup(() => {
      window.removeEventListener("mousemove", handleMouseMove, {
        capture: true,
      });
    });
  });

  return { screen: pos, world };
};
