import { useEffect, useRef, useState, type PointerEvent } from "react";
import { clampTransform, isSwipe } from "./geometry.mjs";
type Point = { x: number; y: number };
type Transform = Point & { zoom: number };
export default function useZoomPan(
  key: string,
  image: { width: number; height: number },
  onSwipe: (direction: number) => void,
) {
  const surface = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [transform, setTransform] = useState<Transform>({
    zoom: 1,
    x: 0,
    y: 0,
  });
  const state = useRef(transform);
  state.current = transform;
  const imageRef = useRef(image);
  imageRef.current = image;
  const sizeRef = useRef(viewport);
  sizeRef.current = viewport;
  const pointers = useRef(new Map<number, Point>());
  const start = useRef<{ point: Point; state: Transform; time: number } | null>(
    null,
  );
  const pinch = useRef<{
    distance: number;
    zoom: number;
    anchor: Point;
  } | null>(null);
  const hadPinch = useRef(false);
  const swipeRef = useRef(onSwipe);
  swipeRef.current = onSwipe;
  function update(next: Transform) {
    const bounded = clampTransform(sizeRef.current, imageRef.current, next);
    state.current = bounded;
    setTransform(bounded);
  }
  function reset() {
    pointers.current.clear();
    pinch.current = null;
    start.current = null;
    hadPinch.current = false;
    update({ zoom: 1, x: 0, y: 0 });
  }
  useEffect(() => {
    reset();
  }, [key]);
  useEffect(() => {
    const node = surface.current;
    if (!node) return;
    const measure = () => {
      const bounds = node.getBoundingClientRect();
      const next = { width: bounds.width, height: bounds.height };
      sizeRef.current = next;
      setViewport(next);
      update(state.current);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    const clear = () => {
      pointers.current.clear();
      start.current = null;
      pinch.current = null;
      hadPinch.current = false;
    };
    window.addEventListener("blur", clear);
    return () => {
      observer.disconnect();
      clear();
      window.removeEventListener("blur", clear);
    };
  }, [key]);
  function local(point: Point): Point {
    const box = surface.current!.getBoundingClientRect();
    return {
      x: point.x - box.left - box.width / 2,
      y: point.y - box.top - box.height / 2,
    };
  }
  function down(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || (event.target as HTMLElement).closest("button,a"))
      return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, point);
    if (pointers.current.size === 1)
      start.current = {
        point,
        state: { ...state.current },
        time: performance.now(),
      };
    if (pointers.current.size === 2) {
      hadPinch.current = true;
      const [a, b] = [...pointers.current.values()];
      const mid = local({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
      pinch.current = {
        distance: Math.hypot(a.x - b.x, a.y - b.y),
        zoom: state.current.zoom,
        anchor: {
          x: (mid.x - state.current.x) / state.current.zoom,
          y: (mid.y - state.current.y) / state.current.zoom,
        },
      };
    }
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    event.preventDefault();
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const mid = local({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
      const zoom = Math.min(
        4,
        Math.max(
          0.5,
          (pinch.current.zoom * Math.hypot(a.x - b.x, a.y - b.y)) /
            Math.max(1, pinch.current.distance),
        ),
      );
      update({
        zoom,
        x: mid.x - pinch.current.anchor.x * zoom,
        y: mid.y - pinch.current.anchor.y * zoom,
      });
    } else if (!hadPinch.current && start.current && state.current.zoom > 1) {
      update({
        ...state.current,
        x: start.current.state.x + event.clientX - start.current.point.x,
        y: start.current.state.y + event.clientY - start.current.point.y,
      });
    }
  }
  function end(event: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    if (
      event.type === "pointerup" &&
      !hadPinch.current &&
      start.current &&
      state.current.zoom <= 1
    ) {
      const dx = event.clientX - start.current.point.x,
        dy = event.clientY - start.current.point.y;
      if (isSwipe(dx, dy, performance.now() - start.current.time))
        swipeRef.current(dx < 0 ? 1 : -1);
    }
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) {
      start.current = null;
      hadPinch.current = false;
    }
  }
  function zoomBy(delta: number) {
    update({ ...state.current, zoom: state.current.zoom + delta });
  }
  const fit = Math.min(
    viewport.width / image.width,
    viewport.height / image.height,
  );
  return {
    surface,
    zoom: transform.zoom,
    zoomBy,
    reset,
    bindings: {
      onPointerDown: down,
      onPointerMove: move,
      onPointerUp: end,
      onPointerCancel: end,
      onLostPointerCapture: end,
    },
    style: {
      width: image.width * fit,
      height: image.height * fit,
      maxWidth: "none",
      maxHeight: "none",
      transform: `translate(-50%, -50%) translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
    },
  };
}
