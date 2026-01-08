import { asWorldPos, DeltaPos, WorldPos } from "~/utilities/pos";
import { Kind } from "../kind";

export type Prerendered<K extends Kind> = {
  rectangle: {
    position: WorldPos;
    size: DeltaPos;
  };
  ellipse: {
    center: WorldPos;
    radius: DeltaPos;
  };
  polygon: {
    points: WorldPos[];
  };
  line: {
    points: WorldPos[];
  };
  text: {
    position: WorldPos;
  };
  resistor: {
    points: WorldPos[];
  };
  capacitor: {
    points: WorldPos[];
  };
  inductor: {
    points: WorldPos[];
  };
  source: {
    points: WorldPos[];
  };
  ac_source: {
    points: WorldPos[];
  };
  vcc: {
    points: WorldPos[];
  };
  gnd: {
    points: WorldPos[];
  };
  transistor: {
    points: WorldPos[];
  };
  gate: {
    points: WorldPos[];
  };
  junction: {
    position: WorldPos;
  };
  diode: {
    points: WorldPos[];
  };
  math: {
    position: WorldPos;
  }
}[K];

export const prerenders: {
  [K in Kind]: (points: WorldPos[]) => Prerendered<K>;
} = {
  rectangle: (points) => {
    const [pt1, pt2] = points;
    return {
      position: asWorldPos({
        x: Math.min(pt1.x, pt2.x),
        y: Math.min(pt1.y, pt2.y),
      }),
      size: {
        x: Math.abs(pt2.x - pt1.x),
        y: Math.abs(pt2.y - pt1.y),
      },
    };
  },
  ellipse: (points) => {
    const [pt1, pt2] = points;
    return {
      center: asWorldPos({ x: (pt1.x + pt2.x) / 2, y: (pt1.y + pt2.y) / 2 }),
      radius: {
        x: Math.abs(pt2.x - pt1.x) / 2,
        y: Math.abs(pt2.y - pt1.y) / 2,
      }
    };
  },
  polygon: (points) => {
    return {
      points: points,
    };
  },
  line: (points) => {
    return {
      points: points,
    };
  },
  text: (points) => {
    const [pt1] = points;
    return {
      position: pt1,
    };
  },
  resistor: (points) => {
    return {
      points: points,
    };
  },
  capacitor: (points) => {
    return {
      points: points,
    };
  },
  inductor: (points) => {
    return {
      points: points,
    };
  },
  source: (points) => {
    return {
      points: points,
    };
  },
  ac_source: (points) => {
    return {
      points: points,
    };
  },
  vcc: (points) => {
    return {
      points: points,
    };
  },
  gnd: (points) => {
    return {
      points: points,
    };
  },
  transistor: (points) => {
    return {
      points: points,
    };
  },
  gate: (points) => {
    return {
      points: points,
    };
  },
  junction: (points) => {
    const [pt1] = points;
    return {
      position: pt1,
    };
  },
  diode: (points) => {
    return {
      points: points,
    };
  },
  math: (points) => {
    const [pt1] = points;
    return {
      position: pt1,
    };
  }
};
