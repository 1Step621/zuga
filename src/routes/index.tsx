import { Title } from "@solidjs/meta";
import { createMemo, createSignal, For, Show } from "solid-js";
import Sidebar from "~/components/Sidebar";
import { useSnappedCursorPos } from "~/composables/useSnappedCursorPos";
import { useWindowSize } from "~/composables/useWindowSize";
import { requiredPoints } from "~/utilities/meta";
import { contentStore } from "~/stores/contentStore";
import { handStore } from "~/stores/handStore";
import { gridStore } from "~/stores/gridStore";
import { checkConstraint } from "~/utilities/constraint";
import { defaultOtherProp, shapeProp } from "~/utilities/props";
import { Content } from "~/utilities/content";
import { cameraStore } from "~/stores/cameraStore";
import { Svg } from "~/utilities/svgs";
import { screenToWorld, worldToScreen } from "~/utilities/coordinate";
import { toScreenPos, toWorldPos } from "~/utilities/pos";
import { isColliding } from "~/utilities/collision";
import { useCursorPos } from "~/composables/useCursorPos";

export default function Home() {
  const [grid] = gridStore;
  const [hand, setHand] = handStore;
  const [content, setContent] = contentStore;
  const [camera, setCamera] = cameraStore;
  const cursorPos = useCursorPos();
  const windowSize = useWindowSize();

  const [lastClickTime, setLastClickTime] = createSignal(0);

  const snappedCursorPos = useSnappedCursorPos();
  const snappedCursorScreenPos = createMemo(() =>
    worldToScreen(snappedCursorPos(), camera, windowSize())
  );
  const scaledGridSize = createMemo(() => ({
    width: grid.width * camera.scale,
    height: grid.height * camera.scale,
  }));
  const gridPosition = createMemo(() => {
    const worldOriginScreen = worldToScreen(
      toWorldPos({ x: 0, y: 0 }),
      camera,
      windowSize()
    );
    return {
      x:
        ((worldOriginScreen.x % scaledGridSize().width) +
          scaledGridSize().width) %
        scaledGridSize().width,
      y:
        ((worldOriginScreen.y % scaledGridSize().height) +
          scaledGridSize().height) %
        scaledGridSize().height,
    };
  });

  const finishCurrentShape = () => {
    if (hand.mode !== "draw") return;
    setContent({
      content: [
        ...content.content,
        {
          uuid: crypto.randomUUID(),
          kind: hand.kind,
          shapeProps: shapeProp(hand.kind, hand.points),
          otherProps: defaultOtherProp(hand.kind),
        } as Content,
      ],
    });
    setHand({ points: [] });
  };

  const addPoint = (e: MouseEvent) => {
    if (hand.mode !== "draw") return;
    const isDoubleClick = performance.now() - lastClickTime() < 300;

    if (!isDoubleClick) {
      const newPoints = [...hand.points, snappedCursorPos()];
      if (
        hand.points.at(-1)?.x === snappedCursorPos().x &&
        hand.points.at(-1)?.y === snappedCursorPos().y
      ) {
        setLastClickTime(performance.now());
        return;
      }
      setHand({
        points: newPoints,
      });
    }
    if (
      checkConstraint(requiredPoints[hand.kind], hand.points.length) &&
      (!checkConstraint(requiredPoints[hand.kind], hand.points.length + 1) ||
        isDoubleClick)
    ) {
      finishCurrentShape();
    }

    setLastClickTime(performance.now());
    return;
  };

  const cancel = (e: MouseEvent) => {
    if (hand.mode !== "draw") return;
    setHand({ points: [] });
  };

  const pan = (e: MouseEvent) => {
    e.preventDefault();
    const startPos = { x: e.clientX, y: e.clientY };
    const startCenter = { ...camera.center };

    const handleMouseMove = (ev: MouseEvent) => {
      const dx = (startPos.x - ev.clientX) / camera.scale;
      const dy = (startPos.y - ev.clientY) / camera.scale;
      setCamera({
        center: toWorldPos({
          x: startCenter.x + dx,
          y: startCenter.y + dy,
        }),
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const select = (e: MouseEvent) => {
    if (hand.mode !== "select") return;
    const collisions = content.content.filter((item) =>
      isColliding(item.kind, item.shapeProps, item.otherProps, cursorPos())
    );
    setHand({
      selecteds: collisions.map((item) => item.uuid),
    });
  };

  const handleMousedown = (e: MouseEvent) => {
    if (hand.mode === "select") {
      switch (e.button) {
        case 0:
          select(e);
          return;
        case 1:
          pan(e);
          return;
      }
    } else if (hand.mode === "draw") {
      switch (e.button) {
        case 0:
          addPoint(e);
          return;
        case 1:
          pan(e);
          return;
        case 2:
          cancel(e);
          return;
      }
    }
  };

  const handleMouseup = () => {
    if (hand.mode !== "draw") return;
    if (
      checkConstraint(requiredPoints[hand.kind], hand.points.length + 1) &&
      performance.now() - lastClickTime() > 300
    ) {
      setHand({
        points: [...hand.points, snappedCursorPos()],
      });
      finishCurrentShape();
    }
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const factor = 1 - e.deltaY * 0.001;
    const center = toScreenPos({ x: e.clientX, y: e.clientY });

    const newScale = camera.scale * factor;
    if (newScale < 0.1 || 10 < newScale) {
      return;
    }

    const worldPosBeforeZoom = screenToWorld(center, camera, windowSize());

    setCamera({ scale: newScale });

    const worldPosAfterZoom = screenToWorld(center, camera, windowSize());

    const dx = worldPosBeforeZoom.x - worldPosAfterZoom.x;
    const dy = worldPosBeforeZoom.y - worldPosAfterZoom.y;

    setCamera((c) => ({
      center: toWorldPos({
        x: c.center.x + dx,
        y: c.center.y + dy,
      }),
    }));
  };

  return (
    <>
      <Title>Zuga</Title>
      <Sidebar />
      <main
        class="w-full h-screen text-gray-100 bg-grid"
        style={{
          "background-size": `${scaledGridSize().width}px ${
            scaledGridSize().height
          }px`,
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
            camera.center.x - windowSize().width / 2 / camera.scale,
            camera.center.y - windowSize().height / 2 / camera.scale,
            windowSize().width / camera.scale,
            windowSize().height / camera.scale,
          ].join(" ")}
          onMouseDown={handleMousedown}
          onMouseUp={handleMouseup}
          onWheel={handleWheel}
          onContextMenu={(e) => e.preventDefault()}
        >
          <For each={content.content}>
            {(item) => (
              <Svg
                kind={item.kind}
                shape={item.shapeProps}
                other={item.otherProps}
                selected={
                  hand.mode === "select" && hand.selecteds.includes(item.uuid)
                }
              />
            )}
          </For>
          <Show
            when={
              hand.mode === "draw" &&
              checkConstraint(
                requiredPoints[hand.kind],
                hand.points.length + 1
              ) &&
              hand
            }
          >
            {(hand) => (
              <Svg
                kind={hand().kind}
                shape={shapeProp(hand().kind, [
                  ...hand().points,
                  snappedCursorPos(),
                ])}
                other={defaultOtherProp(hand().kind)}
              />
            )}
          </Show>
        </svg>
      </main>
      <Show when={hand.mode === "draw"}>
        <div
          class="absolute w-4 h-4 rounded-full bg-cyan-800 opacity-20 pointer-events-none"
          style={{
            top: snappedCursorScreenPos().y - 8 + "px",
            left: snappedCursorScreenPos().x - 8 + "px",
          }}
        ></div>
      </Show>
    </>
  );
}
