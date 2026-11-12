export interface Project {
  id: string;
  name: string;
  stack: string;
  description: string;
}

/** From the Projects section of Vassel's CV. Add a repo URL per project once it is public. */
export const projects: Project[] = [
  { id: "falsify-guardrail", name: "falsify-guardrail", stack: "Python", description: "A guardrail that confirms exploits in LLM-generated smart contracts before they are trusted." },
  { id: "assay-evm", name: "assay-evm", stack: "Python", description: "Checks whether a Solidity patch really fixes an exploit or only passes the existing tests." },
  { id: "bunda-siaga", name: "BUNDA-SIAGA", stack: "Kotlin", description: "Offline Android app for pregnancy and postpartum danger signs, with SMS referrals." },
  { id: "capira", name: "CAPIRA", stack: "TypeScript", description: "Offline-first research prototype for camera-based capillary refill measurement." },
  { id: "smart-toko", name: "Smart-Toko", stack: "Flutter, Supabase", description: "Voice bookkeeping app for small shops, built in the Ignite Full program." },
  { id: "hakdata", name: "HakData", stack: "TypeScript, RabbitMQ", description: "Helps citizens claim their personal-data rights under Indonesia's PDP law." },
];
