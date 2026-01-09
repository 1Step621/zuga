import { Kind } from "../kind";

export type Props<K extends Kind> = {
  rectangle: {
    color: string;
    strokeColor: string;
    strokeWidth: number;
    label?: string;
    labelColor?: string;
    labelSize?: number;
    labelPlacement?: "center" | "top" | "bottom" | "left" | "right";
  };
  ellipse: {
    color: string;
    strokeColor: string;
    strokeWidth: number;
    label?: string;
    labelColor?: string;
    labelSize?: number;
    labelPlacement?: "center" | "top" | "bottom" | "left" | "right";
  };
  line: {
    color: string;
    strokeWidth: number;
    arrowStart?: boolean;
    arrowEnd?: boolean;
  };
  text: {
    content: string;
    fontSize: number;
    color: string;
    align: "start" | "middle" | "end";
    verticalAlign: "top" | "middle" | "bottom";
  };
  resistor: {
    color: string;
    strokeWidth: number;
    leadStrokeWidth: number;
    variable?: boolean;
  };
  capacitor: {
    color: string;
    strokeWidth: number;
    leadStrokeWidth: number;
  };
  inductor: {
    color: string;
    strokeWidth: number;
    leadStrokeWidth: number;
  };
  source: {
    color: string;
    strokeWidth: number;
    leadStrokeWidth: number;
  };
  ac_source: {
    color: string;
    strokeWidth: number;
    leadStrokeWidth: number;
  };
  vcc: {
    color: string;
    strokeWidth: number;
    leadStrokeWidth: number;
  };
  gnd: {
    color: string;
    strokeWidth: number;
    leadStrokeWidth: number;
  };
  transistor: {
    color: string;
    strokeWidth: number;
    leadStrokeWidth: number;
    type: "npn" | "pnp";
  };
  gate: {
    color: string;
    strokeWidth: number;
    leadStrokeWidth: number;
    type: "and" | "or" | "not" | "nand" | "nor" | "xor";
  };
  junction: {
    color: string;
    strokeWidth: number;
    fill: boolean;
  };
  diode: {
    color: string;
    strokeWidth: number;
    leadStrokeWidth: number;
    led?: boolean;
  };
  op_amp: {
    color: string;
    strokeWidth: number;
    leadStrokeWidth: number;
  };
  math: {
    content: string;
    fontSize: number;
    color: string;
    align: "start" | "middle" | "end";
    verticalAlign: "top" | "middle" | "bottom";
  };
  polygon: {
    color: string;
    strokeColor: string;
    strokeWidth: number;
    label?: string;
    labelColor?: string;
    labelSize?: number;
    labelPlacement?: "center" | "top" | "bottom" | "left" | "right";
  };
}[K];

export const defaultProps: { [K in Kind]: Props<K> } = {
  rectangle: {
    color: "transparent",
    strokeColor: "#000000",
    strokeWidth: 1.5,
    label: "",
    labelColor: "#000000",
    labelSize: 16,
    labelPlacement: "center",
  },
  ellipse: {
    color: "transparent",
    strokeColor: "#000000",
    strokeWidth: 1.5,
    label: "",
    labelColor: "#000000",
    labelSize: 16,
    labelPlacement: "center",
  },
  polygon: {
    color: "transparent",
    strokeColor: "#000000",
    strokeWidth: 1.5,
    label: "",
    labelColor: "#000000",
    labelSize: 16,
    labelPlacement: "center",
  },
  line: {
    color: "#000000",
    strokeWidth: 1.5,
    arrowStart: false,
    arrowEnd: false,
  },
  text: {
    content: "Text",
    fontSize: 16,
    color: "#000000",
    align: "middle",
    verticalAlign: "middle",
  },
  resistor: {
    color: "#000000",
    strokeWidth: 2.5,
    leadStrokeWidth: 1.5,
    variable: false,
  },
  capacitor: {
    color: "#000000",
    strokeWidth: 2.5,
    leadStrokeWidth: 1.5,
  },
  inductor: {
    color: "#000000",
    strokeWidth: 2.5,
    leadStrokeWidth: 1.5,
  },
  source: {
    color: "#000000",
    strokeWidth: 2.5,
    leadStrokeWidth: 1.5,
  },
  ac_source: {
    color: "#000000",
    strokeWidth: 2.5,
    leadStrokeWidth: 1.5,
  },
  vcc: {
    color: "#000000",
    strokeWidth: 2.5,
    leadStrokeWidth: 1.5,
  },
  gnd: {
    color: "#000000",
    strokeWidth: 2.5,
    leadStrokeWidth: 1.5,
  },
  transistor: {
    color: "#000000",
    strokeWidth: 2.5,
    leadStrokeWidth: 1.5,
    type: "npn",
  },
  gate: {
    color: "#000000",
    strokeWidth: 2.5,
    leadStrokeWidth: 1.5,
    type: "and",
  },
  junction: {
    color: "#000000",
    strokeWidth: 2.5,
    fill: true,
  },
  diode: {
    color: "#000000",
    strokeWidth: 2.5,
    leadStrokeWidth: 1.5,
    led: false,
  },
  op_amp: {
    color: "#000000",
    strokeWidth: 2.5,
    leadStrokeWidth: 1.5,
  },
  math: {
    content: "X",
    fontSize: 16,
    color: "#000000",
    align: "middle",
    verticalAlign: "middle",
  },
};
