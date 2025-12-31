import { Kind } from "../kind";

export type OtherProps<K extends Kind> = {
  rectangle: {
    color: string;
    strokeColor: string;
    strokeWidth: number;
  };
  ellipse: {
    color: string;
    strokeColor: string;
    strokeWidth: number;
  };
  line: {
    color: string;
    strokeWidth: number;
  };
  text: {
    content: string;
    fontSize: number;
    color: string;
  };
}[K];

export const defaultOtherProps: { [K in Kind]: OtherProps<K> } = {
  rectangle: {
    color: "transparent",
    strokeColor: "#000000",
    strokeWidth: 2,
  },
  ellipse: {
    color: "transparent",
    strokeColor: "#000000",
    strokeWidth: 2,
  },
  line: { color: "#000000", strokeWidth: 2 },
  text: {
    content: "Text",
    fontSize: 16,
    color: "#000000",
  },
};
