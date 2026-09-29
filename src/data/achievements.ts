export type AchievementLevel = "gold" | "silver" | "bronze" | "leadership";
export type AchievementCategory =
  | "Leadership"
  | "Geography"
  | "Biology"
  | "Mathematics"
  | "English";

export interface Achievement {
  id: string;
  title: string;
  competition: string;
  placement: string;
  date: string;
  year: 2022 | 2023 | 2024;
  category: AchievementCategory;
  institution: string;
  description: string;
  level: AchievementLevel;
  image: string;
  featured?: boolean;
}

export const achievements: Achievement[] = [
  {
    id: "duta-anti-narkoba-umn",
    title: "Second Place Winner",
    competition: "Duta Anti Narkoba UMN 2024 Awarding Night",
    placement: "2nd Place",
    date: "November 2024",
    year: 2024,
    category: "Leadership",
    institution: "Universitas Multimedia Nusantara",
    description:
      "Achieved second place in the 2024 Duta Anti Narkoba UMN selection. This milestone represents Vassel's commitment to leadership, public communication, positive advocacy, and promoting greater awareness within the university community.",
    level: "leadership",
    image: "/images/achievements/achievement-01-duta-anti-narkoba.jpg",
    featured: true,
  },
  {
    id: "geography-runner-up-2024",
    title: "First Runner-Up",
    competition: "Olimpiade Sains Siswa — National Geography Competition",
    placement: "1st Runner-Up",
    date: "March 2024",
    year: 2024,
    category: "Geography",
    institution: "Syafana Islamic School",
    description:
      "Achieved first runner-up in a national geography competition by demonstrating strong knowledge of geographical concepts, spatial understanding, and analytical problem-solving.",
    level: "silver",
    image: "/images/achievements/achievement-02-geography-runner-up.jpg",
    featured: true,
  },
  {
    id: "geography-gold-2024",
    title: "Gold Medalist",
    competition: "Olimpiade Soshum — National Geography Competition",
    placement: "Gold Medal",
    date: "March 2024",
    year: 2024,
    category: "Geography",
    institution: "Syafana Islamic School",
    description:
      "Earned a gold medal in the national geography category, reflecting strong academic preparation, accuracy, and the ability to analyze complex geographical and social-science topics.",
    level: "gold",
    image: "/images/achievements/achievement-03-geography-gold.jpg",
    featured: true,
  },
  {
    id: "biology-runner-up-2023",
    title: "Second Runner-Up",
    competition: "Science Generation Competition — National Biology Competition",
    placement: "2nd Runner-Up",
    date: "April 2023",
    year: 2023,
    category: "Biology",
    institution: "Syafana Islamic School",
    description:
      "Secured second runner-up in the national biology competition through a strong understanding of biological principles, scientific reasoning, and careful problem-solving.",
    level: "bronze",
    image: "/images/achievements/achievement-04-biology-runner-up.jpg",
  },
  {
    id: "biology-gold-2023",
    title: "Gold Medalist",
    competition: "Olimpiade Sains Siswa — National Biology Competition",
    placement: "Gold Medal",
    date: "April 2023",
    year: 2023,
    category: "Biology",
    institution: "Syafana Islamic School",
    description:
      "Received a national gold medal in biology, recognizing excellent performance, scientific curiosity, and a strong command of fundamental biological concepts.",
    level: "gold",
    image: "/images/achievements/achievement-05-biology-gold.jpg",
  },
  {
    id: "english-rank10-2023",
    title: "Ranked 10th",
    competition: "Science Generation Competition — National English Competition",
    placement: "Top 10 Nationally",
    date: "April 2023",
    year: 2023,
    category: "English",
    institution: "Syafana Islamic School",
    description:
      "Placed among the top ten participants in a national English competition, demonstrating strong language comprehension, vocabulary, grammar, and analytical reading skills.",
    level: "bronze",
    image: "/images/achievements/achievement-06-english-rank10.jpg",
  },
  {
    id: "mathematics-silver-2023",
    title: "Silver Medalist",
    competition: "Science Generation Competition — National Mathematics Competition",
    placement: "Silver Medal",
    date: "April 2023",
    year: 2023,
    category: "Mathematics",
    institution: "Syafana Islamic School",
    description:
      "Earned a silver medal in a national mathematics competition by applying logical reasoning, numerical accuracy, and structured problem-solving under competitive conditions.",
    level: "silver",
    image: "/images/achievements/achievement-07-mathematics-silver.jpg",
  },
  {
    id: "english-runner-up-2022",
    title: "Fourth Runner-Up",
    competition: "Sigma Science Olympiad — National English Competition",
    placement: "4th Runner-Up",
    date: "September 2022",
    year: 2022,
    category: "English",
    institution: "Syafana Islamic School",
    description:
      "Achieved fourth runner-up in the national English category, marking an early milestone in language proficiency, academic confidence, and competitive experience.",
    level: "bronze",
    image: "/images/achievements/achievement-08-english-runner-up.jpg",
  },
  {
    id: "biology-gold-2022",
    title: "Gold Medalist",
    competition: "Sigma Science Olympiad — National Biology Competition",
    placement: "Gold Medal",
    date: "September 2022",
    year: 2022,
    category: "Biology",
    institution: "Syafana Islamic School",
    description:
      "Won a gold medal in the national biology competition, demonstrating strong scientific knowledge, consistency, and dedication to academic development.",
    level: "gold",
    image: "/images/achievements/achievement-09-biology-gold-2022.jpg",
  },
];

export const achievementCategories: (AchievementCategory | "All")[] = [
  "All",
  "Leadership",
  "Geography",
  "Biology",
  "Mathematics",
  "English",
];

export const achievementYears = [2024, 2023, 2022] as const;
