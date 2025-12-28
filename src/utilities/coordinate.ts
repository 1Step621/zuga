import { ScreenPos, toScreenPos, toWorldPos, WorldPos } from "./pos";

export const screenToWorld = (pos: ScreenPos, camera: { scale: number, center: WorldPos }, windowSize: { width: number, height: number }) => {
  const worldX = pos.x / camera.scale + (camera.center.x - windowSize.width / 2 / camera.scale);
  const worldY = pos.y / camera.scale + (camera.center.y - windowSize.height / 2 / camera.scale);
  return toWorldPos({ x: worldX, y: worldY });
}

export const worldToScreen = (pos: WorldPos, camera: { scale: number, center: WorldPos }, windowSize: { width: number, height: number }) => {
  const screenX = (pos.x - (camera.center.x - windowSize.width / 2 / camera.scale)) * camera.scale;
  const screenY = (pos.y - (camera.center.y - windowSize.height / 2 / camera.scale)) * camera.scale;
  return toScreenPos({ x: screenX, y: screenY });
}
