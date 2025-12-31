import { contentsStore } from "~/stores/contentsStore";
import { handStore } from "~/stores/handStore";
import { batch } from "solid-js";

export const deselectAll = () => {
  const [hand, setHand] = handStore;
  if (hand.mode !== "select") return;
  setHand({ selecteds: new Set() });
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
    setHand({ selecteds: new Set() });
  });
};
