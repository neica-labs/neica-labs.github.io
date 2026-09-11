export function clampTransform(viewport, image, transform) {
  const zoom = Math.min(4, Math.max(0.5, transform.zoom));
  const fit = Math.min(
    viewport.width / image.width,
    viewport.height / image.height,
  );
  const limitX = Math.max(0, (image.width * fit * zoom - viewport.width) / 2);
  const limitY = Math.max(0, (image.height * fit * zoom - viewport.height) / 2);
  return {
    zoom,
    x: Math.min(limitX, Math.max(-limitX, transform.x)),
    y: Math.min(limitY, Math.max(-limitY, transform.y)),
  };
}
export function isSwipe(dx, dy, elapsed) {
  return (
    elapsed < 800 && Math.abs(dx) >= 55 && Math.abs(dx) > Math.abs(dy) * 1.4
  );
}
