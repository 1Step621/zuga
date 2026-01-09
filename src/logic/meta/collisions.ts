import { WorldPos } from "../../utilities/pos";
import { Content } from "../content";
import { Kind } from "../kind";
import { isCollidingRectangle } from "./collisions/rectangle";
import { isCollidingEllipse } from "./collisions/ellipse";
import { isCollidingPolygon } from "./collisions/polygon";
import { isCollidingLine } from "./collisions/line";
import { isCollidingCapacitor } from "./collisions/capacitor";
import { isCollidingInductor } from "./collisions/inductor";
import { isCollidingResistor } from "./collisions/resistor";
import { isCollidingGnd } from "./collisions/gnd";
import { isCollidingSource } from "./collisions/source";

const isCollidingGeneric = (
  points: WorldPos[],
  pos: WorldPos,
  strokeWidth: number
): boolean => {
  if (points.length < 2) return false;
  const threshold = strokeWidth / 2 + 10;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    for (let j = i + 1; j < points.length; j++) {
      const p2 = points[j];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dpx = pos.x - p1.x;
      const dpy = pos.y - p1.y;
      const lenSq = dx * dx + dy * dy;
      if (lenSq === 0) continue;
      let t = (dpx * dx + dpy * dy) / lenSq;
      t = Math.max(0, Math.min(1, t));
      const nearestX = p1.x + t * dx;
      const nearestY = p1.y + t * dy;
      const distX = pos.x - nearestX;
      const distY = pos.y - nearestY;
      if (distX * distX + distY * distY <= threshold * threshold) return true;
    }
  }
  return false;
};

export const isColliding = (content: Content<Kind>, pos: WorldPos): boolean => {
  switch (content.kind) {
    case "rectangle":
      return isCollidingRectangle(content, pos);
    case "ellipse":
      return isCollidingEllipse(content, pos);
    case "polygon":
      return isCollidingPolygon(content, pos);
    case "line":
      return isCollidingLine(content, pos);
    case "capacitor":
      return isCollidingCapacitor(content, pos);
    case "inductor": {
      return isCollidingInductor(content, pos);
    }
    case "resistor": {
      return isCollidingResistor(content, pos);
    }
    case "gnd": {
      return isCollidingGnd(content, pos);
    }
    case "vcc": {
      return isCollidingGeneric(content.points, pos, content.props.strokeWidth);
    }
    case "source": {
      return isCollidingSource(content, pos);
    }
    case "ac_source": {
      return isCollidingGeneric(content.points, pos, content.props.strokeWidth);
    }
    case "transistor": {
      return isCollidingGeneric(content.points, pos, content.props.strokeWidth);
    }
    case "gate": {
      return isCollidingGeneric(content.points, pos, content.props.strokeWidth);
    }
    case "diode": {
      return isCollidingGeneric(content.points, pos, content.props.strokeWidth);
    }
    case "op_amp": {
      return isCollidingGeneric(content.points, pos, content.props.strokeWidth);
    }
    case "junction": {
      if (content.points.length < 1) return false;
      const [p1] = content.points;
      const threshold = 10;
      const dx = pos.x - p1.x;
      const dy = pos.y - p1.y;
      return dx * dx + dy * dy <= threshold * threshold;
    }
    case "text": {
      return true;
    }
    case "math": {
      return true;
    }
    default:
      content satisfies never;
      return false;
  }
};
