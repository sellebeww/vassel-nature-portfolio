import { achievements } from "@/data/achievements";
import { Chapter } from "@/components/forest/PortfolioSections";
import EditableGallery from "@/components/forest/EditableGallery";

export default function AchievementsSection() {
  const photos = achievements.map((award) => ({
    id: award.id,
    src: award.image,
    alt: `${award.placement} certificate — ${award.competition}`,
    caption: award.competition,
    affiliation: award.institution,
    detail: `${award.placement} · ${award.date}`,
    placeholder: "Original achievement certificate",
  }));
  return <section id="achievements" className="forest-section forest-achievements" aria-labelledby="achievements-title">
    <Chapter number="04">Achievements & recognition</Chapter>
    <div className="section-heading-row" data-reveal="text"><h2 id="achievements-title">Little reminders<br /><em>to keep growing.</em></h2><p>A moving collection of original certificates.<br />Open any one for a closer look.</p></div>
    <EditableGallery photos={photos} label="Achievement certificates" variant="certificates" />
    <p className="archive-footnote">{achievements.length} original certificates · Leadership, science & language</p>
  </section>;
}
