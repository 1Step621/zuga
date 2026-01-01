import { ScreenPos } from "~/utilities/pos";

export function useDrag(handlers: {
  onStart?: (abort: () => void) => void;
  onMove?: (delta: { x: number; y: number }, abort: () => void) => void;
  onEnd?: (delta: { x: number; y: number }, abort: () => void) => void;
}) {
  const startDrag = (start: ScreenPos) => {
    const abort = () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    handlers.onStart?.(abort);

    const handleMove = (e: MouseEvent) => {
      const delta = {
        x: e.clientX - start.x,
        y: e.clientY - start.y,
      };
      handlers.onMove?.(delta, abort);
    };

    const handleUp = (e: MouseEvent) => {
      abort();
      const delta = {
        x: e.clientX - start.x,
        y: e.clientY - start.y,
      };
      handlers.onEnd?.(delta, abort);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  };

  return startDrag;
}
