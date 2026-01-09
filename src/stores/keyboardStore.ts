import { createStore } from "solid-js/store";
import { onCleanup, onMount } from "solid-js";

export const keyboardStore = createStore({
  shift: false,
  ctrl: false,
  alt: false,
});

export const setupKeyboardListeners = () => {
  const handleKeydown = (e: KeyboardEvent) => {
    keyboardStore[1]({
      shift: e.shiftKey,
      ctrl: e.ctrlKey,
      alt: e.altKey,
    });
  };

  const handleKeyup = (e: KeyboardEvent) => {
    keyboardStore[1]({
      shift: e.shiftKey,
      ctrl: e.ctrlKey,
      alt: e.altKey,
    });
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("keyup", handleKeyup);
    onCleanup(() => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("keyup", handleKeyup);
    });
  });
};
