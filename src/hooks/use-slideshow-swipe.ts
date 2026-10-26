import { useEffect, useRef } from "react";

const SWIPE_THRESHOLD = 48;

export function useSlideshowSwipe(onPrevious: () => void, onNext: () => void) {
  const frameRef = useRef<HTMLElement>(null);
  const callbacksRef = useRef({ onPrevious, onNext });
  callbacksRef.current = { onPrevious, onNext };

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let startPoint: { x: number; y: number; identifier: number } | null = null;

    const onTouchStart = (event: globalThis.TouchEvent) => {
      if (event.touches.length !== 1) {
        startPoint = null;
        return;
      }
      const touch = event.changedTouches[0];
      startPoint = touch
        ? { x: touch.clientX, y: touch.clientY, identifier: touch.identifier }
        : null;
    };

    const onTouchEnd = (event: globalThis.TouchEvent) => {
      const start = startPoint;
      startPoint = null;
      const touch = event.changedTouches[0];
      if (!start || !touch || touch.identifier !== start.identifier) return;

      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;
      if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY)) return;

      if (deltaX < 0) callbacksRef.current.onNext();
      else callbacksRef.current.onPrevious();
    };

    const onTouchCancel = () => {
      startPoint = null;
    };

    frame.addEventListener("touchstart", onTouchStart, { passive: true });
    frame.addEventListener("touchend", onTouchEnd, { passive: true });
    frame.addEventListener("touchcancel", onTouchCancel, { passive: true });

    return () => {
      frame.removeEventListener("touchstart", onTouchStart);
      frame.removeEventListener("touchend", onTouchEnd);
      frame.removeEventListener("touchcancel", onTouchCancel);
    };
  }, []);

  return frameRef;
}
