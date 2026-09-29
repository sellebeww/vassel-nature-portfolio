export interface EducationEntry {
  id: string;
  institution: string;
  program: string;
  period: string;
  description: string;
}

export const education: EducationEntry[] = [
  {
    id: "umn",
    institution: "Multimedia Nusantara University",
    program: "Bachelor of Informatics",
    period: "Aug 2024 — Aug 2028 (Expected)",
    description:
      "Studying software engineering, human-computer interaction, and product development.",
  },
  {
    id: "syafana",
    institution: "Syafana Islamic School",
    program: "Senior High School",
    period: "Through 2024",
    description:
      "Represented the school in national-level academic olympiads across Biology, Geography, Mathematics, and English.",
  },
];

export interface CertificationEntry {
  id: string;
  title: string;
  issuer?: string;
}

export const certifications: CertificationEntry[] = [
  { id: "csharp-dotnet", title: "Essential Programming Languages: C# and .NET Core" },
  { id: "leader-101", title: "Leader 101: Effectively Manage Your Team" },
  { id: "leadership-training", title: "Leadership Training" },
  { id: "emotional-intelligence", title: "Emotional Intelligence" },
];

export const languages: { name: string; level: string }[] = [
  { name: "Indonesian", level: "Native" },
  { name: "English", level: "Professional Working Proficiency" },
];

export const interests: string[] = [];
