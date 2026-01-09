import {
  createMemo,
  createSignal,
  For,
  Show,
  Index,
  onMount,
  JSX,
  batch,
  createEffect,
} from "solid-js";
import { useDrag } from "~/composables/useDrag";
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
import { asScreenPos, asWorldPos, ScreenPos, WorldPos } from "~/utilities/pos";
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
import { moveContents, updateContentPoints, updatePointPosition } from "~/logic/transform";
import { Uuid } from "~/utilities/uuid";
import { Kind } from "~/logic/kind";
import { useClick } from "~/composables/useClick";
import { useSnap } from "~/composables/useSnap";
import { SnapLine } from "~/logic/snapLine";
import LineGuide from "./LineGuide";
import { unwrap } from "solid-js/store";
import { clipboardStore } from "~/stores/clipboardStore";

export default function Canvas() {
  const [hand, setHand] = handStore;
  const [contents, setContents] = contentsStore;
  const [clipboard, setClipboard] = clipboardStore;
  const [camera, setCamera] = cameraStore;
  const { isDown, lastReleasedAt } = useClick();
  const snap = useSnap();
  const windowSize = useWindowSize();
  const cursorPos = useCursorPos();
  const sampledWorldCursorPos = useSampled(cursorPos.world, 100);
  const cursorSnap = createMemo(() => snap(cursorPos.world()));
  const [currentSnap, setCurrrentSnap] = createSignal<{
    targetLines: { x: SnapLine | null; y: SnapLine | null };
    world: WorldPos;
    screen: ScreenPos;
  } | null>(null);

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
    } else if (hand.mode === "pan") {
      return "all-scroll";
    }
  });

  const currentContent = () => {
    if (hand.mode !== "draw") return null;
    if (!isSatisfied(requiredPoints[hand.kind], hand.points.length + 1))
      return null;
    return {
      uuid: "preview-preview-preview-preview-preview",
      kind: hand.kind,
      points: [...hand.points, cursorSnap().world],
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
      batch(() => {
        const originals = itemDragOriginals();
        const allPoints: WorldPos[] = [];
        originals.forEach((original) => {
          original.points.forEach((pt) => {
            allPoints.push(pt);
          });
        });
        const snappeds = allPoints.map((pt) =>
          snap(
            asWorldPos({
              x: pt.x + delta.x / camera.scale,
              y: pt.y + delta.y / camera.scale,
            }),
            hand.selecteds
          )
        );
        let closestDelta: { x: number; y: number } = { x: delta.x, y: delta.y };
        let closestDist = Infinity;
        snappeds.forEach((snapped, index) => {
          const originalPoint = allPoints[index];
          const dist = Math.hypot(
            snapped.world.x - (originalPoint.x + delta.x / camera.scale),
            snapped.world.y - (originalPoint.y + delta.y / camera.scale)
          );
          if (dist < closestDist) {
            closestDist = dist;
            closestDelta = {
              x: snapped.world.x - originalPoint.x,
              y: snapped.world.y - originalPoint.y,
            };
            setCurrrentSnap(snapped);
          }
        });

        originals.forEach((original) => {
          const updatedPoints = original.points.map((pt) =>
            asWorldPos({
              x: pt.x + closestDelta.x,
              y: pt.y + closestDelta.y,
            })
          );
          updateContentPoints(original.uuid, updatedPoints);
        });
      });
    },
    onEnd: () => {
      batch(() => {
        setItemDragOriginals([]);
        setCurrrentSnap(null);
        setContents({
          history: [...contents.history, { ...contents.contents }],
          undoHistory: [],
        });
      });
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
      batch(() => {
        const index = pointDragIndex();
        if (index === null) return;
        const original = pointDragOriginal();
        if (!original) return;
        const to = snap(
          asWorldPos({
            x: original.x + delta.x / camera.scale,
            y: original.y + delta.y / camera.scale,
          }),
          hand.selecteds
        );
        setCurrrentSnap(to);
        updatePointPosition(hand.selecteds[0], index, to.world);
      });
    },
    onEnd: () => {
      batch(() => {
        setPointDragIndex(null);
        setCurrrentSnap(null);
        setContents({
          history: [...contents.history, { ...contents.contents }],
          undoHistory: [],
        });
      });
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
            hand.points.at(-1)?.x === cursorSnap().world.x &&
            hand.points.at(-1)?.y === cursorSnap().world.y
          ) {
            const uuid = finishIfPossible();
            if (uuid) {
              setHand({
                mode: "select",
                selecteds: [uuid],
              });
            }
          } else {
            addPoint(cursorSnap().world);
            const uuid = finishIfRequired();
            if (uuid) {
              setHand({
                mode: "select",
                selecteds: [uuid],
              });
            }
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
    } else if (hand.mode === "pan") {
      e.preventDefault();
      pan(cursorPos.screen());
      return;
    }
  };

  const handleMouseup = () => {
    if (hand.mode !== "draw") return;
    finishIfPossible(cursorSnap().world);
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

  useHotkey("Delete", {}, () => {
    deleteSelection();
  });

  useHotkey("z", { ctrl: true }, () => {
    if (contents.history.length === 0) return;
    batch(() => {
      const previous = contents.history[contents.history.length - 1];
      setContents({
        contents: previous,
        history: contents.history.slice(0, -1),
        undoHistory: [...contents.undoHistory, { ...contents.contents }],
      });
      setHand({ selecteds: [] });
    });
  });

  useHotkey("Z", { ctrl: true }, () => {
    if (contents.undoHistory.length === 0) return;
    batch(() => {
      const next = contents.undoHistory[contents.undoHistory.length - 1];
      setContents({
        contents: next,
        undoHistory: contents.undoHistory.slice(0, -1),
        history: [...contents.history, { ...contents.contents }],
      });
      setHand({ selecteds: [] });
    });
  });

  useHotkey("c", { ctrl: true }, () => {
    if (hand.mode !== "select") return;
    setClipboard({
      contents: hand.selecteds.map((uuid) => contents.contents[uuid]),
    });
  });

  useHotkey("v", { ctrl: true }, () => {
    const newContents: Record<Uuid, Content<Kind>> = {};
    for (const content of clipboard.contents) {
      if (!content) continue;
      const newUuid = crypto.randomUUID() as Uuid;
      newContents[newUuid] = {
        ...content,
        uuid: newUuid,
        points: content.points.map((pt) =>
          asWorldPos({
            x: pt.x + 30,
            y: pt.y + 30,
          })
        ),
      };
    }
    batch(() => {
      setContents({
        contents: {
          ...contents.contents,
          ...newContents,
        },
        history: [...contents.history, { ...contents.contents }],
        undoHistory: [],
      });
      setHand({
        selecteds: [],
      });
      setClipboard({ contents: [...Object.values(newContents)] });
    });
  });

  let arrowMoveTimeout: any;
  const moveByArrow = (dx: number, dy: number) => {
    if (hand.mode !== "select" || hand.selecteds.length === 0) return;
    moveContents(hand.selecteds, { x: dx, y: dy });

    clearTimeout(arrowMoveTimeout);
    arrowMoveTimeout = setTimeout(() => {
      setContents({
        history: [...contents.history, { ...contents.contents }],
        undoHistory: [],
      });
    }, 500);
  };

  useHotkey("ArrowUp", {}, () => moveByArrow(0, -1));
  useHotkey("ArrowDown", {}, () => moveByArrow(0, 1));
  useHotkey("ArrowLeft", {}, () => moveByArrow(-1, 0));
  useHotkey("ArrowRight", {}, () => moveByArrow(1, 0));

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

        <Show when={hand.mode === "draw"}>
          <LineGuide line={cursorSnap().targetLines.x} />
        </Show>
        <Show when={hand.mode === "draw"}>
          <LineGuide line={cursorSnap().targetLines.y} />
        </Show>
        <LineGuide line={currentSnap()?.targetLines.x || null} />
        <LineGuide line={currentSnap()?.targetLines.y || null} />

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
      </svg>
    </main>
  );
}
