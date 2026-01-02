import { createSignal, onCleanup, onMount } from "solid-js";

export const useWindowSize = () => {
  const [size, setSize] = createSignal({
    width: 0,
    height: 0,
  });

  const onResize = () => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  onMount(() => {
    onResize();
    window.addEventListener("resize", onResize, { capture: true });
    onCleanup(() => {
      window.removeEventListener("resize", onResize);
    });
  });

  return size;
};
