"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import type { ExperienceStory } from "@/data/experienceCollection";

export default function ExperienceViewer({ story, initialPhoto, onClose }: { story: ExperienceStory; initialPhoto: number; onClose: () => void }) {
  const [selected, setSelected] = useState(initialPhoto);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const titleId = useId();
  const active = story.photos[selected];
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focus = document.activeElement as HTMLElement | null, overflow = document.body.style.overflow;
    dialog.showModal(); document.body.style.overflow = "hidden"; closeRef.current?.focus({ preventScroll: true });
    return () => { dialog.close(); document.body.style.overflow = overflow; focus?.focus({ preventScroll: true }); };
  }, []);
  function step(delta: number) { if (story.photos.length) setSelected(index => (index + delta + story.photos.length) % story.photos.length); }
  return <dialog ref={dialogRef} className={`experience-viewer ${active ? "has-photos" : ""}`} aria-labelledby={titleId}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); step(event.key === "ArrowRight" ? 1 : -1); } }}>
    <header className="archive-viewer-header"><div><span className="eyebrow">{story.category}{story.period && ` · ${story.period}`}</span><h3 id={titleId}>{story.title}</h3><p>{story.role}</p></div><button ref={closeRef} type="button" className="archive-viewer-close" aria-label="Close experience" onClick={onClose}><X size={22} /></button></header>
    <div className="experience-viewer-description"><h4>My contribution</h4><p>{story.description}</p>
      {story.tags.length > 0 && <div className="experience-skills">{story.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
    </div>
    {active && <>
      <div className="archive-viewer-image" onTouchStart={event => { const touch = event.touches[0]; touchRef.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null; }} onTouchCancel={() => { touchRef.current = null; }} onTouchEnd={event => {
        const start = touchRef.current; touchRef.current = null;
        if (!start) return;
        const touch = event.changedTouches[0], dx = touch.clientX - start.x, dy = touch.clientY - start.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) step(dx < 0 ? 1 : -1);
      }}>{active.href ? <a href={active.href} target="_blank" rel="noopener noreferrer" aria-label="View this photograph on Instagram (opens in a new tab)"><Image key={active.id} src={active.src} alt={active.alt} fill sizes="(max-width: 600px) 94vw, 1000px" className="archive-photo-image" /></a>
        : <Image key={active.id} src={active.src} alt={active.alt} fill sizes="(max-width: 600px) 94vw, 1000px" className="archive-photo-image" />}</div>
      <div className="archive-viewer-navigation"><button type="button" onClick={() => step(-1)} disabled={story.photos.length < 2} aria-label="Previous photograph"><ArrowLeft size={19} /><span>Previous</span></button><span aria-live="polite">{selected + 1} / {story.photos.length}</span><button type="button" onClick={() => step(1)} disabled={story.photos.length < 2} aria-label="Next photograph"><span>Next</span><ArrowRight size={19} /></button></div>
      <div className="archive-viewer-thumbnails" aria-label="Choose a photograph">{story.photos.map((photo, index) => <button key={photo.id} type="button" aria-label={`Photograph ${index + 1}`} aria-current={index === selected ? "true" : undefined} onClick={() => setSelected(index)}><Image src={photo.src} alt="" fill sizes="64px" className="archive-photo-image" /></button>)}</div>
      <footer className="archive-viewer-footer"><span>Swipe or use ← → to browse</span><a href={active.href || active.src} target="_blank" rel="noopener noreferrer">{active.href ? "View on Instagram" : "Open original"} <ArrowUpRight size={14} /></a></footer>
    </>}
  </dialog>;
}
