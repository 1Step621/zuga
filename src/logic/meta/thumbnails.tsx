import { JSX } from "solid-js";
import { Kind } from "../kind";

export const thumbnails = (kind: Kind): JSX.Element => {
  switch (kind) {
    case "rectangle":
      return (
        <svg width="40" height="40">
          <rect
            x="8"
            y="8"
            width="24"
            height="24"
            fill="transparent"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      );
    case "ellipse":
      return (
        <svg width="40" height="40">
          <ellipse
            cx="20"
            cy="20"
            rx="12"
            ry="12"
            fill="transparent"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      );
    case "polygon":
      return (
        <svg width="40" height="40">
          <polygon
            points="20,8 32,32 8,32"
            fill="transparent"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      );
    case "line":
      return (
        <svg width="40" height="40">
          <line
            x1="8"
            y1="32"
            x2="32"
            y2="8"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      );
    case "resistor":
      return (
        <svg width="40" height="40">
          <line
            x1="2.5"
            y1="20"
            x2="9"
            y2="20"
            stroke="currentColor"
            stroke-width="2"
          />
          <rect
            x="9"
            y="15"
            width="22"
            height="10"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="31"
            y1="20"
            x2="37.5"
            y2="20"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      );
    case "capacitor":
      return (
        <svg width="40" height="40">
          <line
            x1="5"
            y1="20"
            x2="15"
            y2="20"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="15"
            y1="10"
            x2="15"
            y2="30"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="25"
            y1="10"
            x2="25"
            y2="30"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="25"
            y1="20"
            x2="35"
            y2="20"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      );
    case "inductor":
      return (
        <svg width="40" height="40">
          <path
            d="M 2 20 L 4 20 A 4 4 0 0 1 12 20 A 4 4 0 0 1 20 20 A 4 4 0 0 1 28 20 A 4 4 0 0 1 36 20 L 38 20"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      );
    case "source":
      return (
        <svg width="40" height="40">
          <line
            x1="5"
            y1="20"
            x2="17"
            y2="20"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="17"
            y1="10"
            x2="17"
            y2="30"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="23"
            y1="15"
            x2="23"
            y2="25"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="23"
            y1="20"
            x2="35"
            y2="20"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      );
    case "ac_source":
      return (
        <svg width="40" height="40">
          <circle
            cx="20"
            cy="20"
            r="12"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M 12 20 Q 16 12 20 20 T 28 20"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      );
    case "vcc":
      return (
        <svg width="40" height="40">
          <line
            x1="20"
            y1="10"
            x2="20"
            y2="35"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="10"
            y1="10"
            x2="30"
            y2="10"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      );
    case "gnd":
      return (
        <svg width="40" height="40">
          <line
            x1="20"
            y1="5"
            x2="20"
            y2="20"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="10"
            y1="20"
            x2="30"
            y2="20"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="13"
            y1="25"
            x2="27"
            y2="25"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="16"
            y1="30"
            x2="24"
            y2="30"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      );
    case "transistor":
      return (
        <svg width="40" height="40">
          <line
            x1="5"
            y1="20"
            x2="18"
            y2="20"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="18"
            y1="12"
            x2="18"
            y2="28"
            stroke="currentColor"
            stroke-width="3"
          />
          <path
            d="M 18 15 L 28 8 L 35 8"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <path
            d="M 18 25 L 28 32 L 35 32"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      );
    case "gate":
      return (
        <svg width="40" height="40">
          <path
            d="M 14 12 L 14 28 L 22 28 A 8 8 0 0 0 22 12 Z"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="30"
            y1="20"
            x2="36"
            y2="20"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="6"
            y1="16"
            x2="14"
            y2="16"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="6"
            y1="24"
            x2="14"
            y2="24"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      );
    case "junction":
      return (
        <svg width="40" height="40">
          <circle cx="20" cy="20" r="4" fill="currentColor" />
        </svg>
      );
    case "diode":
      return (
        <svg width="40" height="40">
          <path
            d="M 14 12 L 26 20 L 14 28 Z"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="26"
            y1="12"
            x2="26"
            y2="28"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="5"
            y1="20"
            x2="14"
            y2="20"
            stroke="currentColor"
            stroke-width="2"
          />
          <line
            x1="26"
            y1="20"
            x2="35"
            y2="20"
            stroke="currentColor"
            stroke-width="2"
          />
        </svg>
      );
    case "text":
      return (
        <svg width="40" height="40">
          <text
            x="20"
            y="30"
            text-anchor="middle"
            font-size="28"
            fill="currentColor"
          >
            A
          </text>
        </svg>
      );
    case "math":
      return (
        <svg width="40" height="40">
          <text
            x="20"
            y="30"
            text-anchor="middle"
            font-size="28"
            fill="currentColor"
          >
            ∑
          </text>
        </svg>
      );
    default:
      kind satisfies never;
      return <div />;
  }
};
