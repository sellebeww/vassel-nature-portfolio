import { ArrowUpRight } from "lucide-react";
import { Chapter } from "@/components/forest/PortfolioSections";
import EditableGallery from "@/components/forest/EditableGallery";
import { githubUrl, projectGallery } from "@/data/galleries";
import { projects } from "@/data/projects";
import { resolveGalleryPhotos } from "@/lib/galleryPhotos";

export default function ProjectsSection() {
  const photos = resolveGalleryPhotos(projectGallery).filter(photo => photo.src);
  return <section id="projects" className="forest-section forest-projects" aria-labelledby="projects-title">
    <Chapter number="03">Building with code</Chapter>
    <div className="section-heading-row" data-reveal="text"><h2 id="projects-title">Projects &<br /><em>experiments.</em></h2><p>Web, mobile and AI security work.<br />Explore the source code on GitHub.</p></div>
    <ul className="project-list" data-reveal="text">{projects.map(project => <li key={project.id}><span className="project-stack">{project.stack}</span><h3>{project.name}</h3><p>{project.description}</p></li>)}</ul>
    {photos.length > 0 && <EditableGallery photos={photos} label="Project previews" variant="projects" />}
    <div className="projects-github" data-reveal="text"><span className="eyebrow">The ideas continue here</span><a className="forest-text-link" href={githubUrl} target="_blank" rel="noopener noreferrer">github.com/sellebeww <ArrowUpRight size={18} /></a></div>
  </section>;
}
