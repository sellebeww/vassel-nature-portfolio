"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronUp, Pause, Play } from "lucide-react";
import { useHorizontalDrift } from "@/lib/useHorizontalDrift";
import { useForestMotion } from "@/components/forest/ForestEnvironment";
import ExperienceViewer from "@/components/forest/ExperienceViewer";
import ExperiencePhotoCarousel from "@/components/forest/ExperiencePhotoCarousel";
import type { ExperienceStory } from "@/data/experienceCollection";

export default function ExperienceCollection({ stories, featuredIds }: { stories: ExperienceStory[]; featuredIds: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selection, setSelection] = useState<{ story: ExperienceStory; photo: number } | null>(null);
  const [category, setCategory] = useState("All experiences");
  const rootRef = useRef<HTMLDivElement>(null);
  const { reduced } = useForestMotion();
  const visible = expanded ? stories.filter(story => category === "All experiences" || story.category === category) : stories.filter(story => featuredIds.includes(story.id));
  const { trackRef, rest } = useHorizontalDrift(expanded || paused || !!selection, visible.length);

  function toggleExpanded() {
    setExpanded(!expanded); setCategory("All experiences");
    trackRef.current?.scrollTo({ left: 0, behavior: "instant" });
    if (expanded) rootRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }

  return <div ref={rootRef} className="experience-collection" id="organization-media">
    <div className="experience-collection-top"><span className="eyebrow">{expanded ? "The full collection" : "Selected experiences"}</span><span>{expanded ? stories.length : featuredIds.length} experiences{!expanded && " · a few highlights"}</span></div>
    <div className="experience-filters" role="group" aria-label="Filter experiences">
      {["All experiences", "Leadership", "Events", "Campus care", "Development"].map(item => <button key={item} type="button" aria-pressed={expanded && category === item} onClick={() => { setCategory(item); setExpanded(true); }}>
        {item}<span>{item === "All experiences" ? stories.length : stories.filter(story => story.category === item).length}</span>
      </button>)}
    </div>
    <div ref={trackRef} id="experience-cards" className={`experience-cards ${expanded ? "is-expanded" : "is-drifting"}`} role="region" aria-label={expanded ? "All experiences" : "Selected experiences"} tabIndex={0}
      onDragStart={event => event.preventDefault()}>
      {visible.map(story => {
        return <article key={story.id} className={`experience-card ${story.photos.length ? "" : "experience-card-text"}`} data-experience={story.id}>
          {story.photos.length > 0 && <ExperiencePhotoCarousel story={story} paused={!!selection} onOpen={photo => setSelection({ story, photo })} />}
          <div className="experience-card-copy">
            <div className="experience-card-meta"><span>{story.category}</span>{story.period && <span>{story.period}</span>}</div>
            <h3>{story.title}</h3><p className="experience-card-role">{story.role}</p>
            <p className="experience-card-description">{story.summary}</p>
            <div className="experience-card-bottom">
              {story.photos.length > 1 && <div className="experience-card-thumbnails" aria-label={`${story.title} photo previews`}>
                {story.photos.slice(0, 3).map((photo, index) => photo.href ? <a key={photo.id} href={photo.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${story.title} photo ${index + 1} on Instagram (opens in a new tab)`}><Image src={photo.src} alt="" fill sizes="48px" className="archive-photo-image" draggable={false} /><ArrowUpRight size={12} /></a>
                  : <button key={photo.id} type="button" aria-label={`Open ${story.title} photo ${index + 1}`} onClick={() => setSelection({ story, photo: index })}><Image src={photo.src} alt="" fill sizes="48px" className="archive-photo-image" draggable={false} /></button>)}
              </div>}
              <button type="button" className="experience-detail-link" aria-label={`More about ${story.role} at ${story.title}`} onClick={() => setSelection({ story, photo: story.coverIndex })}>More <ArrowUpRight size={16} /></button>
            </div>
          </div>
        </article>;
      })}
    </div>
    <div className="experience-collection-bottom">
      <span className="experience-collection-hint">{expanded ? `${visible.length} experiences` : "Drag or scroll to explore"}</span>
      {!expanded && <div className="experience-rail-controls">
        <button type="button" aria-label="Previous experiences" onClick={() => { rest(); trackRef.current?.scrollBy({ left: -400, behavior: reduced ? "instant" : "smooth" }); }}><ArrowLeft size={17} /></button>
        {!reduced && <button type="button" aria-label={paused ? "Resume experience motion" : "Pause experience motion"} aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={14} /> : <Pause size={14} />}</button>}
        <button type="button" aria-label="Next experiences" onClick={() => { rest(); trackRef.current?.scrollBy({ left: 400, behavior: reduced ? "instant" : "smooth" }); }}><ArrowRight size={17} /></button>
      </div>}
      <button type="button" className="experience-more" aria-expanded={expanded} aria-controls="experience-cards" onClick={toggleExpanded}>{expanded ? "Show less" : "More experiences"}{expanded ? <ChevronUp size={17} /> : <ArrowUpRight size={17} />}</button>
    </div>
    {selection && <ExperienceViewer story={selection.story} initialPhoto={selection.photo} onClose={() => setSelection(null)} />}
  </div>;
}
