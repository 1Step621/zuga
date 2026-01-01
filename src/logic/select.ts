import { contentsStore } from "~/stores/contentsStore";
import { handStore } from "~/stores/handStore";
import { batch } from "solid-js";
import { isCollidingRectAndRect } from "~/utilities/rectCollision";
import { Uuid } from "~/utilities/uuid";

export const deselectAll = () => {
  const [hand, setHand] = handStore;
  if (hand.mode !== "select") return;
  setHand({ selecteds: [] });
};

export const deleteSelection = () => {
  const [hand, setHand] = handStore;
  const [contents, setContents] = contentsStore;
  if (hand.mode !== "select") return;

  batch(() => {
    const newContents = { ...contents.contents };
    hand.selecteds.forEach((uuid) => {
      delete newContents[uuid];
    });
    setContents({ contents: newContents });
    setHand({ selecteds: [] });
  });
};

export const selectByRect = (rectSelection: {
  x: number;
  y: number;
  width: number;
  height: number;
}) => {
  const [hand, setHand] = handStore;
  const [contents] = contentsStore;
  if (hand.mode !== "select") return;

  const selecteds = [] as Uuid[];
  for (const [id, rect] of Object.entries(contents.rects)) {
    if (isCollidingRectAndRect(rectSelection, rect)) {
      selecteds.push(id as Uuid);
    }
  }
  setHand({ selecteds });
};

export const toggleSelection = (uuid: Uuid) => {
  const [hand, setHand] = handStore;
  if (hand.mode !== "select") return;

  const newSelecteds = [...hand.selecteds];
  if (hand.selecteds.includes(uuid)) {
    newSelecteds.splice(newSelecteds.indexOf(uuid), 1);
  } else {
    newSelecteds.push(uuid);
  }
  setHand({ selecteds: newSelecteds });
};

export const selectSingle = (uuid: Uuid) => {
  const [hand, setHand] = handStore;
  if (hand.mode !== "select") return;

  setHand({ selecteds: [uuid] });
};
