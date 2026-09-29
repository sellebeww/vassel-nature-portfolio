"use client";

import { useEffect, useRef } from "react";

/** Progressive enhancement: content stays visible without JavaScript or motion. */
export default function JourneyMotion({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) {
        (entry.target as HTMLElement).dataset.revealState = "visible";
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    const setup = () => {
      observer.disconnect();
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (media.matches || rect.top < window.innerHeight * 0.95) element.dataset.revealState = "visible";
        else { element.dataset.revealState = "waiting"; observer.observe(element); }
      });
    };
    setup(); media.addEventListener("change", setup);
    return () => { observer.disconnect(); media.removeEventListener("change", setup); };
  }, []);
  return <div ref={rootRef} className="forest-journey">{children}</div>;
}
