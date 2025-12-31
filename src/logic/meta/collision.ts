import { WorldPos } from "../../utilities/pos";
import { Content } from "../content";
import { Kind } from "../kind";

export const isColliding = (
  content: Content<Kind>,
  pos: WorldPos
): boolean => {
  switch (content.kind) {
    case "rectangle": {
      const rectShape = content.shapeProps;
      const rectOther = content.otherProps;

      const threshold = rectOther.strokeWidth / 2 + 10;

      const withinX =
        pos.x >= content.shapeProps.x - threshold &&
        pos.x <= content.shapeProps.x + content.shapeProps.width + threshold;
      const withinY =
        pos.y >= rectShape.y - threshold &&
        pos.y <= rectShape.y + rectShape.height + threshold;

      const onLeftEdge = Math.abs(pos.x - rectShape.x) <= threshold && withinY;
      const onRightEdge =
        Math.abs(pos.x - (rectShape.x + rectShape.width)) <= threshold &&
        withinY;
      const onTopEdge = Math.abs(pos.y - rectShape.y) <= threshold && withinX;
      const onBottomEdge =
        Math.abs(pos.y - (rectShape.y + rectShape.height)) <= threshold &&
        withinX;

      return (
        onLeftEdge ||
        onRightEdge ||
        onTopEdge ||
        onBottomEdge ||
        (rectOther.color !== "transparent" && withinX && withinY)
      );
    }
    case "ellipse": {
      const ellipseShape = content.shapeProps;
      const ellipseOther = content.otherProps;

      const dx = pos.x - ellipseShape.cx;
      const dy = pos.y - ellipseShape.cy;
      const rx = ellipseShape.rx;
      const ry = ellipseShape.ry;
      const distance = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);

      const strokeAdjustmentX = (ellipseOther.strokeWidth / 2 + 10) / rx;
      const strokeAdjustmentY = (ellipseOther.strokeWidth / 2 + 10) / ry;

      return (
        (distance >= 1 - strokeAdjustmentX - strokeAdjustmentY &&
          distance <= 1 + strokeAdjustmentX + strokeAdjustmentY) ||
        (ellipseOther.color !== "transparent" && distance < 1)
      );
    }
    case "line": {
      const lineShape = content.shapeProps;
      const lineOther = content.otherProps;
      const points = lineShape.points;
      const threshold = lineOther.strokeWidth / 2 + 10;

      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dpx = pos.x - p1.x;
        const dpy = pos.y - p1.y;

        const lenSq = dx * dx + dy * dy;

        let distanceSq: number;

        if (lenSq === 0) {
          distanceSq = dpx * dpx + dpy * dpy;
        } else {
          let t = (dpx * dx + dpy * dy) / lenSq;
          t = Math.max(0, Math.min(1, t));

          const nearestX = p1.x + t * dx;
          const nearestY = p1.y + t * dy;

          const distX = pos.x - nearestX;
          const distY = pos.y - nearestY;
          distanceSq = distX * distX + distY * distY;
        }

        if (distanceSq <= threshold * threshold) {
          return true;
        }
      }
      return false;
    }
    case "text": {
      return true;
    }
    default:
      content satisfies never;
      return false;
  }
};
