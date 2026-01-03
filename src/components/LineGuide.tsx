import { For, Show } from "solid-js";
import { useWindowSize } from "~/composables/useWindowSize";
import { SnapLine } from "~/logic/snapLine";
import { cameraStore } from "~/stores/cameraStore";
import { screenToWorld } from "~/utilities/coordinate";
import { asScreenPos } from "~/utilities/pos";

export default function LineGuide(props: { line: SnapLine | null }) {
  const [camera] = cameraStore;
  const windowSize = useWindowSize();

  const northWest = () =>
    screenToWorld(asScreenPos({ x: 0, y: 0 }), camera, windowSize());
  const southEast = () =>
    screenToWorld(
      asScreenPos({ x: windowSize().width, y: windowSize().height }),
      camera,
      windowSize()
    );

  return (
    <Show when={props.line}>
      <Show when={props.line!.type === "vertical" && props.line!}>
        {(line) => (
          <>
            <For each={line().anchors}>
              {(anchor) => (
                <circle
                  cx={anchor.x}
                  cy={anchor.y}
                  r={3 / camera.scale}
                  fill="var(--color-orange-400)"
                />
              )}
            </For>
            <line
              x1={line().x}
              y1={northWest().y}
              x2={line().x}
              y2={southEast().y}
              stroke="var(--color-orange-400)"
              stroke-width={1 / camera.scale}
              stroke-dasharray={`${10 / camera.scale} ${10 / camera.scale}`}
            />
          </>
        )}
      </Show>
      <Show when={props.line!.type === "horizontal" && props.line!}>
        {(line) => (
          <>
            <For each={line().anchors}>
              {(anchor) => (
                <circle
                  cx={anchor.x}
                  cy={anchor.y}
                  r={3 / camera.scale}
                  fill="var(--color-orange-400)"
                />
              )}
            </For>
            <line
              x1={northWest().x}
              y1={line().y}
              x2={southEast().x}
              y2={line().y}
              stroke="var(--color-orange-400)"
              stroke-width={1 / camera.scale}
              stroke-dasharray={`${10 / camera.scale} ${10 / camera.scale}`}
            />
          </>
        )}
      </Show>
    </Show>
  );
}
