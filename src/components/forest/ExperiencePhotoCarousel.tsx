"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { usePhotoSlides } from "@/lib/usePhotoSlides";
import { useForestMotion } from "@/components/forest/ForestEnvironment";
import type { ExperienceStory } from "@/data/experienceCollection";

export default function ExperiencePhotoCarousel({ story, paused, onOpen }: {
  story: ExperienceStory; paused: boolean; onOpen: (index: number) => void;
}) {
  const [stopped, setStopped] = useState(false);
  const [current, setCurrent] = useState(0);
  const { reduced } = useForestMotion();
  const id = useId();
  const { trackRef, select } = usePhotoSlides(paused || stopped, story.photos.length);
  const slides = story.photos.length > 1 ? [...story.photos, story.photos[0]] : story.photos;
  return <div className="experience-photo-carousel">
    <div ref={trackRef} id={id} className="experience-photo-track" data-horizontal-track="true" role="region" aria-roledescription="carousel" aria-label={`${story.title} photographs`} tabIndex={0}
      onScroll={event => {
        const track = event.currentTarget;
        if (track.clientWidth) setCurrent(Math.round(track.scrollLeft / track.clientWidth) % story.photos.length);
      }}>
      {slides.map((photo, index) => {
        const originalIndex = index % story.photos.length;
        const duplicate = index >= story.photos.length;
        const content = <>
          <Image src={photo.src} alt="" fill sizes="(max-width: 600px) 85vw, 400px" className="experience-cover-backdrop" aria-hidden="true" />
          <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 600px) 85vw, 400px" className="experience-cover-image" draggable={false} />
          <span className="experience-cover-open">{photo.href ? "Instagram" : "Enlarge"}<ArrowUpRight size={15} /></span>
        </>;
        return <div className="experience-photo-slide" key={`${photo.id}-${index}`} aria-hidden={duplicate || undefined}>
          {photo.href ? <a className="experience-cover" href={photo.href} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : 0} aria-label={`View ${story.title} photo ${originalIndex + 1} on Instagram (opens in a new tab)`}>{content}</a>
            : <button type="button" className="experience-cover" tabIndex={duplicate ? -1 : 0} aria-label={`Open ${story.title} photo ${originalIndex + 1}`} onClick={() => onOpen(originalIndex)}>{content}</button>}
        </div>;
      })}
    </div>
    <div className="experience-photo-controls">
      <span className="experience-photo-position">{current + 1} / {story.photos.length}</span>
      {story.photos.length > 1 && <>
        <div className="experience-photo-dots" role="group" aria-label={`Choose a ${story.title} photograph`}>
          {story.photos.map((photo, index) => <button key={photo.id} type="button" aria-label={`Show photo ${index + 1}`} aria-current={current === index ? "true" : undefined} aria-controls={id} onClick={() => select(index)}><span /></button>)}
        </div>
        {!reduced && <button type="button" className="experience-photo-pause" aria-label={`${stopped ? "Play" : "Pause"} ${story.title} photos`} aria-pressed={stopped} onClick={() => setStopped(!stopped)}>{stopped ? <Play size={12} /> : <Pause size={12} />}</button>}
      </>}
    </div>
  </div>;
}
