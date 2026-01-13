import { JSX, Show } from "solid-js";
import { Props } from "../props";
import { WorldPos } from "~/utilities/pos";
import { prerenders } from "../prerenders";
import { propsExcluded } from "./utils";

export const Line = (
  props: {
    points: WorldPos[];
    props: Props<"line">;
  } & JSX.ShapeElementSVGAttributes<any>
) => {
  const shape = () => prerenders.line(props.points);
  const arrowSize = (strokeWidth: number) => strokeWidth * 3 + 4;
  const arrowOverlap = 1;
  const arrowDepth = (strokeWidth: number) => {
    const depth = arrowSize(strokeWidth) * Math.cos(Math.PI / 6) - arrowOverlap;
    return depth < 0 ? 0 : depth;
  };
  const adjustPoint = (from: WorldPos, to: WorldPos, offset: number) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy);
    if (length <= 0) {
      return from;
    }
    const ratio = offset / length;
    return {
      x: from.x + dx * ratio,
      y: from.y + dy * ratio,
    };
  };
  const adjustedPoints = () => {
    const points = shape().points;
    if (points.length < 2) {
      return points;
    }
    const result = points.slice();
    const depth = arrowDepth(props.props.strokeWidth);
    let startOffset = props.props.arrowStart ? depth : 0;
    let endOffset = props.props.arrowEnd ? depth : 0;
    if (0 < startOffset) {
      const p0 = points[0];
      const p1 = points[1];
      const segLength = Math.hypot(p1.x - p0.x, p1.y - p0.y);
      if (segLength <= 0) {
        startOffset = 0;
      } else {
        startOffset = Math.min(startOffset, segLength);
      }
    }
    if (0 < endOffset) {
      const pn = points[points.length - 1];
      const pn_1 = points[points.length - 2];
      const segLength = Math.hypot(pn.x - pn_1.x, pn.y - pn_1.y);
      if (segLength <= 0) {
        endOffset = 0;
      } else {
        endOffset = Math.min(endOffset, segLength);
      }
    }
    if (points.length === 2 && 0 < startOffset + endOffset) {
      const segLength = Math.hypot(
        points[1].x - points[0].x,
        points[1].y - points[0].y,
      );
      if (0 < segLength && segLength < startOffset + endOffset) {
        const scale = segLength / (startOffset + endOffset);
        startOffset *= scale;
        endOffset *= scale;
      }
    }
    if (0 < startOffset) {
      result[0] = adjustPoint(points[0], points[1], startOffset);
    }
    if (0 < endOffset) {
      result[result.length - 1] = adjustPoint(
        points[points.length - 1],
        points[points.length - 2],
        endOffset,
      );
    }
    return result;
  };
  const arrowHead = (
    pos: WorldPos,
    angle: number,
    color: string,
    strokeWidth: number
  ) => {
    const size = arrowSize(strokeWidth); // 矢印のサイズ
    const x1 = pos.x - size * Math.cos(angle - Math.PI / 6);
    const y1 = pos.y - size * Math.sin(angle - Math.PI / 6);
    const x2 = pos.x - size * Math.cos(angle + Math.PI / 6);
    const y2 = pos.y - size * Math.sin(angle + Math.PI / 6);
    return (
      <polygon
        points={`${pos.x},${pos.y} ${x1},${y1} ${x2},${y2}`}
        fill={color}
        stroke="none"
      />
    );
  };

  return (
    <g {...propsExcluded(props)}>
      <polyline
        points={adjustedPoints()
          .map((pt) => `${pt.x},${pt.y}`)
          .join(" ")}
        fill="none"
        stroke={props.props.color}
        stroke-width={props.props.strokeWidth}
      />
      <Show when={props.props.arrowStart && shape().points.length >= 2}>
        {(() => {
          const p0 = shape().points[0];
          const p1 = shape().points[1];
          // 始点は p1 -> p0 の方向を向く
          return arrowHead(
            p0,
            Math.atan2(p0.y - p1.y, p0.x - p1.x),
            props.props.color,
            props.props.strokeWidth
          );
        })()}
      </Show>
      <Show when={props.props.arrowEnd && shape().points.length >= 2}>
        {(() => {
          const points = shape().points;
          const pn = points[points.length - 1];
          const pn_1 = points[points.length - 2];
          // 終点は pn_1 -> pn の方向を向く
          return arrowHead(
            pn,
            Math.atan2(pn.y - pn_1.y, pn.x - pn_1.x),
            props.props.color,
            props.props.strokeWidth
          );
        })()}
      </Show>
    </g>
  );
};
