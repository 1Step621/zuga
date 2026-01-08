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
  };
  resistor: {
    color: string;
    strokeWidth: number;
    variable?: boolean;
  };
  capacitor: {
    color: string;
    strokeWidth: number;
  };
  inductor: {
    color: string;
    strokeWidth: number;
  };
  source: {
    color: string;
    strokeWidth: number;
  };
  ac_source: {
    color: string;
    strokeWidth: number;
  };
  vcc: {
    color: string;
    strokeWidth: number;
  };
  gnd: {
    color: string;
    strokeWidth: number;
  };
  transistor: {
    color: string;
    strokeWidth: number;
    type: "npn" | "pnp";
  };
  gate: {
    color: string;
    strokeWidth: number;
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
  };
  math: {
    content: string;
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
    strokeWidth: 2,
    label: "",
    labelColor: "#000000",
    labelSize: 16,
    labelPlacement: "center",
  },
  ellipse: {
    color: "transparent",
    strokeColor: "#000000",
    strokeWidth: 2,
    label: "",
    labelColor: "#000000",
    labelSize: 16,
    labelPlacement: "center",
  },
  polygon: {
    color: "transparent",
    strokeColor: "#000000",
    strokeWidth: 2,
    label: "",
    labelColor: "#000000",
    labelSize: 16,
    labelPlacement: "center",
  },
  line: {
    color: "#000000",
    strokeWidth: 2,
    arrowStart: false,
    arrowEnd: false,
  },
  text: {
    content: "Text",
    fontSize: 16,
    color: "#000000",
  },
  resistor: {
    color: "#000000",
    strokeWidth: 2,
    variable: false,
  },
  capacitor: {
    color: "#000000",
    strokeWidth: 2,
  },
  inductor: {
    color: "#000000",
    strokeWidth: 2,
  },
  source: {
    color: "#000000",
    strokeWidth: 2,
  },
  ac_source: {
    color: "#000000",
    strokeWidth: 2,
  },
  vcc: {
    color: "#000000",
    strokeWidth: 2,
  },
  gnd: {
    color: "#000000",
    strokeWidth: 2,
  },
  transistor: {
    color: "#000000",
    strokeWidth: 2,
    type: "npn",
  },
  gate: {
    color: "#000000",
    strokeWidth: 2,
    type: "and",
  },
  junction: {
    color: "#000000",
    strokeWidth: 2,
    fill: true,
  },
  diode: {
    color: "#000000",
    strokeWidth: 2,
  },
  math: {
    content: "X"
  }
};
