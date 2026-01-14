import { onCleanup, onMount } from "solid-js";

export const useHotkey = (
  key: string,
  modifiers: { alt?: boolean; ctrl?: boolean } = {},
  callback: (e: KeyboardEvent) => void
) => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (
      document.activeElement?.tagName === "INPUT" ||
      document.activeElement?.tagName === "TEXTAREA"
    ) {
      return;
    }
    if (
      e.key === key &&
      !!modifiers.alt === e.altKey &&
      !!modifiers.ctrl === e.ctrlKey
    ) {
      callback(e);
    }
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeydown, { capture: true });
    onCleanup(() => {
      window.removeEventListener("keydown", handleKeydown, { capture: true });
    });
  });
};
