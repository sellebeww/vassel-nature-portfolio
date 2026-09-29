"use client";
import { ArrowDown, ArrowUpRight, MousePointer2 } from "lucide-react";

export default function HomeHero() {
  return <section id="home" className="forest-hero" aria-labelledby="hero-title">
    <div className="forest-hero-content">
      <h1 id="hero-title">Vassel<br /><em>Goleyu.</em></h1>
      <p className="hero-role">Universitas Multimedia Nusantara</p>
      <p className="hero-description">I build fullstack web and mobile apps, work with React.js, and explore AI/ML, deep learning, and game development with Unity.</p>
      <a className="forest-button" href="#projects">Explore my projects <ArrowUpRight size={16} /></a>
      <p className="hero-interaction-hint"><MousePointer2 size={11} /> Scroll into the forest. Let a little color find you.</p>
    </div>
    <div className="hero-bottomline">
      <a className="hero-scroll" href="#about"><span>Wander a little further</span><ArrowDown size={15} /></a>
    </div>
  </section>;
}
