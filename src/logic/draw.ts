import { contentsStore } from "~/stores/contentsStore";
import { handStore } from "~/stores/handStore";
import { clickStore } from "~/stores/clickStore";
import { Content } from "~/logic/content";
import { isSatisfied } from "~/utilities/constraint";
import { WorldPos } from "~/utilities/pos";
import { batch } from "solid-js";
import { requiredPoints } from "./meta/requiredPoints";
import { shapeProps } from "./meta/shapeProps";
import { defaultOtherProps } from "./meta/otherProps";

const finish = () => {
  const [hand, setHand] = handStore;
  const [content, setContent] = contentsStore;
  if (hand.mode !== "draw") return;

  const newUuid = crypto.randomUUID();
  setContent({
    contents: {
      ...content.contents,
      [newUuid]: {
        uuid: newUuid,
        kind: hand.kind,
        shapeProps: shapeProps[hand.kind](hand.points),
        otherProps: defaultOtherProps[hand.kind],
      },
    },
  });
  setHand({ points: [] });
};

export const finishIfPossible = (lastPos: WorldPos) => {
  const [hand, setHand] = handStore;

  if (hand.mode !== "draw") return;
  if (
    isSatisfied(requiredPoints[hand.kind], hand.points.length + 1) &&
    hand.points.at(-1) &&
    hand.points.at(-1)!.x !== lastPos.x &&
    hand.points.at(-1)!.y !== lastPos.y
  ) {
    setHand({
      points: [...hand.points, lastPos],
    });
    finish();
  }
};

export const addPoint = (pos: WorldPos) => {
  batch(() => {
    const [hand, setHand] = handStore;
    const [click] = clickStore;

    if (hand.mode !== "draw") return;
    const isDoubleClick = performance.now() - click.lastClickedAt < 300;

    if (
      !isDoubleClick &&
      hand.points.at(-1)?.x === pos.x &&
      hand.points.at(-1)?.y === pos.y
    ) {
      return;
    }

    if (!isDoubleClick) {
      setHand({
        points: [...hand.points, pos],
      });
    }

    if (
      isSatisfied(requiredPoints[hand.kind], hand.points.length) &&
      (!isSatisfied(requiredPoints[hand.kind], hand.points.length + 1) ||
        isDoubleClick)
    ) {
      finish();
    }
  });
};

export const cancelDrawing = () => {
  const [hand, setHand] = handStore;

  if (hand.mode !== "draw") return;
  setHand({ points: [] });
};
