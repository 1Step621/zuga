import { ScreenPos, asScreenPos } from "~/utilities/pos";

export function useDrag(handlers: {
  onStart?: (start: ScreenPos) => void;
  onMove?: (start: ScreenPos, current: ScreenPos) => void;
  onEnd?: (start: ScreenPos, end: ScreenPos) => void;
}) {
  const startDrag = (start: ScreenPos) => {
    const initial = handlers.onStart?.(start);

    const handleMove = (e: MouseEvent) => {
      const end = asScreenPos({ x: e.clientX, y: e.clientY });
      handlers.onMove?.(start, end);
    };

    const handleUp = (e: MouseEvent) => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      const end = asScreenPos({ x: e.clientX, y: e.clientY });
      handlers.onEnd?.(start, end);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  return startDrag;
}
