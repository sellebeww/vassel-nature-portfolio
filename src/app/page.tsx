import HomeHero from "@/components/home/HomeHero";
import { AboutSection, ContactSection } from "@/components/forest/PortfolioSections";
import ExperienceSection from "@/components/forest/ExperienceSection";
import ProjectsSection from "@/components/forest/ProjectsSection";
import AchievementsSection from "@/components/forest/AchievementsSection";
import JourneyMotion from "@/components/forest/JourneyMotion";

export default function Home() {
  return <div className="portfolio-world"><HomeHero /><JourneyMotion><AboutSection /><ExperienceSection /><ProjectsSection /><AchievementsSection /><ContactSection /></JourneyMotion></div>;
}
