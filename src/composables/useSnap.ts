import { worldToScreen } from "~/utilities/coordinate";
import { cameraStore } from "~/stores/cameraStore";
import { useWindowSize } from "./useWindowSize";
import { contentsStore } from "~/stores/contentsStore";
import { anchors } from "~/logic/meta/anchors";
import { asWorldPos, WorldPos } from "~/utilities/pos";
import { Uuid } from "~/utilities/uuid";
import { SnapLine } from "~/logic/snapLine";
import { keyboardStore } from "~/stores/keyboardStore";

export const useSnap = () => {
  const windowSize = useWindowSize();
  const [camera] = cameraStore;
  const [contents] = contentsStore;
  const [keys] = keyboardStore;

  const snap = (pos: WorldPos, ignores?: Uuid[]) => {
    if (keys.shift) {
      return {
        targetLines: { x: null, y: null },
        world: pos,
        screen: worldToScreen(pos, camera, windowSize()),
      };
    }
    const everyAnchors = Object.values(contents.contents)
      .filter((content) => !ignores?.includes(content.uuid))
      .flatMap((content) => anchors(content));

    const lines = (() => {
      const anchorBased = everyAnchors.flatMap(
        (anchor) =>
          [
            { type: "vertical", x: anchor.x, anchors: [anchor] },
            { type: "horizontal", y: anchor.y, anchors: [anchor] },
          ] as SnapLine[]
      );

      const sameXMap = new Map<number, WorldPos[]>();
      const sameYMap = new Map<number, WorldPos[]>();
      for (const anchor of everyAnchors) {
        if (!sameXMap.has(anchor.x)) {
          sameXMap.set(anchor.x, []);
        }
        sameXMap.get(anchor.x)!.push(anchor);

        if (!sameYMap.has(anchor.y)) {
          sameYMap.set(anchor.y, []);
        }
        sameYMap.get(anchor.y)!.push(anchor);
      }

      const anchorHalfBased: SnapLine[] = [];

      for (const anchors of sameXMap.values()) {
        if (anchors.length >= 2) {
          anchors.sort((a, b) => a.y - b.y);
          for (let i = 0; i < anchors.length - 1; i++) {
            const yMid = (anchors[i].y + anchors[i + 1].y) / 2;
            anchorHalfBased.push({
              type: "horizontal",
              y: yMid,
              anchors: [anchors[i], anchors[i + 1]],
            });
          }
        }
      }

      for (const anchors of sameYMap.values()) {
        if (anchors.length >= 2) {
          anchors.sort((a, b) => a.x - b.x);
          for (let i = 0; i < anchors.length - 1; i++) {
            const xMid = (anchors[i].x + anchors[i + 1].x) / 2;
            anchorHalfBased.push({
              type: "vertical",
              x: xMid,
              anchors: [anchors[i], anchors[i + 1]],
            });
          }
        }
      }

      return [...anchorBased, ...anchorHalfBased];
    })();

    const targetLines = (() => {
      const snapThreshold = 10 / camera.scale;

      let closestX: SnapLine | null = null;
      let closestY: SnapLine | null = null;
      let closestXDist = Infinity;
      let closestYDist = Infinity;

      for (const line of lines) {
        if (line.type === "vertical") {
          const dist = Math.abs(pos.x - line.x);
          if (dist <= snapThreshold && dist < closestXDist) {
            closestX = line;
            closestXDist = dist;
          }
        } else if (line.type === "horizontal") {
          const dist = Math.abs(pos.y - line.y);
          if (dist <= snapThreshold && dist < closestYDist) {
            closestY = line;
            closestYDist = dist;
          }
        }
      }

      const threshold = 10 / camera.scale;

      return {
        x: closestXDist < threshold ? closestX : null,
        y: closestYDist < threshold ? closestY : null,
      };
    })();

    let snappedX = pos.x;
    let snappedY = pos.y;

    if (targetLines.x) {
      snappedX = targetLines.x.x;
    } else {
      const gridSnapped = Math.round(pos.x / 30) * 30;
      if (Math.abs(pos.x - gridSnapped) < 5 / camera.scale) {
        snappedX = gridSnapped;
      }
    }
    if (targetLines.y) {
      snappedY = targetLines.y.y;
    } else {
      const gridSnapped = Math.round(pos.y / 30) * 30;
      if (Math.abs(pos.y - gridSnapped) < 5 / camera.scale) {
        snappedY = gridSnapped;
      }
    }

    return {
      targetLines: targetLines,
      world: asWorldPos({ x: snappedX, y: snappedY }),
      screen: worldToScreen(
        asWorldPos({ x: snappedX, y: snappedY }),
        camera,
        windowSize()
      ),
    };
  };

  return snap;
};
