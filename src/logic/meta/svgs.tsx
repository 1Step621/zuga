import { JSX, splitProps } from "solid-js";
import { Kind } from "../kind";
import { Dynamic } from "solid-js/web";
import { Props } from "./props";
import { Content } from "../content";
import { WorldPos } from "~/utilities/pos";
import { Rectangle } from "./svgs/Rectangle";
import { Ellipse } from "./svgs/Ellipse";
import { Polygon } from "./svgs/Polygon";
import { Line } from "./svgs/Line";
import { Text } from "./svgs/Text";
import { MathShape } from "./svgs/Math";
import { Resistor } from "./svgs/Resistor";
import { Capacitor } from "./svgs/Capacitor";
import { Inductor } from "./svgs/Inductor";
import { Source } from "./svgs/Source";
import { AcSource } from "./svgs/AcSource";
import { Vcc } from "./svgs/Vcc";
import { Gnd } from "./svgs/Gnd";
import { Transistor } from "./svgs/Transistor";
import { Gate } from "./svgs/Gate";
import { Junction } from "./svgs/Junction";
import { Diode } from "./svgs/Diode";
import { OpAmp } from "./svgs/OpAmp";

export const svgs: {
  [K in Kind]: (
    props: {
      points: WorldPos[];
      props: Props<K>;
    } & JSX.ShapeElementSVGAttributes<any>
  ) => JSX.Element;
} = {
  rectangle: Rectangle,
  ellipse: Ellipse,
  polygon: Polygon,
  line: Line,
  text: Text,
  math: MathShape,
  resistor: Resistor,
  capacitor: Capacitor,
  inductor: Inductor,
  source: Source,
  ac_source: AcSource,
  vcc: Vcc,
  gnd: Gnd,
  transistor: Transistor,
  gate: Gate,
  junction: Junction,
  diode: Diode,
  op_amp: OpAmp,
};

const contentExcluded = <K extends Kind>(
  props: {
    content: Content<K>;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  return splitProps(props, ["content"])[1];
};

export const Svg = <K extends Kind>(
  props: {
    content: Content<K>;
  } & JSX.ShapeElementSVGAttributes<any>
): JSX.Element => {
  return (
    <Dynamic
      component={svgs[props.content.kind] as () => JSX.Element}
      points={props.content.points}
      props={props.content.props}
      {...contentExcluded(props)}
    />
  );
};
