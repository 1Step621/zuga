import { ScreenPos, asScreenPos } from "~/utilities/pos";

export function useDrag<T = unknown>(handlers: {
  onStart?: (start: ScreenPos) => T;
  onMove?: (start: ScreenPos, current: ScreenPos, initial: T) => void;
  onEnd?: (start: ScreenPos, end: ScreenPos, initial: T) => void;
}) {
  const startDrag = (start: ScreenPos) => {
    const initial = handlers.onStart?.(start);

    const handleMove = (e: MouseEvent) => {
      const end = asScreenPos({ x: e.clientX, y: e.clientY });
      handlers.onMove?.(start, end, initial as T);
    };

    const handleUp = (e: MouseEvent) => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      const end = asScreenPos({ x: e.clientX, y: e.clientY });
      handlers.onEnd?.(start, end, initial as T);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  return { startDrag };
}
