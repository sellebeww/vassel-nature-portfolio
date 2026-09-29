import { socialLinks } from "@/data/socials";

export interface GalleryPhoto {
  id: string;
  /** Optional explicit image path; otherwise the prepared file is used when present. */
  src: string;
  /** Drop a real image at this public path, then refresh/rebuild the website. */
  expectedSrc?: string;
  alt: string;
  caption: string;
  affiliation: string;
  detail?: string;
  placeholder: string;
  href?: string;
}

export const githubUrl = socialLinks.find((link) => link.id === "github")!.href;

/** Add only real project names, screenshots and repository URLs here. */
export const projectGallery: GalleryPhoto[] = [1, 2, 3, 4].map((index) => ({
  id: `PROJECT_PLACEHOLDER_${index}`,
  src: "",
  expectedSrc: `/images/projects/project-${index}.jpg`,
  alt: "",
  affiliation: "Project preview",
  caption: "Project details coming soon",
  placeholder: "Your project screenshot here",
  href: githubUrl,
}));
