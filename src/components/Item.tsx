import { Content } from "~/logic/content";
import { Svg } from "~/logic/meta/svgs";
import { createMemo, createSignal, onMount, Show } from "solid-js";
import { handStore } from "~/stores/handStore";
import { useCursorPos } from "~/composables/useCursorPos";
import { useSampled } from "~/composables/useDebounced";
import { isColliding } from "~/logic/meta/collisions";
import { Kind } from "~/logic/kind";
import { useDrag } from "~/composables/useDrag";
import { contentsStore } from "~/stores/contentsStore";
import { cameraStore } from "~/stores/cameraStore";
import { asWorldPos } from "~/utilities/pos";

export default function Item<K extends Kind>(props: { content: Content<K> }) {
  let ref: SVGGraphicsElement | undefined;
  const [rect, setRect] = createSignal<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>();
  const [hand, setHand] = handStore;
  const [contents, setContents] = contentsStore;
  const [camera] = cameraStore;

  const cursorPos = useCursorPos();
  const sampledWorldCursorPos = useSampled(cursorPos.world, 100);
  const isHovering = createMemo(() => {
    if (!rect()) return false;
    if (
      rect()!.x - 10 <= sampledWorldCursorPos().x &&
      sampledWorldCursorPos().x <= rect()!.x + rect()!.width + 10 &&
      rect()!.y - 10 <= sampledWorldCursorPos().y &&
      sampledWorldCursorPos().y <= rect()!.y + rect()!.height + 10
    ) {
      return isColliding(props.content, sampledWorldCursorPos());
    }
    return false;
  });

  onMount(() => {
    if (ref) {
      const bbox = ref.getBBox();
      const strokeWidth = parseFloat(getComputedStyle(ref).strokeWidth) || 0;

      const expandedBBox = {
        x: bbox.x - strokeWidth / 2,
        y: bbox.y - strokeWidth / 2,
        width: bbox.width + strokeWidth,
        height: bbox.height + strokeWidth,
      };

      setRect(expandedBBox);
    }
  });

  const { startDrag } = useDrag({
    onStart: () => {
      return props.content.points;
    },
    onMove: (start, current, initialPoints) => {
      if (hand.mode !== "select") return;
      const dx = (current.x - start.x) / camera.scale;
      const dy = (current.y - start.y) / camera.scale;
      const points = initialPoints.map((pt) =>
        asWorldPos({
          x: pt.x + dx,
          y: pt.y + dy,
        })
      );
      setContents({
        contents: {
          ...contents.contents,
          [props.content.uuid]: {
            ...props.content,
            points,
          },
        },
      });
    },
  });

  const handleMousedown = (e: MouseEvent) => {
    if (hand.mode !== "select") return;
    if (isHovering()) {
      e.stopPropagation();
      if (e.shiftKey) {
        const newSelecteds = new Set(hand.selecteds);
        if (hand.selecteds.has(props.content.uuid)) {
          newSelecteds.delete(props.content.uuid);
        } else {
          newSelecteds.add(props.content.uuid);
        }
        setHand({ selecteds: newSelecteds });
      } else {
        setHand({ selecteds: new Set([props.content.uuid]) });
        startDrag(cursorPos.screen());
      }
    }
  };

  return (
    <>
      <Svg content={props.content} ref={ref} />
      <Show
        when={
          hand.mode === "select" &&
          (hand.selecteds.has(props.content.uuid) || isHovering()) &&
          hand
        }
      >
        {(hand) => (
          <rect
            x={(rect()?.x ?? 0) - 10}
            y={(rect()?.y ?? 0) - 10}
            width={(rect()?.width ?? 0) + 20}
            height={(rect()?.height ?? 0) + 20}
            fill="transparent"
            stroke={
              hand().selecteds.has(props.content.uuid)
                ? "var(--color-cyan-500)"
                : "var(--color-cyan-700)"
            }
            stroke-width={2}
            onMouseDown={handleMousedown}
          />
        )}
      </Show>
    </>
  );
}
