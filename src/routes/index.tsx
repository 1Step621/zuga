import { Title } from "@solidjs/meta";
import { createMemo, createSignal } from "solid-js";
import Sidebar from "~/components/Sidebar";
import { useSnappedCursorPos } from "~/composables/useSnappedCursorPos";
import { useWindowSize } from "~/composables/useWindowSize";
import { requiredPoints } from "~/utilities/meta";
import { contentStore } from "~/stores/contentStore";
import { drawingStateStore } from "~/stores/drawingStateStore";
import { gridStore } from "~/stores/gridStore";
import { checkConstraint } from "~/utilities/constraint";
import { defaultOtherProp, Kind, shapeProp } from "~/utilities/props";
import { Content } from "~/utilities/content";
import { cameraStore } from "~/stores/cameraStore";
import { svg } from "~/utilities/svgs";
import { screenToWorld, worldToScreen } from "~/utilities/coordinate";

export default function Home() {
  const [grid, _setGrid] = gridStore;
  const [drawingState, setDrawingState] = drawingStateStore;
  const [content, setContent] = contentStore;
  const [camera, setCamera] = cameraStore;
  const windowSize = useWindowSize();
  const snappedCursorPos = useSnappedCursorPos();
  const snappedCursorScreenPos = createMemo(() => {
    return worldToScreen(snappedCursorPos(), camera, windowSize());
  });
  const backgroundPosition = createMemo(() => {
    const worldOriginScreen = worldToScreen({ x: 0, y: 0 }, camera, windowSize());
    const backgroundSizeX = grid.width * camera.scale;
    const backgroundSizeY = grid.height * camera.scale;

    return {
      x: ((worldOriginScreen.x % backgroundSizeX) + backgroundSizeX) % backgroundSizeX,
      y: ((worldOriginScreen.y % backgroundSizeY) + backgroundSizeY) % backgroundSizeY,
    };
  });

  const doubleClickThreshold = 300;
  const [lastClickTime, setLastClickTime] = createSignal(0);
  const isDoubleClick = () => (performance.now() - lastClickTime()) < doubleClickThreshold;

  const handleClick = (e: MouseEvent) => {
    const kind: Kind = drawingState.kind;

    if (!isDoubleClick()) {
      const newPoints = [...drawingState.points, snappedCursorPos()];
      if (
        drawingState.points.at(-1)?.x === snappedCursorPos().x &&
        drawingState.points.at(-1)?.y === snappedCursorPos().y
      ) {
        setLastClickTime(performance.now());
        return;
      }
      setDrawingState({
        points: newPoints,
      });
    }

    if (
      checkConstraint(requiredPoints[kind], drawingState.points.length) &&
      (!checkConstraint(requiredPoints[kind], drawingState.points.length + 1) || isDoubleClick())
    ) {
      setContent({
        content: [...content.content, {
          uuid: crypto.randomUUID(),
          kind,
          shapeProps: shapeProp(kind, drawingState.points),
          otherProps: defaultOtherProp(kind),
        } as Content],
      })
      setDrawingState({ points: [] });
    }

    setLastClickTime(performance.now());
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const factor = 1 - e.deltaY * 0.001;
    const center = { x: e.clientX, y: e.clientY };

    const newScale = camera.scale * factor;
    if (newScale < 0.1 || 10 < newScale) {
      return;
    }

    const worldPosBeforeZoom = screenToWorld(center, camera, windowSize());

    setCamera({ scale: newScale });

    const worldPosAfterZoom = screenToWorld(center, camera, windowSize());

    const dx = worldPosBeforeZoom.x - worldPosAfterZoom.x;
    const dy = worldPosBeforeZoom.y - worldPosAfterZoom.y;

    setCamera(c => ({
      center: {
        x: c.center.x + dx,
        y: c.center.y + dy,
      }
    }));
  };

  return (
    <>
      <Title>Zuga</Title>
      <Sidebar />
      <main class="w-full h-screen" style={{
        "background-image": `
          linear-gradient(0deg, transparent ${grid.height * camera.scale - 1}px, var(--color-gray-100) ${grid.height * camera.scale - 1}px),
          linear-gradient(90deg,  transparent ${grid.width * camera.scale - 1}px, var(--color-gray-100) ${grid.width * camera.scale - 1}px)`,
        "background-size": `${grid.width * camera.scale}px ${grid.height * camera.scale}px`,
        "background-position-x": `${backgroundPosition().x}px`,
        "background-position-y": `${backgroundPosition().y}px`,
      }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          viewBox={`${camera.center.x - windowSize().width / 2 / camera.scale} ${camera.center.y - windowSize().height / 2 / camera.scale} ${windowSize().width / camera.scale} ${windowSize().height / camera.scale}`}
          on:click={handleClick}
          on:wheel={handleWheel}
        >
          {content.content.map(item => svg(item.kind, item.shapeProps, item.otherProps))}
          {checkConstraint(requiredPoints[drawingState.kind], drawingState.points.length + 1) &&
            svg(
              drawingState.kind,
              shapeProp(drawingState.kind, [...drawingState.points, snappedCursorPos()]),
              defaultOtherProp(drawingState.kind),
            )}
        </svg>
      </main>
      <div class="absolute w-4 h-4 rounded-full bg-cyan-800 opacity-20 pointer-events-none" style={{
        top: snappedCursorScreenPos().y - 8 + "px",
        left: snappedCursorScreenPos().x - 8 + "px",
      }}></div>
    </>
  );
}

