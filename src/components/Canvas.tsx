import { createMemo, For, Show } from "solid-js";
import { useDrag } from "~/composables/useDrag";
import { useSnappedCursorPos } from "~/composables/useSnappedCursorPos";
import { useWindowSize } from "~/composables/useWindowSize";
import { addPoint, cancelDrawing, finishIfPossible } from "~/logic/draw";
import { deleteSelection, deselectAll } from "~/logic/select";
import { cameraStore } from "~/stores/cameraStore";
import { clickStore } from "~/stores/clickStore";
import { contentsStore } from "~/stores/contentsStore";
import { gridStore } from "~/stores/gridStore";
import { handStore } from "~/stores/handStore";
import { isSatisfied } from "~/utilities/constraint";
import { screenToWorld, worldToScreen } from "~/utilities/coordinate";
import { asScreenPos, asWorldPos } from "~/utilities/pos";
import { Svg } from "~/logic/meta/svgs";
import { requiredPoints } from "~/logic/meta/requiredPoints";
import { defaultProps } from "~/logic/meta/props";
import { Content } from "~/logic/content";
import Item from "./Item";
import { useHotkey } from "~/composables/useHotkey";
import { useCursorPos } from "~/composables/useCursorPos";

export default function Canvas() {
  const [grid] = gridStore;
  const [hand] = handStore;
  const [content] = contentsStore;
  const [camera, setCamera] = cameraStore;
  const [, setClick] = clickStore;
  const windowSize = useWindowSize();
  const snappedCursorPos = useSnappedCursorPos();
  const cursorPos = useCursorPos();

  const gridSize = createMemo(() => ({
    width: grid.width * camera.scale,
    height: grid.height * camera.scale,
  }));
  const gridPosition = createMemo(() => {
    const worldOriginScreen = worldToScreen(
      asWorldPos({ x: 0, y: 0 }),
      camera,
      windowSize()
    );
    return {
      x:
        ((worldOriginScreen.x % gridSize().width) + gridSize().width) %
        gridSize().width,
      y:
        ((worldOriginScreen.y % gridSize().height) + gridSize().height) %
        gridSize().height,
    };
  });

  const northWest = () =>
    screenToWorld(asScreenPos({ x: 0, y: 0 }), camera, windowSize());
  const southEast = () =>
    screenToWorld(
      asScreenPos({ x: windowSize().width, y: windowSize().height }),
      camera,
      windowSize()
    );

  const currentContent = () => {
    if (hand.mode !== "draw") return null;
    if (!isSatisfied(requiredPoints[hand.kind], hand.points.length + 1))
      return null;
    return {
      uuid: "preview-preview-preview-preview-preview",
      kind: hand.kind,
      points: [...hand.points, snappedCursorPos.world()],
      props: defaultProps[hand.kind],
    } as Content<typeof hand.kind>;
  };

  const { startDrag: pan } = useDrag({
    onStart: () => {
      return { ...camera };
    },
    onMove: (start, current, initialCamera) => {
      const dx = (start.x - current.x) / initialCamera.scale;
      const dy = (start.y - current.y) / initialCamera.scale;
      setCamera({
        center: asWorldPos({
          x: initialCamera.center.x + dx,
          y: initialCamera.center.y + dy,
        }),
      });
    },
  });

  const handleMousedown = (e: MouseEvent) => {
    if (hand.mode === "select") {
      switch (e.button) {
        case 0:
          deselectAll();
          return;
        case 1:
          e.preventDefault();
          pan(cursorPos.screen());
          return;
      }
    } else if (hand.mode === "draw") {
      switch (e.button) {
        case 0:
          addPoint(snappedCursorPos.world());
          setClick({ lastClickedAt: performance.now() });
          return;
        case 1:
          e.preventDefault();
          pan(cursorPos.screen());
          return;
        case 2:
          cancelDrawing();
          return;
      }
    }
  };

  const handleMouseup = () => {
    if (hand.mode !== "draw") return;
    finishIfPossible(snappedCursorPos.world());
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const newScale = camera.scale * (1 - e.deltaY * 0.001);
    if (newScale < 0.1 || 10 < newScale) {
      return;
    }
    setCamera(() => {
      return {
        scale: newScale,
        center: asWorldPos({
          x:
            cursorPos.world().x -
            (cursorPos.screen().x - windowSize().width / 2) / newScale,
          y:
            cursorPos.world().y -
            (cursorPos.screen().y - windowSize().height / 2) / newScale,
        }),
      };
    });
  };

  useHotkey("Delete", () => {
    deleteSelection();
  });

  return (
    <main
      class="w-full h-screen text-gray-100 bg-grid"
      style={{
        "background-size": `${gridSize().width}px ${gridSize().height}px`,
        "background-position-x": `${gridPosition().x}px`,
        "background-position-y": `${gridPosition().y}px`,
      }}
    >
      <svg
        class="cursor-crosshair select-none"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox={[
          northWest().x,
          northWest().y,
          southEast().x - northWest().x,
          southEast().y - northWest().y,
        ].join(" ")}
        onMouseDown={handleMousedown}
        onMouseUp={handleMouseup}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
      >
        <For each={Object.values(content.contents)}>
          {(content) => <Item content={content} />}
        </For>

        <Show when={currentContent()}>
          {(content) => (
            <>
              <Svg content={content()} class="opacity-50" />
            </>
          )}
        </Show>
      </svg>
    </main>
  );
}
