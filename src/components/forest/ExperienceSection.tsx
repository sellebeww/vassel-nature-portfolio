import { Chapter } from "@/components/forest/PortfolioSections";
import ExperienceCollection from "@/components/forest/ExperienceCollection";
import { experienceStories, featuredExperienceIds } from "@/data/experienceCollection";

export default function ExperienceSection() {
  return <section id="experience" className="forest-section forest-experience" aria-labelledby="experience-title">
    <Chapter number="02">Experience & participation</Chapter>
    <div className="section-heading-row" data-reveal="text">
      <h2 id="experience-title">Learning by doing.<br /><em>Growing with people.</em></h2>
      <p>From building websites to bringing people together.<br />The experiences, and the moments behind them.</p>
    </div>
    <div id="organization"><ExperienceCollection stories={experienceStories} featuredIds={featuredExperienceIds} /></div>
  </section>;
}
