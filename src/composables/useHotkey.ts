import { onCleanup, onMount } from "solid-js";

export const useHotkey = (
  key: string,
  callback: (e: KeyboardEvent) => void
) => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === key) {
      callback(e);
    }
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);

    onCleanup(() => {
      window.removeEventListener("keydown", handleKeydown);
    });
  });
};
