import { createMemo, Show } from "solid-js";
import { useCursorPos } from "~/composables/useCursorPos";
import { useSnap } from "~/composables/useSnap";
import { handStore } from "~/stores/handStore";
import { thumbnails } from "~/logic/meta/thumbnails";

export default function Cursor() {
  const cursorPos = useCursorPos();
  const snap = useSnap();
  const [hand] = handStore;
  const snappedCursorPos = createMemo(() => snap(cursorPos.world()));
  return (
    <div
      class="absolute pointer-events-none"
      style={{
        top: snappedCursorPos().screen.y + "px",
        left: snappedCursorPos().screen.x + "px",
      }}
    >
      <div class="absolute w-4 h-4 rounded-full bg-cyan-800 opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <Show when={hand.mode === "draw" && hand}>
        {(hand) => (
          <div class="absolute left-1 bottom-1 opacity-50 text-cyan-900 scale-75 origin-bottom-left">
            {thumbnails(hand().kind)}
          </div>
        )}
      </Show>
    </div>
  );
}
