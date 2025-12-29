import { WorldPos } from "./pos";
import { Kind } from "./props";

export type Mode = keyof Hands;
type Hands = {
  draw: {
    mode: "draw";
    kind: Kind;
    points: WorldPos[];
  };
  select: {
    mode: "select";
    selecteds: string[];
  };
};

export type Hand = Hands[Mode];

export const defaultHand = <M extends Mode>(mode: M): Hands[M] => {
  if (mode === "draw") {
    return {
      mode: "draw",
      kind: "rectangle",
      points: [] as WorldPos[],
    } as Hands[M];
  } else {
    return {
      mode: "select",
      selecteds: [] as string[],
    } as Hands[M];
  }
};
