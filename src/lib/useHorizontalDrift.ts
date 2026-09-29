"use client";

import { useEffect, useRef } from "react";
import { useForestMotion } from "@/components/forest/ForestEnvironment";

/** Native scrolling takes over during interaction; drift resumes on release. */
export function useHorizontalDrift(disabled: boolean, itemCount: number, { loop = false, speed = 38 }: { loop?: boolean; speed?: number } = {}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const manualUntil = useRef(0);
  const { paused } = useForestMotion();
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.dataset.horizontalTrack = "true";
    track.dataset.motion = "paused";
    if (itemCount < 2) return;
    let frame = 0, previous = 0, position = track.scrollLeft, direction = 1, restUntil = 0;
    let visible = false, hovered = track.matches(":hover"), holding = false, keyboardFocus = false;
    let drag: { x: number; left: number; pointerId: number } | null = null;
    let dragged = false;
    const tick = (now: number) => {
      const dt = previous ? Math.min(now - previous, 50) : 0; previous = now;
      const running = !disabled && !paused && visible && !document.hidden && document.documentElement.dataset.forestMenu !== "true" && !hovered && !holding && !keyboardFocus && now >= Math.max(restUntil, manualUntil.current) && !document.querySelector("dialog[open]");
      track.dataset.motion = running ? "playing" : "paused";
      if (running) {
        const max = track.scrollWidth - track.clientWidth;
        if (Math.abs(track.scrollLeft - position) > 2) position = track.scrollLeft;
        if (max > 1) {
          position += direction * dt * speed / 1000;
          if (loop) position %= max;
          else {
            if (position >= max) { position = max; direction = -1; restUntil = now + 650; }
            if (position <= 0) { position = 0; direction = 1; restUntil = now + 650; }
          }
          track.scrollLeft = position;
        }
      } else position = track.scrollLeft;
      frame = requestAnimationFrame(tick);
    };
    const enter = (event: PointerEvent) => { if (event.pointerType === "mouse") hovered = true; };
    const leave = () => { hovered = false; restUntil = performance.now() + 350; };
    const nested = (event: Event) => (event.target as HTMLElement).closest('[data-horizontal-track]') !== track;
    const down = (event: PointerEvent) => {
      if (disabled || event.button !== 0 || nested(event)) return;
      holding = true; dragged = false;
      if (event.pointerType === "mouse") drag = { x: event.clientX, left: track.scrollLeft, pointerId: event.pointerId };
    };
    const move = (event: PointerEvent) => {
      if (!drag) return;
      const distance = event.clientX - drag.x;
      if (!dragged && Math.abs(distance) < 6) return;
      dragged = true; event.preventDefault(); track.setPointerCapture(drag.pointerId); track.dataset.dragging = "true";
      track.scrollLeft = drag.left - distance;
    };
    const up = () => {
      if (!holding) return;
      holding = false;
      if (drag && track.hasPointerCapture(drag.pointerId)) track.releasePointerCapture(drag.pointerId);
      drag = null; track.dataset.dragging = "false"; restUntil = performance.now() + 1200;
    };
    const click = (event: MouseEvent) => { if (dragged) { event.preventDefault(); event.stopPropagation(); dragged = false; } };
    const wheel = (event: WheelEvent) => {
      if (disabled || event.ctrlKey || nested(event) || event.defaultPrevented) return;
      const delta = (Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? track.clientWidth : 1);
      const max = track.scrollWidth - track.clientWidth;
      if ((delta > 0 && track.scrollLeft < max - 1) || (delta < 0 && track.scrollLeft > 1)) { event.preventDefault(); track.scrollLeft += delta; }
      restUntil = performance.now() + 1200;
    };
    const focus = (event: FocusEvent) => { keyboardFocus = (event.target as HTMLElement).matches(":focus-visible"); };
    const blur = (event: FocusEvent) => { if (!track.contains(event.relatedTarget as Node | null)) keyboardFocus = false; };
    const key = (event: KeyboardEvent) => {
      if (disabled || nested(event)) return;
      keyboardFocus = true;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault(); track.scrollBy({ left: (event.key === "ArrowRight" ? 1 : -1) * track.clientWidth * 0.7, behavior: paused ? "instant" : "smooth" });
      }
    };
    const visibility = () => { cancelAnimationFrame(frame); previous = 0; if (!document.hidden) frame = requestAnimationFrame(tick); else track.dataset.motion = "paused"; };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.1 });
    observer.observe(track);
    track.addEventListener("pointerenter", enter); track.addEventListener("pointerleave", leave);
    track.addEventListener("pointerdown", down); track.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up); track.addEventListener("pointercancel", up);
    track.addEventListener("click", click, true); track.addEventListener("wheel", wheel, { passive: false });
    track.addEventListener("focusin", focus); track.addEventListener("focusout", blur); track.addEventListener("keydown", key);
    document.addEventListener("visibilitychange", visibility); frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame); observer.disconnect();
      track.removeEventListener("pointerenter", enter); track.removeEventListener("pointerleave", leave);
      track.removeEventListener("pointerdown", down); track.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up); track.removeEventListener("pointercancel", up);
      track.removeEventListener("click", click, true); track.removeEventListener("wheel", wheel);
      track.removeEventListener("focusin", focus); track.removeEventListener("focusout", blur); track.removeEventListener("keydown", key);
      document.removeEventListener("visibilitychange", visibility); track.dataset.motion = "paused";
    };
  }, [disabled, paused, itemCount, loop, speed]);
  return { trackRef, rest: () => { manualUntil.current = performance.now() + 1200; } };
}
