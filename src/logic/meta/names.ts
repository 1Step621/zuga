import { Kind } from "../kind";

export const names: Record<Kind, string> = {
  rectangle: "四角形",
  ellipse: "楕円",
  polygon: "多角形",
  line: "線",
  text: "テキスト",
  math: "数式",
  resistor: "抵抗",
  capacitor: "コンデンサ",
  inductor: "インダクタ",
  source: "直流電源",
  ac_source: "交流電源",
  vcc: "VCC",
  gnd: "GND",
  transistor: "トランジスタ",
  gate: "論理ゲート",
  junction: "結合点",
  diode: "ダイオード",
  op_amp: "オペアンプ",
};
