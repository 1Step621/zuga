import { createSignal, onCleanup, onMount } from "solid-js";

export const useClick = () => {
  const [isDown, setIsDown] = createSignal(false);
  const [lastReleasedAt, setLastReleasedAt] = createSignal(0);

  const handleMousedown = () => {
    setIsDown(true);
  };

  const handleMouseup = () => {
    setIsDown(false);
    setLastReleasedAt(performance.now());
  };

  onMount(() => {
    window.addEventListener("mousedown", handleMousedown, { capture: true });
    window.addEventListener("mouseup", handleMouseup, { capture: true });
    onCleanup(() => {
      window.removeEventListener("mousedown", handleMousedown, {
        capture: true,
      });
      window.removeEventListener("mouseup", handleMouseup, { capture: true });
    });
  });

  return {
    isDown,
    lastReleasedAt,
  };
};
