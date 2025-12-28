import { createSignal, onCleanup, onMount } from "solid-js";
import { toScreenPos } from "~/utilities/pos";

export const useCursorPos = () => {
  const [pos, setPos] = createSignal(toScreenPos({ x: 0, y: 0 }));

  const updatePos = (x: number, y: number) => {
    setPos(toScreenPos({ x, y }));
  };

  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updatePos(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);

    onCleanup(() => {
      window.removeEventListener("mousemove", handleMouseMove);
    });
  });

  return pos;
};
