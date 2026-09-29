"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import FullScreenMenu from "@/components/FullScreenMenu";
import { portfolioNavigation } from "@/data/navigation";
import { site } from "@/data/site";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const current = [...portfolioNavigation].reverse().find(({ id }) => {
        const section = document.getElementById(id);
        return section && section.getBoundingClientRect().top < window.innerHeight * 0.4;
      });
      if (current) setActive(current.id);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);
  useEffect(() => {
    document.documentElement.dataset.forestMenu = String(open);
    window.dispatchEvent(new CustomEvent("forest-menu", { detail: open }));
    return () => { document.documentElement.dataset.forestMenu = "false"; };
  }, [open]);
  return <>
    <header className={`forest-header ${scrolled ? "is-scrolled" : ""}`}>
      <Link href="/#home" className="forest-wordmark" aria-label={`${site.name} — Home`}>{site.name.toUpperCase()}<span className="wordmark-dot" aria-hidden="true">.</span></Link>
      <nav className="forest-desktop-nav" aria-label="Main navigation">
        {portfolioNavigation.map(({ id, label, shortLabel }) => <Link key={id} href={`/#${id}`} aria-current={active === id ? "location" : undefined} className={active === id ? "is-active" : ""}>{shortLabel || label}</Link>)}
      </nav>
      <div className="forest-header-actions"><ThemeToggle /><span className="header-divider" /><button ref={triggerRef} type="button" className="forest-menu-trigger" aria-label="Open menu" aria-expanded={open} aria-controls="forest-menu" onClick={() => setOpen(true)}><span className="menu-trigger-label">Menu</span><span className="menu-lines" aria-hidden="true"><i /><i /></span></button></div>
    </header>
    <FullScreenMenu open={open} onClose={() => setOpen(false)} triggerRef={triggerRef} />
  </>;
}
