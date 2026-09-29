export type PhotoCategory = "Leadership" | "Events" | "Campus care" | "Development";

export interface ExperiencePhoto {
  id: string;
  src: string;
  alt: string;
  href?: string;
}

export interface ExperienceAlbum {
  id: string;
  title: string;
  role: string;
  category: PhotoCategory;
  photos: ExperiencePhoto[];
}

const photoLinks: Record<string, string> = {
  "bem-supervisor-1": "https://www.instagram.com/bemumn/p/DVae05Pk5-3/",
  "garuda-hacks-1": "https://www.instagram.com/garudahacks/reel/DMeype1SbE4/",
  "garuda-hacks-2": "https://www.instagram.com/garudahacks/reel/DMmiLEAywtR/",
};

function album(id: string, title: string, role: string, category: PhotoCategory, descriptions: string[]): ExperienceAlbum {
  return {
    id, title, role, category,
    photos: descriptions.map((alt, index) => ({
      id: `${id}-${index + 1}`,
      src: `/images/experience/${id}/${String(index + 1).padStart(2, "0")}.jpg`,
      alt,
      href: photoLinks[`${id}-${index + 1}`],
    })),
  };
}

/** Every supplied photograph is retained in its original order within its album. */
export const experienceAlbums: ExperienceAlbum[] = [
  album("duta-anti-narkoba", "Duta Anti Narkoba UMN", "President", "Leadership", [
    "Duta Anti Narkoba UMN members together in a campus auditorium",
    "Duta Anti Narkoba UMN gathering in front of a congratulatory presentation",
    "Vassel holding an award alongside a fellow Duta Anti Narkoba representative",
    "Vassel speaking into a microphone beside an outreach presentation",
    "Vassel and a participant holding certificates during a school visit",
    "Duta Anti Narkoba UMN and school participants posing together in a classroom",
  ]),
  album("bem-supervisor", "Mister & Miss UMN", "Supervisor · BEM UMN", "Leadership", [
    "Mister and Miss UMN 2026 promotional portrait of Vassel",
    "BEM UMN team and participants gathered in a campus auditorium",
  ]),
  album("unity-2025", "UNITY 2025", "Event Organizer · UMN English Student Council", "Events", [
    "UNITY committee members in green jackets posing together in the auditorium",
    "Vassel speaking on stage at UNITY with a microphone",
    "The UNITY 2025 team gathered in the auditorium",
  ]),
  album("byte", "Byte", "Event Organizer · HMIF UMN", "Events", [
    "Byte team posing outside a building at night",
    "A vertical collage of Byte committee group photographs",
    "Byte 2025 Infinite performers and hosts on stage",
  ]),
  album("infinite", "Infinite", "Member of Event Division · HMIF UMN", "Events", [
    "A collage of Infinite event committee group photographs",
    "Infinite event memories arranged in a vertical collage",
  ]),
  album("alive-11", "Alive 11.0", "Event Organizer", "Events", [
    "Alive 11.0 team posing in front of the talk show presentation",
    "A speaker presenting to the audience at an Alive 11.0 plenary session",
  ]),
  album("isfest-2025", "ISFEST UMN 2025", "Member of Academic Division · HIMSI UMN", "Events", [
    "ISFEST participants and committee members seated in the auditorium",
    "ISFEST UMN 2025 group photograph in the auditorium",
  ]),
  album("garuda-hacks", "Garuda Hacks", "Liaison Officer", "Events", [
    "Garuda Hacks event moment with a mascot and participants in the venue lobby",
    "Garuda Hacks group gathering in the event venue",
  ]),
  album("omb-2025", "OMB UMN 2025", "Medical Staff", "Campus care", [
    "An overhead group photograph of OMB UMN participants arranged in a circle",
    "OMB medical staff posing together outdoors among trees",
    "OMB UMN team group photographs arranged in a vertical collage",
  ]),
  album("medical-health-center", "UMN Medical Center", "Health Center Staff", "Campus care", [
    "UMN Medical Center staff posing together indoors",
    "UMN Medical Center team portrait collage",
    "Vassel at the UMN Medical Center",
  ]),
  album("medical-staff", "UMN Medical Center", "Medical Staff", "Campus care", [
    "UMN Medical Center team group photograph in a campus room",
    "Medical staff posing outdoors beside a tree",
    "UMN Medical Center team gathered in the auditorium",
  ]),
  album("student-emergency-response", "UMN Student Emergency Response", "Member", "Campus care", [
    "UMN Student Emergency Response members and participants gathered after a disaster-response simulation",
  ]),
  album("medical-developer", "UMN Medical Center", "Full Stack Web Developer", "Development", [
    "Vassel and colleagues in formal attire at UMN",
  ]),
];
