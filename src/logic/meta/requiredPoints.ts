import { Constraint } from "~/utilities/constraint";
import { Kind } from "../kind";

export const requiredPoints: Record<Kind, Constraint> = {
  rectangle: { exact: 2 },
  ellipse: { exact: 2 },
  polygon: { min: 2 },
  line: { min: 2 },
  text: { exact: 1 },
  math: { exact: 1 },
  resistor: { exact: 2 },
  capacitor: { exact: 2 },
  inductor: { exact: 2 },
  source: { exact: 2 },
  ac_source: { exact: 2 },
  vcc: { exact: 2 },
  gnd: { exact: 2 },
  transistor: { exact: 2 },
  gate: { exact: 2 },
  junction: { exact: 1 },
  diode: { exact: 2 },
};
