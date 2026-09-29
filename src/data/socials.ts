export interface SocialLink {
  id: "linkedin" | "github" | "instagram" | "email";
  label: string;
  /**
   * Leave empty until you have the real URL — the SocialLinks component
   * automatically shows an inactive placeholder state until this is filled in.
   * Email should be a "mailto:" link.
   */
  href: string;
}

export const socialLinks: SocialLink[] = [
  { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/vassel-goleyu" },
  { id: "github", label: "GitHub", href: "https://github.com/sellebeww" },
  { id: "instagram", label: "Instagram", href: "" },
  { id: "email", label: "Email", href: "mailto:vassel.jgo@gmail.com" },
];
