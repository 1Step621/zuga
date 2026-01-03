import { Title } from "@solidjs/meta";
import LeftSidebar from "~/components/LeftSidebar";
import RightSidebar from "~/components/RightSidebar";
import Canvas from "~/components/Canvas";
import { handStore } from "~/stores/handStore";
import { createMemo, Show } from "solid-js";
import { useCursorPos } from "~/composables/useCursorPos";
import { useSnap } from "~/composables/useSnap";

export default function Home() {
  const [hand] = handStore;
  const cursorPos = useCursorPos();
  const snap = useSnap();
  const snappedCursorPos = createMemo(() => snap(cursorPos.world()));

  return (
    <>
      <Title>Zuga</Title>
      <div class="w-screen relative overflow-hidden">
        <Show when={hand.mode === "draw"}>
          <div
            class="absolute w-4 h-4 rounded-full bg-cyan-800 opacity-20 pointer-events-none"
            style={{
              top: snappedCursorPos().screen.y - 8 + "px",
              left: snappedCursorPos().screen.x - 8 + "px",
            }}
          ></div>
        </Show>
        <LeftSidebar />
        <RightSidebar />
        <Canvas />
      </div>
    </>
  );
}
