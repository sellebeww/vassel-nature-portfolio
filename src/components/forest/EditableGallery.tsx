"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, ImageIcon, X } from "lucide-react";
import type { GalleryPhoto } from "@/data/galleries";
import { useForestMotion } from "@/components/forest/ForestEnvironment";

export default function EditableGallery({ photos, label, variant = "photos" }: { photos: GalleryPhoto[]; label: string; variant?: "photos" | "projects" | "certificates" }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const restUntil = useRef(0);
  const direction = useRef(1);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const dragged = useRef(false);
  const { paused: forestPaused } = useForestMotion();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const available = photos.filter((photo) => photo.src && !failed.includes(photo.id));
  const active = available[selected];
  const stopped = forestPaused || hovered || focused || isOpen;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || stopped || !visible || photos.length < 2) return;
    let frame = 0, previous = 0, lastPaint = 0;
    let position = track.scrollLeft;
    function tick(now: number) {
      frame = 0;
      if (document.hidden) return;
      if (now - lastPaint < 1000 / 30) { frame = requestAnimationFrame(tick); return; }
      const dt = previous ? Math.min(now - previous, 70) : 0;
      previous = now; lastPaint = now;
      if (now >= restUntil.current) {
        const max = track!.scrollWidth - track!.clientWidth;
        if (max > 2) {
          if (Math.abs(track!.scrollLeft - position) > 3) position = track!.scrollLeft;
          position += direction.current * dt * 0.023;
          if (position >= max && direction.current > 0) { position = max; direction.current = -1; restUntil.current = now + 1000; }
          if (position <= 0 && direction.current < 0) { position = 0; direction.current = 1; restUntil.current = now + 1000; }
          track!.scrollLeft = position;
        }
      } else position = track!.scrollLeft;
      frame = requestAnimationFrame(tick);
    }
    const visibility = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; if (!document.hidden) frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", visibility);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("visibilitychange", visibility); };
  }, [stopped, visible, photos.length]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const returnFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = "hidden";
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; returnFocus?.focus({ preventScroll: true }); };
  }, [isOpen]);

  function rest() { restUntil.current = performance.now() + 6500; }
  function scroll(delta: number) {
    const track = trackRef.current;
    if (!track) return;
    rest(); direction.current = delta;
    track.scrollBy({ left: delta * track.clientWidth * 0.72, behavior: forestPaused ? "instant" : "smooth" });
  }
  function open(photo: GalleryPhoto) { setSelected(available.findIndex((item) => item.id === photo.id)); setIsOpen(true); }
  function step(delta: number) { if (available.length) setSelected((index) => (index + delta + available.length) % available.length); }
  function tilt(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || forestPaused) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width, y = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty("--tilt-x", `${(0.5 - y) * 3}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${(x - 0.5) * 3}deg`);
    event.currentTarget.style.setProperty("--light-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--light-y", `${y * 100}%`);
  }

  return <div className={`editable-gallery gallery-drift gallery-${variant}`} data-autoplay={stopped ? "paused" : "playing"}>
    <div ref={trackRef} className="gallery-track" role="region" aria-roledescription="carousel" aria-label={label} tabIndex={0}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }} onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      onPointerDown={(event) => {
        rest(); dragged.current = false;
        if (event.pointerType === "mouse" && event.button === 0) drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft };
      }}
      onPointerMove={(event) => {
        if (!drag.current || event.buttons !== 1) return;
        const distance = event.clientX - drag.current.x;
        if (Math.abs(distance) < 5 && !dragged.current) return;
        dragged.current = true; event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.dataset.dragging = "true";
        event.currentTarget.scrollLeft = drag.current.left - distance;
        rest();
      }}
      onPointerUp={(event) => { drag.current = null; event.currentTarget.dataset.dragging = "false"; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
      onPointerCancel={(event) => { drag.current = null; event.currentTarget.dataset.dragging = "false"; }}
      onDragStart={(event) => event.preventDefault()}
      onClickCapture={(event) => { if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false; } }}
      onWheel={rest} onKeyDown={(event) => { if (event.target !== event.currentTarget) return; if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); scroll(event.key === "ArrowRight" ? 1 : -1); } }}>
      {photos.map((photo, index) => {
        const hasPhoto = Boolean(photo.src && !failed.includes(photo.id));
        return <figure key={photo.id} className="gallery-photo" data-media-slot={photo.id}>
          <div className="gallery-media" data-reveal="media" onPointerMove={tilt}>
            {hasPhoto ? <button type="button" className="gallery-photo-button" onClick={() => open(photo)} aria-label={`Open ${photo.alt || photo.caption || photo.affiliation}`}><Image src={photo.src} alt={photo.alt || `${photo.affiliation} — ${photo.caption}`} fill sizes="(max-width: 600px) 80vw, 460px" className="gallery-image" onError={() => setFailed((current) => current.includes(photo.id) ? current : [...current, photo.id])} /><span className="gallery-open"><ArrowUpRight size={19} /></span></button> : <div className="gallery-placeholder" role="img" aria-label={`${photo.affiliation}: ${photo.placeholder}. Photo to be added.`}><span className="placeholder-cross cross-one" /><span className="placeholder-cross cross-two" /><span className="placeholder-index">{String(index + 1).padStart(2, "0")}</span><div className="placeholder-center"><ImageIcon size={24} strokeWidth={1} /><span>{variant === "projects" ? "Project preview coming soon" : "Photograph coming soon"}</span><small>{photo.src ? "Image unavailable" : variant === "projects" ? "Explore my repositories on GitHub" : "Original documentation will be added here"}</small></div><span className="placeholder-bottom">{variant === "projects" ? "PROJECT ARCHIVE" : "PERSONAL ARCHIVE"}<span>↗</span></span></div>}
          </div>
          <figcaption><span className="gallery-affiliation">{photo.affiliation}</span><strong>{photo.caption}</strong>{photo.detail && <span className="gallery-detail">{photo.detail}</span>}<div className="gallery-caption-bottom"><span>{hasPhoto ? variant === "certificates" ? "View original certificate" : "View photograph" : "Photo coming soon"}</span>{photo.href ? <a href={photo.href} target="_blank" rel="noopener noreferrer">Explore on GitHub <ArrowUpRight size={13} /></a> : <span className="gallery-photo-number">{String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>}</div></figcaption>
        </figure>;
      })}
    </div>
    <dialog ref={dialogRef} className="certificate-dialog gallery-dialog" aria-label={`${label} viewer`} onCancel={(event) => { event.preventDefault(); setIsOpen(false); }} onClose={() => setIsOpen(false)} onClick={(event) => { if (event.currentTarget === event.target) setIsOpen(false); }} onKeyDown={(event) => {
      if (event.key === "ArrowRight" && available.length > 1) { event.preventDefault(); step(1); }
      if (event.key === "ArrowLeft" && available.length > 1) { event.preventDefault(); step(-1); }
      if (event.key === "Tab") {
        const items = event.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]");
        if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1]?.focus(); }
        else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0]?.focus(); }
      }
    }}>
      <div className="certificate-header"><div><span className="eyebrow">{active?.affiliation}</span><h3>{active?.caption || "Photograph"}</h3>{active?.detail && <p className="gallery-viewer-detail">{active.detail}</p>}</div><button type="button" className="forest-close" aria-label="Close photograph" onClick={() => setIsOpen(false)}><X size={21} /></button></div>
      {active && <div className="certificate-image"><Image key={active.src} src={active.src} alt={active.alt || `${active.affiliation} — ${active.caption}`} fill sizes="90vw" className="object-contain" /></div>}
      <div className="gallery-viewer-footer">{active?.href && <a className="forest-text-link" href={active.href} target="_blank" rel="noopener noreferrer">Explore on GitHub <ArrowUpRight size={15} /></a>}{available.length > 1 && <div className="certificate-controls"><button type="button" onClick={() => step(-1)} aria-label={`Previous ${label.toLowerCase()} image`}><ArrowLeft size={16} /> Previous</button><span aria-live="polite">{selected + 1} / {available.length}</span><button type="button" onClick={() => step(1)} aria-label={`Next ${label.toLowerCase()} image`}>Next <ArrowRight size={16} /></button></div>}</div>
    </dialog>
  </div>;
}
