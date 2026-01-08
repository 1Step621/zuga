import { DeltaPos, NaivePos } from "./pos";

export type Rect = {
  position: NaivePos;
  size: DeltaPos;
};

export const createRectFromTwoPoints = (
  pointA: NaivePos,
  pointB: NaivePos
): Rect => {
  return {
    position: {
      x: pointA.x,
      y: pointA.y,
    },
    size: {
      x: pointB.x - pointA.x,
      y: pointB.y - pointA.y,
    },
  };
};

export const padRect = (rect: Rect, padding: number): Rect => {
  return {
    position: {
      x: rect.position.x - padding,
      y: rect.position.y - padding,
    },
    size: {
      x: rect.size.x + padding * 2,
      y: rect.size.y + padding * 2,
    },
  };
};

export const normalizeRect = (rect: Rect): Rect => {
  const normalizedSizeX = rect.size.x >= 0 ? rect.size.x : -rect.size.x;
  const normalizedSizeY = rect.size.y >= 0 ? rect.size.y : -rect.size.y;
  const normalizedPosX =
    rect.size.x >= 0 ? rect.position.x : rect.position.x - normalizedSizeX;
  const normalizedPosY =
    rect.size.y >= 0 ? rect.position.y : rect.position.y - normalizedSizeY;

  return {
    position: {
      x: normalizedPosX,
      y: normalizedPosY,
    },
    size: {
      x: normalizedSizeX,
      y: normalizedSizeY,
    },
  };
};

export const isCollidingRectAndRect = (rectA: Rect, rectB: Rect): boolean => {
  rectA = normalizeRect(rectA);
  rectB = normalizeRect(rectB);
  return !(
    rectA.position.x + rectA.size.x < rectB.position.x ||
    rectB.position.x + rectB.size.x < rectA.position.x ||
    rectA.position.y + rectA.size.y < rectB.position.y ||
    rectB.position.y + rectB.size.y < rectA.position.y
  );
};

export const isCollidingRectAndPoint = (
  rect: Rect,
  point: NaivePos
): boolean => {
  return (
    point.x >= rect.position.x &&
    point.x <= rect.position.x + rect.size.x &&
    point.y >= rect.position.y &&
    point.y <= rect.position.y + rect.size.y
  );
};
