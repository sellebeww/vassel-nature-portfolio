"use client";

import { useEffect, useRef } from "react";
import { useForestMotion } from "@/components/forest/ForestEnvironment";

const PHOTO_INTERVAL = 1800;
const SLIDE_DURATION = 300;

/** Hold each photo, then slide quickly to the next one with a fixed 300 ms transition. */
export function usePhotoSlides(stopped: boolean, count: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<(index: number) => void>(() => {});
  const { reduced } = useForestMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let visible = false, focused = false, holding = false;
    let nextAt = performance.now() + PHOTO_INTERVAL, wheelAt = 0, dragged = false;
    let width = track.clientWidth;
    let animation = 0, destinationPage: number | null = null;
    let drag: { x: number; left: number; id: number } | null = null;
    const index = () => Math.round(track.scrollLeft / (width || 1));
    const settle = () => {
      cancelAnimationFrame(animation);
      if (destinationPage !== null) track.scrollTo({ left: (destinationPage % count) * width, behavior: "instant" });
      destinationPage = null; track.dataset.sliding = "false";
    };
    const go = (target: number) => {
      if (!width || count < 2) return;
      settle();
      const page = target < 0 ? count - 1 : Math.min(target, count);
      destinationPage = page;
      if (reduced) settle();
      else {
        const from = track.scrollLeft, start = performance.now();
        track.dataset.sliding = "true";
        const slide = (now: number) => {
          const progress = Math.min((now - start) / SLIDE_DURATION, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          track.scrollLeft = from + (page * width - from) * eased;
          if (progress < 1) animation = requestAnimationFrame(slide);
          else settle();
        };
        animation = requestAnimationFrame(slide);
      }
      nextAt = performance.now() + PHOTO_INTERVAL;
    };
    const normalize = () => {
      if (!holding && destinationPage === null && count > 1 && track.scrollLeft >= count * width - 1) track.scrollTo({ left: 0, behavior: "instant" });
    };
    selectRef.current = page => go(page);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: .1 });
    observer.observe(track);
    const resize = new ResizeObserver(() => {
      settle();
      const page = index() % count;
      width = track.clientWidth;
      track.scrollTo({ left: page * width, behavior: "instant" });
      nextAt = performance.now() + PHOTO_INTERVAL;
    });
    resize.observe(track);
    const timer = window.setInterval(() => {
      const now = performance.now();
      const blocked = stopped || reduced || count < 2 || !visible || document.hidden || focused || holding
        || document.documentElement.dataset.forestMenu === "true" || !!document.querySelector("dialog[open]");
      track.dataset.motion = blocked ? "paused" : "playing";
      if (blocked) nextAt = now + PHOTO_INTERVAL;
      else if (now >= nextAt) { normalize(); go(index() + 1); }
    }, 100);
    const down = (event: PointerEvent) => {
      if (event.button !== 0) return;
      settle();
      holding = true; dragged = false;
      if (event.pointerType === "mouse") drag = { x: event.clientX, left: track.scrollLeft, id: event.pointerId };
    };
    const move = (event: PointerEvent) => {
      if (!drag) return;
      const distance = event.clientX - drag.x;
      if (Math.abs(distance) < 6 && !dragged) return;
      dragged = true; event.preventDefault();
      track.dataset.dragging = "true"; track.setPointerCapture(drag.id);
      track.scrollLeft = drag.left - distance;
    };
    const up = () => {
      if (!holding) return;
      holding = false;
      if (drag && track.hasPointerCapture(drag.id)) track.releasePointerCapture(drag.id);
      const mouseDrag = !!drag && dragged;
      drag = null; track.dataset.dragging = "false";
      if (mouseDrag) go(index());
      nextAt = performance.now() + PHOTO_INTERVAL;
    };
    const click = (event: MouseEvent) => { if (dragged) { event.preventDefault(); event.stopPropagation(); dragged = false; } };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || count < 2) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (!delta) return;
      event.preventDefault();
      const now = performance.now();
      if (now < wheelAt) return;
      settle(); normalize(); go(index() + Math.sign(delta)); wheelAt = now + 450;
    };
    const focus = (event: FocusEvent) => { focused = (event.target as HTMLElement).matches(":focus-visible"); };
    const blur = (event: FocusEvent) => { if (!track.contains(event.relatedTarget as Node | null)) focused = false; };
    const key = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault(); focused = true; settle(); normalize(); go(index() + (event.key === "ArrowRight" ? 1 : -1));
    };
    track.addEventListener("scrollend", normalize);
    track.addEventListener("pointerdown", down); track.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up); track.addEventListener("pointercancel", up);
    track.addEventListener("click", click, true); track.addEventListener("wheel", wheel, { passive: false });
    track.addEventListener("focusin", focus); track.addEventListener("focusout", blur); track.addEventListener("keydown", key);
    return () => {
      settle(); clearInterval(timer); observer.disconnect(); resize.disconnect(); selectRef.current = () => {};
      track.removeEventListener("scrollend", normalize);
      track.removeEventListener("pointerdown", down); track.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up); track.removeEventListener("pointercancel", up);
      track.removeEventListener("click", click, true); track.removeEventListener("wheel", wheel);
      track.removeEventListener("focusin", focus); track.removeEventListener("focusout", blur); track.removeEventListener("keydown", key);
      track.dataset.dragging = "false"; track.dataset.motion = "paused";
    };
  }, [stopped, reduced, count]);

  return { trackRef, select: (index: number) => selectRef.current(index) };
}
