import {
  createMemo,
  createSignal,
  For,
  Show,
  Index,
  onMount,
  JSX,
} from "solid-js";
import { useDrag } from "~/composables/useDrag";
import { useSnappedCursorPos } from "~/composables/useSnappedCursorPos";
import { useWindowSize } from "~/composables/useWindowSize";
import {
  addPoint,
  cancelDrawing,
  finishIfPossible,
  finishIfRequired,
} from "~/logic/draw";
import {
  deleteSelection,
  deselectAll,
  selectByRect,
  selectSingle,
  toggleSelection,
} from "~/logic/select";
import { cameraStore } from "~/stores/cameraStore";
import { contentsStore } from "~/stores/contentsStore";
import { handStore } from "~/stores/handStore";
import { isSatisfied } from "~/utilities/constraint";
import { screenToWorld, worldToScreen } from "~/utilities/coordinate";
import { asScreenPos, asWorldPos, WorldPos } from "~/utilities/pos";
import { Svg } from "~/logic/meta/svgs";
import { requiredPoints } from "~/logic/meta/requiredPoints";
import { defaultProps } from "~/logic/meta/props";
import { Content } from "~/logic/content";
import { useHotkey } from "~/composables/useHotkey";
import { useCursorPos } from "~/composables/useCursorPos";
import {
  createRectFromTwoPoints,
  isCollidingRectAndPoint,
  normalizeRect,
  padRect,
} from "~/utilities/rect";
import { isColliding } from "~/logic/meta/collisions";
import { useSampled } from "~/composables/useDebounced";
import { Portal } from "solid-js/web";
import { updateContentPoints, updatePointPosition } from "~/logic/transform";
import { Uuid } from "~/utilities/uuid";
import { Kind } from "~/logic/kind";
import { useClick } from "~/composables/useClick";

