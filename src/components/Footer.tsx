"use client";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { site } from "@/data/site";
export default function Footer() {
  return <footer className="forest-footer"><span>© {new Date().getFullYear()} Vassel Goleyu</span><span className="footer-note">{site.name} · Always growing.</span><Link href="/#home">Back to the clearing <ArrowUp size={13} /></Link></footer>;
}
