"use client";

import Image from "next/image";
import { useEffect, useRef, type RefObject } from "react";
import { useTheme } from "@/lib/theme";
import { subscribeForestFrame } from "@/lib/forestFrame";
import { isForestSpaceClear, smoothStep } from "@/lib/forestWildlife";

/** A visible night visitor followed by a brief, monochrome jumpscare. */
export default function ForestResidents() {
  const { theme } = useTheme();
  const cooldownRef = useRef(0);
  return theme === "dark" ? <NightWatcher cooldownRef={cooldownRef} /> : null;
}

function NightWatcher({ cooldownRef }: { cooldownRef: RefObject<number> }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLButtonElement>(null);
  const scareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current, figure = figureRef.current, scare = scareRef.current;
    if (!root || !figure || !scare) return;
    const sprites = [figure.querySelector("img"), scare.querySelector("img")];
    let clock = 0, nextAllowed = Infinity, paused = true, scared = false;
    let scareTimer: number | undefined;
    let visit: { start: number; duration: number; top: number; right: boolean; width: number; height: number } | null = null;
    const hide = () => {
      visit = null; root.style.opacity = "0"; root.dataset.visit = "resting";
    };
    const finishScare = () => {
      clearTimeout(scareTimer);
      scare.dataset.active = "false";
      scared = false;
      hide();
    };
    const jumpscare = () => {
      if (!visit || paused || scared || document.hidden) return;
      scared = true;
      hide();
      scare.dataset.active = "true";
      nextAllowed = clock + 18000 + Math.random() * 12000;
      cooldownRef.current = nextAllowed;
      scareTimer = window.setTimeout(finishScare, 680);
    };
    figure.addEventListener("click", jumpscare);
    const unsubscribe = subscribeForestFrame(frame => {
      clock = frame.elapsed;
      paused = frame.paused || frame.menuOpen || !!document.querySelector("dialog[open]");
      if (nextAllowed === Infinity) nextAllowed = Math.max(cooldownRef.current, clock + 3500 + Math.random() * 2000);
      if (paused) { finishScare(); return; }
      if (scared) return;
      if (!visit && clock >= nextAllowed) {
        if (!sprites.every(sprite => sprite?.complete && sprite.naturalWidth > 0)) return;
        const width = frame.width < 768 ? 126 : 182, height = width;
        const candidates = [];
        // A shorter peek shows the head in narrow gaps on small screens.
        for (const peekHeight of [height, 88]) {
          for (const right of [false, true]) {
            const left = right ? frame.width - width : 0;
            for (let top = 90; top + peekHeight < frame.height - 48; top += 16) {
              if (isForestSpaceClear({ left, right: left + width, top, bottom: top + peekHeight }, frame.obstacles, 8)) candidates.push({ right, top, height: peekHeight });
            }
          }
          if (candidates.length) break;
        }
        const position = candidates[Math.floor(Math.random() * candidates.length)];
        if (position) {
          visit = { start: clock, duration: 5400 + Math.random() * 1600, ...position, width };
          root.dataset.side = position.right ? "right" : "left";
          root.dataset.visit = "peeking";
          root.style.top = `${position.top}px`; root.style.width = `${width}px`; root.style.height = `${position.height}px`;
        }
        nextAllowed = clock + 2500;
      }
      if (!visit) return;
      const left = visit.right ? frame.width - visit.width : 0;
      if (visit.top + visit.height > frame.height - 48 || !isForestSpaceClear({ left, right: left + visit.width, top: visit.top, bottom: visit.top + visit.height }, frame.obstacles, 6)) { hide(); return; }
      const age = clock - visit.start;
      if (age >= visit.duration) { jumpscare(); return; }
      // Lean out, hesitate behind the edge, then take a second, closer look.
      const enter = smoothStep(age / 1100);
      const retreat = smoothStep((age - 2400) / 500) * (1 - smoothStep((age - 3250) / 850));
      const reveal = enter * (1 - retreat * 0.7);
      root.style.opacity = (enter * 0.98).toFixed(3);
      figure.style.transform = `translate3d(${-82 + reveal * 48}%,${Math.sin(age / 750) * 2}px,0) rotate(${reveal * 13}deg)`;
    });
    const onVisibility = () => { if (document.hidden) finishScare(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      finishScare(); unsubscribe();
      figure.removeEventListener("click", jumpscare);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [cooldownRef]);

  return <div className="forest-residents" aria-hidden="true">
    <div ref={rootRef} className="watcher-peek" data-visit="resting" data-side="left">
      <button ref={figureRef} type="button" tabIndex={-1} className="watcher-silhouette"><Image src="/images/forest-residents/watcher-close.webp" alt="" width={1000} height={1000} sizes="(max-width: 767px) 126px, 182px" loading="eager" draggable={false} /></button>
    </div>
    <div ref={scareRef} className="watcher-jumpscare" data-active="false">
      <Image src="/images/forest-residents/watcher-close.webp" alt="" width={1000} height={1000} sizes="(max-width: 767px) 88vw, 560px" loading="eager" draggable={false} />
    </div>
  </div>;
}
