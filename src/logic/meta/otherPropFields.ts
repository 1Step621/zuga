import { Kind } from "../kind";
import { OtherProps } from "./otherProps";

export type ColorField<K extends Kind> = {
  key: keyof OtherProps<K>;
  name: string;
  type: "color";
};

export type LengthField<K extends Kind> = {
  key: keyof OtherProps<K>;
  name: string;
  type: "length";
};

export type TextField<K extends Kind> = {
  key: keyof OtherProps<K>;
  name: string;
  multiline?: boolean;
  type: "text";
};

export type OtherPropField<K extends Kind> =
  | ColorField<K>
  | LengthField<K>
  | TextField<K>;

export const fieldsOfOtherProps: { [K in Kind]: OtherPropField<K>[] } = {
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
  ],
  text: [
    {
      key: "content",
      name: "内容",
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
  ],
};
