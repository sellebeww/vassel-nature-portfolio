export interface ExperienceItem {
  id: string;
  period: string;
  title: string;
  org: string;
  location?: string;
  type: "education" | "leadership" | "competition" | "development" | "event" | "medical";
  description: string;
  tags: string[];
  /** false = role/org confirmed, but dates/description/skills still need to be supplied. */
  verified: boolean;
  /** Optional: id(s) of media items elsewhere (e.g. achievement certificates) to surface here too. */
  relatedMediaId?: string | string[];
  /** Show Vassel's avatar as the timeline marker instead of the type icon. */
  showAvatar?: boolean;
}

/**
 * Editable timeline. Add new entries here as Vassel's experience grows —
 * each one renders automatically on /experience and the About page preview.
 * Verified entries are sourced from Vassel's CV and supplied LinkedIn Profile.pdf.
 *
 * Entries with verified: false only have a confirmed role + organization —
 * add the real dates, work arrangement, description, and related skills as
 * they become available.
 */
export const experience: ExperienceItem[] = [
  {
    id: "umn-informatics",
    period: "Aug 2024 — Aug 2028 (Expected)",
    title: "Bachelor of Informatics",
    org: "Universitas Multimedia Nusantara",
    type: "education",
    description:
      "Studying software engineering, human-computer interaction, and product development — building a foundation across full-stack development and design thinking.",
    tags: ["Software Engineering", "HCI", "Product Thinking"],
    verified: true,
  },
  {
    id: "national-olympiads",
    period: "2022 — 2024",
    title: "National Science Olympiad Competitor",
    org: "Syafana Islamic School",
    type: "competition",
    description:
      "Represented school at national-level olympiads across Biology, Geography, Mathematics, and English — earning nine placements including multiple gold medals.",
    tags: ["Biology", "Geography", "Mathematics", "English"],
    verified: true,
    relatedMediaId: [
      "geography-runner-up-2024",
      "geography-gold-2024",
      "biology-runner-up-2023",
      "biology-gold-2023",
      "english-rank10-2023",
      "mathematics-silver-2023",
      "english-runner-up-2022",
      "biology-gold-2022",
    ],
  },
  {
    id: "duta-anti-narkoba-award",
    period: "November 2024",
    title: "2nd Place — Duta Anti Narkoba UMN 2024",
    org: "Universitas Multimedia Nusantara",
    type: "leadership",
    description:
      "Finalist and 2nd place awardee in UMN's anti-drug ambassador selection, developing public communication, advocacy, and community leadership skills.",
    tags: ["Public Speaking", "Advocacy", "Leadership"],
    verified: true,
    relatedMediaId: "duta-anti-narkoba-umn",
    showAvatar: true,
  },
  {
    id: "mister-miss-umn-supervisor",
    period: "Jan 2026 — Present",
    title: "Supervisor, Mister & Miss UMN",
    org: "BEM UMN",
    type: "event",
    description:
      "Designed the entire theme concept of Mister & Miss UMN for the year and supervised the progress of the Executive Committees to ensure every program stayed aligned with the Grand Design. Upheld the Mister & Miss values of 3M, 3B, and 5S and ensured all activities complied with UMN administrative regulations.",
    tags: ["Program Direction", "Team Supervision", "Event Concept"],
    verified: true,
  },
  {
    id: "duta-anti-narkoba-president",
    period: "Jan 2025 — Dec 2025",
    title: "President",
    org: "Duta Anti Narkoba UMN",
    type: "leadership",
    description:
      "Led a student organization promoting an anti-drug lifestyle, running Anti-Narkoba Week (orphanage visits, donation drives, blood donations), school outreach, and Awarding Night. Coordinated with health sectors, campus leaders, and the local community to build awareness about health and drug-free living.",
    tags: ["Leadership", "Community Outreach", "Advocacy"],
    verified: true,
  },
  {
    id: "umn-medical-center-developer",
    period: "Feb 2025 — Dec 2025",
    title: "Full Stack Web Developer",
    org: "UMN Medical Center",
    type: "development",
    description:
      "Developed and maintained web applications using Laravel (PHP), HTML, CSS, JavaScript, and MySQL for digital platforms. Integrated REST APIs and JSON, built responsive interfaces, and implemented authentication and authorization with secure, scalable, and optimized performance.",
    tags: ["Laravel", "PHP", "MySQL", "REST APIs", "JSON"],
    verified: true,
  },
  {
    id: "medical-health-center-staff",
    period: "Feb 2025 — Dec 2025",
    title: "Health Center Staff",
    org: "UMN Medical Center",
    type: "medical",
    description:
      "Provided direct medical care to 10-40 patients daily, maintained accurate patient records, and collaborated with healthcare providers on treatment plans. Ran health education initiatives and shared preventive strategies to promote a healthier campus community.",
    tags: ["Patient Care", "Health Education", "Records Management"],
    verified: true,
  },
  {
    id: "alive-11-organizer",
    period: "May 2025 — Nov 2025",
    title: "Event Organizer",
    org: "Alive 11.0",
    type: "event",
    description:
      "Helped design a mental health seminar for Alive 11.0, supported speaker selection and coordination, and organized the event flow to create a thoughtful experience for participants.",
    tags: ["Event Design", "Speaker Coordination", "Mental Health Awareness"],
    verified: true,
  },
  {
    id: "unity-2025-organizer-mc",
    period: "Mar 2025 — Jul 2025",
    title: "Event Organizer",
    org: "UMN English Student Council",
    type: "event",
    description:
      "Designed and coordinated three UNITY 2025 competitions (Scrabble, Speech, Debate) and also served as English-language Semi-Formal MC alongside a co-host.",
    tags: ["Event Coordination", "Public Speaking", "MC"],
    verified: true,
  },
  {
    id: "byte-2025-organizer",
    period: "May 2025 — Nov 2025",
    title: "Event Organizer",
    org: "HMIF UMN",
    type: "event",
    description:
      "Planned and managed Byte 2025's three flagship programs: Horizon, an exhibition of Informatics students' final projects; Fuse, a student sports competition; and Infinite, the interactive grand finale. Oversaw event flow and logistics across the programs to support an organized participant experience.",
    tags: ["Event Logistics", "Program Management", "Byte 2025", "Infinite"],
    verified: true,
  },
  {
    id: "garuda-hacks-lo",
    period: "Jul 2025 — Aug 2025",
    title: "Liaison Officer",
    org: "Garuda Hacks",
    type: "event",
    description: "Guided Garuda Hacks participants to the main venue at UMN and helped them stay oriented throughout the event. Explained the schedule, event flow, and rules, answered questions, and served as a point of contact for information and directions.",
    tags: ["Participant Support", "Event Communication", "Venue Coordination"],
    verified: true,
  },
  {
    id: "medical-staff", period: "Feb 2025 — Dec 2025", title: "Medical Staff", org: "UMN Medical Center", type: "medical",
    description: "Worked with the medical team in situations requiring calm, focus, and timely decisions. Communicated with patients to help reassure them and coordinated with other responders to support effective teamwork under pressure.",
    tags: ["Team Coordination", "Patient Communication", "Composure Under Pressure"], verified: true,
  },
  {
    id: "omb-medical-staff", period: "Mar 2025 — Sep 2025", title: "Medical Staff", org: "OMB UMN 2025", type: "medical",
    description: "Served as a member of the medical staff team for OMB UMN 2025, contributing to the campus orientation program through a student care role.",
    tags: ["Campus Care", "Teamwork"], verified: true,
  },
  {
    id: "isfest-academic", period: "Feb 2025 — Oct 2025", title: "Member of Academic Division", org: "ISFEST UMN 2025 · HIMSI UMN", type: "event",
    description: "Helped organize academic competitions, draft rules and guidelines, and coordinate with judges. Contributed to learning materials and supported the delivery of educational programs at ISFEST UMN 2025.",
    tags: ["Academic Competitions", "Learning Materials", "Judge Coordination"], verified: true,
  },
  {
    id: "infinite-event-division", period: "Sep 2024 — Nov 2024", title: "Member of Event Division", org: "Infinite · HMIF UMN", type: "event",
    description: "Facilitated Infinite activities for around 500 students, managed timelines, and helped turn event concepts into activities. Designed and developed six interactive games to encourage student participation and engagement.",
    tags: ["Event Planning", "Interactive Activities", "Timeline Management"], verified: true,
  },
];
