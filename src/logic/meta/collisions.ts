import { WorldPos } from "../../utilities/pos";
import { Content } from "../content";
import { Kind } from "../kind";
import { prerenders } from "./prerenders";

export const isColliding = (content: Content<Kind>, pos: WorldPos): boolean => {
  switch (content.kind) {
    case "rectangle": {
      const shape = prerenders.rectangle(content.points);

      const threshold = content.props.strokeWidth / 2 + 10;

      const withinX =
        pos.x >= shape.position.x - threshold &&
        pos.x <= shape.position.x + shape.width + threshold;
      const withinY =
        pos.y >= shape.position.y - threshold &&
        pos.y <= shape.position.y + shape.height + threshold;

      const onLeftEdge =
        Math.abs(pos.x - shape.position.x) <= threshold && withinY;
      const onRightEdge =
        Math.abs(pos.x - (shape.position.x + shape.width)) <= threshold &&
        withinY;
      const onTopEdge =
        Math.abs(pos.y - shape.position.y) <= threshold && withinX;
      const onBottomEdge =
        Math.abs(pos.y - (shape.position.y + shape.height)) <= threshold &&
        withinX;

      return (
        onLeftEdge ||
        onRightEdge ||
        onTopEdge ||
        onBottomEdge ||
        (content.props.color !== "transparent" && withinX && withinY)
      );
    }
    case "ellipse": {
      const shape = prerenders.ellipse(content.points);

      const dx = pos.x - shape.center.x;
      const dy = pos.y - shape.center.y;
      const rx = shape.rx;
      const ry = shape.ry;
      const distance = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);

      const strokeAdjustmentX = (content.props.strokeWidth / 2 + 10) / rx;
      const strokeAdjustmentY = (content.props.strokeWidth / 2 + 10) / ry;

      return (
        (distance >= 1 - strokeAdjustmentX - strokeAdjustmentY &&
          distance <= 1 + strokeAdjustmentX + strokeAdjustmentY) ||
        (content.props.color !== "transparent" && distance < 1)
      );
    }
    case "line": {
      const shape = prerenders.line(content.points);

      const points = shape.points;
      const threshold = content.props.strokeWidth / 2 + 10;

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