export default function Canvas() {
  const [hand, setHand] = handStore;
  const [contents, setContents] = contentsStore;
  const [camera, setCamera] = cameraStore;
  const { isDown, lastReleasedAt } = useClick();
  const windowSize = useWindowSize();
  const snappedCursorPos = useSnappedCursorPos();
  const cursorPos = useCursorPos();
  const sampledWorldCursorPos = useSampled(cursorPos.world, 100);

  const gridSize = createMemo(() => ({
    width: 30 * camera.scale,
    height: 30 * camera.scale,
  }));
  const gridPosition = createMemo(() =>
    worldToScreen(asWorldPos({ x: 0, y: 0 }), camera, windowSize())
  );

  const northWest = () =>
    screenToWorld(asScreenPos({ x: 0, y: 0 }), camera, windowSize());
  const southEast = () =>
    screenToWorld(
      asScreenPos({ x: windowSize().width, y: windowSize().height }),
      camera,
      windowSize()
    );

  const cursorStyle = createMemo((): JSX.CSSProperties["cursor"] => {
    if (hand.mode === "draw") {
      return "crosshair";
    } else if (hand.mode === "select") {
      return isDown() ? "grabbing" : "grab";
    }
    return "default";
  });

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

  const hoveredId = createMemo(() => {
    const cursor = sampledWorldCursorPos();
    const ids = Object.keys(contents.contents).reverse() as Uuid[];
    for (const id of ids) {
      const rect = contents.rects[id];
      if (!rect) continue;
      if (
        isCollidingRectAndPoint(padRect(rect, 10), cursor) &&
        isColliding(contents.contents[id], cursor)
      ) {
        return id;
      }
    }
    return null;
  });

  const [cameraBeforePan, setCameraBeforePan] = createSignal(camera);
  const pan = useDrag({
    onStart: () => {
      setCameraBeforePan({ ...camera });
    },
    onMove: (delta) => {
      setCamera({
        center: asWorldPos({
          x: cameraBeforePan().center.x - delta.x / camera.scale,
          y: cameraBeforePan().center.y - delta.y / camera.scale,
        }),
      });
    },
  });

  const [rectSelectionOrigin, setRectSelectionOrigin] =
    createSignal<WorldPos | null>(null);
  const startRectSelection = useDrag({
    onStart: () => {
      setRectSelectionOrigin(cursorPos.world());
    },
    onMove: () => {
      if (hand.mode !== "select") return;
      const rectSelection = normalizeRect(
        createRectFromTwoPoints(rectSelectionOrigin()!, cursorPos.world())
      );
      selectByRect(rectSelection);
      setHand({
        rect: rectSelection,
      });
    },
    onEnd: () => {
      if (hand.mode !== "select") return;
      setHand({
        rect: null,
      });
    },
  });

  const [itemDragOriginals, setItemDragOriginals] = createSignal<
    Content<Kind>[]
  >([]);
  const startItemDrag = useDrag({
    onStart: () => {
      if (hand.mode !== "select") return;
      setItemDragOriginals(
        hand.selecteds.map((uuid) => contents.contents[uuid]).filter(Boolean)
      );
    },
    onMove: (delta) => {
      if (hand.mode !== "select") return;
      for (const original of itemDragOriginals()) {
        updateContentPoints(
          original.uuid,
          original.points,
          delta,
          camera.scale
        );
      }
    },
    onEnd: () => {
      setItemDragOriginals([]);
    },
  });

  const [pointDragOriginal, setPointDragOriginal] =
    createSignal<WorldPos | null>(null);
  const [pointDragIndex, setPointDragIndex] = createSignal<number | null>(null);
  const startPointDrag = useDrag({
    onStart: () => {
      if (hand.mode !== "select") return;
      if (hand.selecteds.length !== 1) return;
      const index = pointDragIndex();
      if (index === null) return;
      setPointDragOriginal({
        ...contents.contents[hand.selecteds[0]].points[index],
      });
    },
    onMove: (delta) => {
      if (hand.mode !== "select") return;
      if (hand.selecteds.length !== 1) return;
      const index = pointDragIndex();
      if (index === null) return;
      const original = pointDragOriginal();
      if (!original) return;
      updatePointPosition(
        hand.selecteds[0],
        index,
        original,
        delta,
        camera.scale
      );
    },
    onEnd: () => {
      setPointDragIndex(null);
    },
  });

  const handleMousedown = (e: MouseEvent) => {
    if (hand.mode === "select") {
      switch (e.button) {
        case 0:
          deselectAll();
          startRectSelection(cursorPos.screen());
          return;
        case 1:
          e.preventDefault();
          pan(cursorPos.screen());
          return;
      }
    } else if (hand.mode === "draw") {
      switch (e.button) {
        case 0:
          if (
            // double click at the same position
            performance.now() - lastReleasedAt() < 300 &&
            hand.points.length > 0 &&
            hand.points.at(-1)?.x === snappedCursorPos.world().x &&
            hand.points.at(-1)?.y === snappedCursorPos.world().y
          ) {
            finishIfPossible();
          } else {
            addPoint(snappedCursorPos.world());
            finishIfRequired();
          }
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

  const handleItemMousedown = (e: MouseEvent, id: Uuid) => {
    if (hand.mode !== "select") return;
    e.stopPropagation();
    if (e.shiftKey) {
      toggleSelection(id);
    } else {
      if (!hand.selecteds.includes(id)) {
        selectSingle(id);
      }
      startItemDrag(cursorPos.screen());
    }
  };

  const handlePointMousedown = (e: MouseEvent, index: number) => {
    if (hand.mode !== "select") return;
    e.stopPropagation();
    setPointDragIndex(index);
    startPointDrag(cursorPos.screen());
  };

  const updateRect = (id: Uuid, el: SVGGraphicsElement) => {
    const bbox = el.getBBox();
    const strokeWidth = parseFloat(getComputedStyle(el).strokeWidth) || 0;
    const expandedBBox = padRect(
      {
        position: { x: bbox.x, y: bbox.y },
        size: { x: bbox.width, y: bbox.height },
      },
      strokeWidth / 2
    );
    setContents({
      rects: {
        ...contents.rects,
        [id]: expandedBBox,
      },
    });
  };

  return (
    <main
      class="w-full h-screen text-slate-100 bg-grid slate"
      style={{
        "background-size": `${gridSize().width}px ${gridSize().height}px`,
        "background-position-x": `${gridPosition().x}px`,
        "background-position-y": `${gridPosition().y}px`,
      }}
    >
      <svg
        class="select-none"
        style={{
          cursor: cursorStyle(),
        }}
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
        <For each={Object.values(contents.contents)}>
          {(content) => {
            let el: SVGGraphicsElement | undefined;
            onMount(() => {
              if (el) {
                updateRect(content.uuid, el);
              }
            });
            return <Svg content={content} ref={el} />;
          }}
        </For>

        <Show when={currentContent()}>
          {(content) => <Svg content={content()} class="opacity-50" />}
        </Show>

        <Show when={hand.mode === "select" && hand.rect}>
          {(rect) => (
            <rect
              x={rect().position.x}
              y={rect().position.y}
              width={rect().size.x}
              height={rect().size.y}
              fill="color-mix(in oklab, var(--color-cyan-500) 20%, transparent)"
              stroke="var(--color-cyan-500)"
              stroke-width={2 / camera.scale}
              stroke-dasharray={`${4 / camera.scale} ${4 / camera.scale}`}
            />
          )}
        </Show>

        <Portal mount={document.getElementById("rect-portal")!} isSVG>
          <For each={Object.values(contents.contents)}>
            {(content) => (
              <Show
                when={
                  (hand.mode === "select" &&
                    hand.selecteds.includes(content.uuid)) ||
                  (hoveredId() === content.uuid && hand.mode === "select")
                }
              >
                <rect
                  x={padRect(contents.rects[content.uuid], 10).position.x}
                  y={padRect(contents.rects[content.uuid], 10).position.y}
                  width={padRect(contents.rects[content.uuid], 10).size.x}
                  height={padRect(contents.rects[content.uuid], 10).size.y}
                  fill="transparent"
                  stroke={
                    hand.mode === "select" &&
                    hand.selecteds.includes(content.uuid)
                      ? "var(--color-cyan-500)"
                      : "var(--color-cyan-700)"
                  }
                  stroke-width={2 / camera.scale}
                  on:mousedown={(e) => handleItemMousedown(e, content.uuid)}
                />
              </Show>
            )}
          </For>
        </Portal>

        <Portal mount={document.getElementById("point-portal")!} isSVG>
          <For each={Object.values(contents.contents)}>
            {(content) => (
              <Show
                when={
                  hand.mode === "select" &&
                  hand.selecteds.length === 1 &&
                  hand.selecteds[0] === content.uuid
                }
              >
                <Index each={content.points}>
                  {(pt, index) => (
                    <circle
                      cx={pt().x}
                      cy={pt().y}
                      r={6 / camera.scale}
                      fill="var(--color-white)"
                      stroke="var(--color-cyan-500)"
                      stroke-width={2 / camera.scale}
                      onMouseDown={(e) => handlePointMousedown(e, index)}
                    />
                  )}
                </Index>
              </Show>
            )}
          </For>
        </Portal>

        <g id="rect-portal"></g>
        <g id="point-portal"></g>
      </svg>
    </main>
  );
}
