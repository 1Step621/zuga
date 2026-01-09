import { contentsStore } from "~/stores/contentsStore";
import { WorldPos } from "~/utilities/pos";
import { Uuid } from "~/utilities/uuid";

export const updateContentPoints = (uuid: Uuid, updatedPoints: WorldPos[]) => {
  const [contents, setContents] = contentsStore;
  const content = contents.contents[uuid];
  if (!content) return;

  setContents({
    contents: {
      ...contents.contents,
      [uuid]: {
        ...content,
        points: updatedPoints,
      },
    },
  });
};

export const updatePointPosition = (
  uuid: Uuid,
  pointIndex: number,
  to: WorldPos
) => {
  const [contents, setContents] = contentsStore;
  const content = contents.contents[uuid];
  if (!content) return;

  const points = [...content.points];
  if (!points[pointIndex]) return;

  points[pointIndex] = to;

  setContents({
    contents: {
      ...contents.contents,
      [uuid]: {
        ...content,
        points,
      },
    },
  });
};

export const moveContents = (uuids: Uuid[], delta: { x: number; y: number }) => {
  const [contents, setContents] = contentsStore;
  const newContents = { ...contents.contents };

  uuids.forEach((uuid) => {
    const content = newContents[uuid];
    if (!content) return;
    newContents[uuid] = {
      ...content,
      points: content.points.map((pt) => ({
        x: pt.x + delta.x,
        y: pt.y + delta.y,
      })),
    } as any;
  });

  setContents({
    contents: newContents,
  });
};
