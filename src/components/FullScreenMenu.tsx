"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { portfolioNavigation } from "@/data/navigation";
import { socialLinks } from "@/data/socials";
import { site } from "@/data/site";

export default function FullScreenMenu({ open, onClose, triggerRef }: { open: boolean; onClose: () => void; triggerRef: React.RefObject<HTMLButtonElement | null> }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      const overflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = overflow; dialog.close(); trigger?.focus({ preventScroll: true }); };
    }
  }, [open, triggerRef]);
  return <dialog ref={dialogRef} id="forest-menu" className="forest-menu" aria-label="Explore the portfolio" onCancel={(event) => { event.preventDefault(); closeRef.current(); }} onKeyDown={(event) => {
    if (event.key !== "Tab") return;
    const focusable = event.currentTarget.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]");
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }}>
    <div className="forest-menu-top"><span className="eyebrow">A different path. The same curiosity.</span><button type="button" onClick={onClose} className="forest-close" aria-label="Close menu">Close <X size={20} /></button></div>
    <div className="forest-menu-body">
      <div className="forest-menu-aside"><span className="eyebrow">{site.name}</span><p>A little curiosity<br />goes a <em>long way.</em></p><span className="menu-location">Vassel Goleyu<br />Tangerang, Indonesia</span></div>
      <nav aria-label="Expanded navigation">{portfolioNavigation.map(({ id, label }, index) => <Link style={{ "--menu-index": index } as React.CSSProperties} key={id} href={`/#${id}`} onClick={onClose} onMouseEnter={() => window.dispatchEvent(new CustomEvent("forest-focus", { detail: index }))} onFocus={() => window.dispatchEvent(new CustomEvent("forest-focus", { detail: index }))}><span className="menu-index">0{index + 1}</span><span>{label}</span><ArrowUpRight className="menu-arrow" size={30} /></Link>)}</nav>
    </div>
    <div className="forest-menu-bottom"><span className="eyebrow">Technology. Creativity. A sense of wonder.</span><div>{socialLinks.filter((link) => link.href && link.id !== "instagram").map((link) => <a key={link.id} href={link.href} target={link.id === "email" ? undefined : "_blank"} rel="noopener noreferrer">{link.label} <ArrowUpRight size={12} /></a>)}</div></div>
  </dialog>;
}
