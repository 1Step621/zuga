import { Kind } from "../kind";
import { Props } from "./props";

export type ColorField<K extends Kind> = {
  key: keyof Props<K>;
  name: string;
  type: "color";
};

export type LengthField<K extends Kind> = {
  key: keyof Props<K>;
  name: string;
  type: "length";
};

export type TextField<K extends Kind> = {
  key: keyof Props<K>;
  name: string;
  multiline?: boolean;
  type: "text";
};

export type BooleanField<K extends Kind> = {
  key: keyof Props<K>;
  name: string;
  type: "boolean";
};

export type SelectField<K extends Kind> = {
  key: keyof Props<K>;
  name: string;
  options: { label: string; value: any }[];
  type: "select";
};

export type PropField<K extends Kind> =
  | ColorField<K>
  | LengthField<K>
  | TextField<K>
  | BooleanField<K>
  | SelectField<K>;

export const fieldsOfProps: { [K in Kind]: PropField<K>[] } = {
  rectangle: [
    {
      key: "color",
      name: "塗りつぶし",
      type: "color",
    },
    {
      key: "strokeColor",
      name: "線の色",
      type: "color",
    },
    {
      key: "strokeWidth",
      name: "線の太さ",
      type: "length",
    },
    {
      key: "label",
      name: "ラベル",
      type: "text",
      multiline: true,
    },
    {
      key: "labelColor",
      name: "ラベルの色",
      type: "color",
    },
    {
      key: "labelSize",
      name: "ラベルのサイズ",
      type: "length",
    },
    {
      key: "labelPlacement",
      name: "ラベルの位置",
      type: "select",
      options: [
        { label: "中央", value: "center" },
        { label: "上", value: "top" },
        { label: "下", value: "bottom" },
        { label: "左", value: "left" },
        { label: "右", value: "right" },
      ],
    },
  ],
  ellipse: [
    {
      key: "color",
      name: "塗りつぶし",
      type: "color",
    },
    {
      key: "strokeColor",
      name: "線の色",
      type: "color",
    },
    {
      key: "strokeWidth",
      name: "線の太さ",
      type: "length",
    },
    {
      key: "label",
      name: "ラベル",
      type: "text",
      multiline: true,
    },
    {
      key: "labelColor",
      name: "ラベルの色",
      type: "color",
    },
    {
      key: "labelSize",
      name: "ラベルのサイズ",
      type: "length",
    },
    {
      key: "labelPlacement",
      name: "ラベルの位置",
      type: "select",
      options: [
        { label: "中央", value: "center" },
        { label: "上", value: "top" },
        { label: "下", value: "bottom" },
        { label: "左", value: "left" },
        { label: "右", value: "right" },
      ],
    },
  ],
  polygon: [
    {
      key: "color",
      name: "塗りつぶし",
      type: "color",
    },
    {
      key: "strokeColor",
      name: "線の色",
      type: "color",
    },
    {
      key: "strokeWidth",
      name: "線の太さ",
      type: "length",
    },
    {
      key: "label",
      name: "ラベル",
      type: "text",
      multiline: true,
    },
    {
      key: "labelColor",
      name: "ラベルの色",
      type: "color",
    },
    {
      key: "labelSize",
      name: "ラベルのサイズ",
      type: "length",
    },
    {
      key: "labelPlacement",
      name: "ラベルの位置",
      type: "select",
      options: [
        { label: "中央", value: "center" },
        { label: "上", value: "top" },
        { label: "下", value: "bottom" },
        { label: "左", value: "left" },
        { label: "右", value: "right" },
      ],
    },
  ],
  line: [
    {
      key: "color",
      name: "線の色",
      type: "color",
    },
    {
      key: "strokeWidth",
      name: "線の太さ",
      type: "length",
    },
    {
      key: "arrowStart",
      name: "始点の矢印",
      type: "boolean",
    },
    {
      key: "arrowEnd",
      name: "終点の矢印",
      type: "boolean",
    },
  ],
  resistor: [
    {
      key: "color",
      name: "色",
      type: "color",
    },
    {
      key: "strokeWidth",
      name: "素子の太さ",
      type: "length",
    },
    {
      key: "leadStrokeWidth",
      name: "リード線の太さ",
      type: "length",
    },
    {
      key: "type",
      name: "抵抗の種類",
      type: "select",
      options: [
        { label: "固定", value: "fixed" },
        { label: "可変", value: "variable" },
        { label: "半固定", value: "semi_fixed" },
      ],
    },
  ],
  capacitor: [
    {
      key: "color",
      name: "色",
      type: "color",
    },
    {
      key: "strokeWidth",
      name: "素子の太さ",
      type: "length",
    },
    {
      key: "leadStrokeWidth",
      name: "リード線の太さ",
      type: "length",
    },
  ],
  inductor: [
    {
      key: "color",
      name: "色",
      type: "color",
    },
    {
      key: "strokeWidth",
      name: "素子の太さ",
      type: "length",
    },
    {
      key: "leadStrokeWidth",
      name: "リード線の太さ",
      type: "length",
    },
  ],
  source: [
    {
      key: "color",
      name: "色",
      type: "color",
    },
    {
      key: "strokeWidth",
      name: "素子の太さ",
      type: "length",
    },
    {
      key: "leadStrokeWidth",
      name: "リード線の太さ",
      type: "length",
    },
  ],
  ac_source: [
    {
      key: "color",
      name: "色",
      type: "color",
    },
    {
      key: "strokeWidth",
      name: "素子の太さ",
      type: "length",
    },
    {
      key: "leadStrokeWidth",
      name: "リード線の太さ",
      type: "length",
    },
  ],
  vcc: [
    {
      key: "color",
      name: "色",
      type: "color",
    },
    {
      key: "strokeWidth",
      name: "素子の太さ",
      type: "length",
    },
    {
      key: "leadStrokeWidth",
      name: "リード線の太さ",
      type: "length",
    },
  ],
  transistor: [
    {
      key: "color",
      name: "色",
      type: "color",
    },
    {
      key: "strokeWidth",
      name: "素子の太さ",
      type: "length",
    },
    {
      key: "leadStrokeWidth",
      name: "リード線の太さ",
      type: "length",
    },
    {
      key: "photo",
      name: "フォトトランジスタ",
      type: "boolean",
    },
    {
      key: "type",
      name: "タイプ",
      type: "select",
      options: [
        { label: "NPN", value: "npn" },
        { label: "PNP", value: "pnp" },
      ],
    },
  ],
  gate: [
    {
      key: "color",
      name: "色",
      type: "color",
    },
    {
      key: "strokeWidth",
      name: "素子の太さ",
      type: "length",
    },
    {
      key: "leadStrokeWidth",
      name: "リード線の太さ",
      type: "length",
    },
    {
      key: "type",
      name: "タイプ",
      type: "select",
      options: [
        { label: "AND", value: "and" },
        { label: "OR", value: "or" },
        { label: "NOT", value: "not" },
        { label: "NAND", value: "nand" },
        { label: "NOR", value: "nor" },
        { label: "XOR", value: "xor" },
      ],
    },
  ],
  gnd: [
    {
      key: "color",
      name: "色",
      type: "color",
    },
    {
      key: "strokeWidth",
      name: "素子の太さ",
      type: "length",
    },
    {
      key: "leadStrokeWidth",
      name: "リード線の太さ",
      type: "length",
    },
  ],
  diode: [
    {
      key: "color",
      name: "色",
      type: "color",
    },
    {
      key: "strokeWidth",
      name: "素子の太さ",
      type: "length",
    },
    {
      key: "leadStrokeWidth",
      name: "リード線の太さ",
      type: "length",
    },
    {
      key: "led",
      name: "発光ダイオード",
      type: "boolean",
    },
  ],
  op_amp: [
    {
      key: "color",
      name: "色",
      type: "color",
    },
    {
      key: "strokeWidth",
      name: "素子の太さ",
      type: "length",
    },
    {
      key: "leadStrokeWidth",
      name: "リード線の太さ",
      type: "length",
    },
  ],
  junction: [
    {
      key: "color",
      name: "色",
      type: "color",
    },
    {
      key: "strokeWidth",
      name: "線の太さ",
      type: "length",
    },
    {
      key: "fill",
      name: "塗りつぶし",
      type: "boolean",
    },
  ],
  text: [
    {
      key: "content",
      name: "内容",
      type: "text",
      multiline: true,
    },
    {
      key: "fontSize",
      name: "フォントサイズ",
      type: "length",
    },
    {
      key: "color",
      name: "色",
      type: "color",
    },
    {
      key: "align",
      name: "文字揃え(横)",
      type: "select",
      options: [
        { label: "左揃え", value: "start" },
        { label: "中央揃え", value: "middle" },
        { label: "右揃え", value: "end" },
      ],
    },
    {
      key: "verticalAlign",
      name: "文字揃え(縦)",
      type: "select",
      options: [
        { label: "上揃え", value: "top" },
        { label: "中央揃え", value: "middle" },
        { label: "下揃え", value: "bottom" },
      ],
    },
  ],
  math: [
    {
      key: "content",
      name: "数式",
      type: "text",
    },
    {
      key: "fontSize",
      name: "フォントサイズ",
      type: "length",
    },
    {
      key: "color",
      name: "色",
      type: "color",
    },
    {
      key: "align",
      name: "文字揃え(横)",
      type: "select",
      options: [
        { label: "左揃え", value: "start" },
        { label: "中央揃え", value: "middle" },
        { label: "右揃え", value: "end" },
      ],
    },
    {
      key: "verticalAlign",
      name: "文字揃え(縦)",
      type: "select",
      options: [
        { label: "上揃え", value: "top" },
        { label: "中央揃え", value: "middle" },
        { label: "下揃え", value: "bottom" },
      ],
    },
  ],
};
