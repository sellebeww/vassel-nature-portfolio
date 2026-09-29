import { experience } from "@/data/experience";
import { experienceAlbums, type ExperienceAlbum } from "@/data/experiencePhotos";

export interface ExperienceStory extends ExperienceAlbum {
  period?: string;
  description?: string;
  summary: string;
  tags: string[];
  coverIndex: number;
}

const recordIds: Record<string, string> = {
  "duta-anti-narkoba": "duta-anti-narkoba-president", "bem-supervisor": "mister-miss-umn-supervisor",
  "unity-2025": "unity-2025-organizer-mc", byte: "byte-2025-organizer", "alive-11": "alive-11-organizer",
  "garuda-hacks": "garuda-hacks-lo", "medical-health-center": "medical-health-center-staff", "medical-developer": "umn-medical-center-developer",
  "medical-staff": "medical-staff", "omb-2025": "omb-medical-staff", "isfest-2025": "isfest-academic", infinite: "infinite-event-division",
};
// Concise introductions describe confirmed roles without inventing outcomes or dates.
const summaries: Record<string, string> = {
  "bem-supervisor": "Shaping the annual theme and guiding the committee from the Grand Design to each program.",
  "duta-anti-narkoba": "Leading anti-drug advocacy through school outreach, donation drives, and community programs.",
  "medical-developer": "Building responsive web applications with Laravel, API integrations, and secure user access.",
  "unity-2025": "Coordinating Scrabble, Speech, and Debate competitions, then taking the stage as an English-language MC.",
  byte: "Bringing a technology exhibition, sports competition, and grand finale together through event planning and logistics.",
  infinite: "Creating six interactive games and coordinating event timelines for around 500 students.",
  "alive-11": "Turning a mental health seminar concept into a coordinated program with speakers and a clear event flow.",
  "isfest-2025": "Supporting academic competitions through clear guidelines, competition rules, and judge coordination.",
  "garuda-hacks": "Guiding participants, explaining schedules and rules, and keeping people connected to the information they need.",
  "omb-2025": "Taking part in OMB UMN 2025 as a member of the medical staff team.",
  "medical-health-center": "Supporting daily patient care, keeping records organized, and promoting health education on campus.",
  "medical-staff": "Staying calm under pressure, reassuring patients, and coordinating with the medical team and other responders.",
  "student-emergency-response": "Participating in UMN Student Emergency Response and campus disaster-response simulation activities.",
};
// Landscape group photographs lead the cards; every original remains in the viewer.
const covers: Record<string, number> = { "bem-supervisor": 1, "omb-2025": 1, "alive-11": 1, "unity-2025": 2 };
const stories: ExperienceStory[] = experienceAlbums.map(album => {
  const record = experience.find(entry => entry.id === recordIds[album.id]);
  return { ...album, period: record?.verified ? record.period : undefined,
    summary: summaries[album.id], description: record?.description || summaries[album.id],
    tags: record?.tags || [], coverIndex: covers[album.id] || 0 };
});

export const featuredExperienceIds = ["bem-supervisor", "duta-anti-narkoba", "medical-developer", "unity-2025", "garuda-hacks", "omb-2025"];
export const experienceStories = [...stories].sort((a, b) => {
  const rank = (id: string) => { const index = featuredExperienceIds.indexOf(id); return index < 0 ? featuredExperienceIds.length : index; };
  return rank(a.id) - rank(b.id);
});
