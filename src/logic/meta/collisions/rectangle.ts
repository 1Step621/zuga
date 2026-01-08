import { WorldPos } from "~/utilities/pos";
import { Content } from "../../content";
import { prerenders } from "../prerenders";

export const isCollidingRectangle = (
  content: Content<"rectangle">,
  pos: WorldPos
): boolean => {
  const shape = prerenders.rectangle(content.points);

  const threshold = content.props.strokeWidth / 2 + 10;

  const withinX =
    pos.x >= shape.position.x - threshold &&
    pos.x <= shape.position.x + shape.size.x + threshold;
  const withinY =
    pos.y >= shape.position.y - threshold &&
    pos.y <= shape.position.y + shape.size.y + threshold;

  const onLeftEdge = Math.abs(pos.x - shape.position.x) <= threshold && withinY;
  const onRightEdge =
    Math.abs(pos.x - (shape.position.x + shape.size.x)) <= threshold && withinY;
  const onTopEdge = Math.abs(pos.y - shape.position.y) <= threshold && withinX;
  const onBottomEdge =
    Math.abs(pos.y - (shape.position.y + shape.size.y)) <= threshold && withinX;

  return (
    onLeftEdge ||
    onRightEdge ||
    onTopEdge ||
    onBottomEdge ||
    (content.props.color !== "transparent" && withinX && withinY)
  );
};
