import { contentsStore } from "~/stores/contentsStore";
import { asWorldPos, WorldPos } from "~/utilities/pos";
import { Uuid } from "~/utilities/uuid";

export const updateContentPoints = (
  uuid: Uuid,
  originalPoints: WorldPos[],
  delta: { x: number; y: number },
  cameraScale: number
) => {
  const [contents, setContents] = contentsStore;
  const content = contents.contents[uuid];
  if (!content) return;

  const points = originalPoints.map((pt) => {
    return asWorldPos({
      x: pt.x + delta.x / cameraScale,
      y: pt.y + delta.y / cameraScale,
    });
  });

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

export const updatePointPosition = (
  uuid: Uuid,
  pointIndex: number,
  originalPoint: WorldPos,
  delta: { x: number; y: number },
  cameraScale: number
) => {
  const [contents, setContents] = contentsStore;
  const content = contents.contents[uuid];
  if (!content) return;

  const points = [...content.points];
  if (!points[pointIndex]) return;

  points[pointIndex] = asWorldPos({
    x: originalPoint.x + delta.x / cameraScale,
    y: originalPoint.y + delta.y / cameraScale,
  });

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
