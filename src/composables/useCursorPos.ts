import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { cameraStore } from "~/stores/cameraStore";
import { toScreenPos } from "~/utilities/pos";
import { useWindowSize } from "./useWindowSize";
import { screenToWorld } from "~/utilities/coordinate";

export const useCursorPos = () => {
  const [camera] = cameraStore;
  const windowSize = useWindowSize();
  const [pos, setPos] = createSignal(toScreenPos({ x: 0, y: 0 }));

  const updatePos = (x: number, y: number) => {
    setPos(toScreenPos({ x, y }));
  };

  const worldPos = createMemo(() => {
    return screenToWorld(pos(), camera, windowSize());
  });

  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updatePos(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    onCleanup(() => {
      window.removeEventListener("mousemove", handleMouseMove);
    });
  });

  return worldPos;
};
