import { asWorldPos, WorldPos } from "~/utilities/pos";
import { Content } from "../content";
import { Kind } from "../kind";

export const anchors = (content: Content<Kind>): WorldPos[] => {
  switch (content.kind) {
    case "rectangle": {
      return content.points;
    }
    case "ellipse": {
      const [pt1, pt2] = content.points;
      return [
        asWorldPos({ x: (pt1.x + pt2.x) / 2, y: pt1.y }),
        asWorldPos({ x: pt2.x, y: (pt1.y + pt2.y) / 2 }),
        asWorldPos({ x: (pt1.x + pt2.x) / 2, y: pt2.y }),
        asWorldPos({ x: pt1.x, y: (pt1.y + pt2.y) / 2 }),
      ];
    }
    case "polygon": {
      return content.points;
    }
    case "line": {
      return content.points;
    }
    case "text": {
      return content.points;
    }
    case "math": {
      return content.points;
    }
    case "capacitor": {
      return content.points;
    }
    case "inductor": {
      return content.points;
    }
    case "resistor": {
      return content.points;
    }
    case "gnd": {
      return content.points;
    }
    case "vcc": {
      return content.points;
    }
    case "source": {
      return content.points;
    }
    case "ac_source": {
      return content.points;
    }
    case "transistor": {
      if (content.points.length < 2) return content.points;
      const [p0, p1] = content.points;
      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const dist = Math.max(Math.hypot(dx, dy), 40);
      const angle = Math.atan2(dy, dx);
      const cx = (p0.x + p1.x) / 2;
      const cy = (p0.y + p1.y) / 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      return [
        asWorldPos({ x: cx + (dist / 2) * cos, y: cy + (dist / 2) * sin }),
        asWorldPos({ x: cx - (dist / 2) * cos, y: cy - (dist / 2) * sin }),
        asWorldPos({ x: cx + 50 * sin, y: cy - 50 * cos }),
      ];
    }
    case "gate": {
      if (content.points.length < 2) return content.points;
      const [p0, p1] = content.points;
      const dx = p1.x - p0.x;
      const dy = p1.y - p0.y;
      const dist = Math.max(Math.hypot(dx, dy), 40);
      const angle = Math.atan2(dy, dx);
      const type = content.props.type;
      const h = 30;

      if (type === "not") {
        return [p0, p1];
      } else {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);
        const cx = (p0.x + p1.x) / 2;
        const cy = (p0.y + p1.y) / 2;

        return [
          asWorldPos({
            x: cx + (-dist / 2) * cos - (-h / 4) * sin,
            y: cy + (-dist / 2) * sin + (-h / 4) * cos,
          }),
          asWorldPos({
            x: cx + (-dist / 2) * cos - (h / 4) * sin,
            y: cy + (-dist / 2) * sin + (h / 4) * cos,
          }),
          p1,
        ];
      }
    }
    case "junction": {
      return content.points;
    }
    case "diode": {
      return content.points;
    }
    default: {
      content satisfies never;
      throw new Error(`Unknown content kind: ${(content as any).kind}`);
    }
  }
};
