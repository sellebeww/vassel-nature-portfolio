import Image from "next/image";
import { ArrowDownToLine, ArrowUpRight, Code2, Sprout, Compass } from "lucide-react";
import { socialLinks } from "@/data/socials";
import { education } from "@/data/education";
import { profileSummary } from "@/data/profile";

export function Chapter({ number, children }: { number: string; children: React.ReactNode }) {
  return <div className="forest-chapter"><span>{number}</span><span className="chapter-line" /><span>{children}</span></div>;
}

export function AboutSection() {
  return <section id="about" className="forest-section forest-about" aria-labelledby="about-title">
    <Chapter number="01">The person behind the work</Chapter>
    <div className="about-layout" data-reveal="media">
      <div className="about-portrait"><div className="portrait-frame"><Image src="/images/profile/vassel-goleyu.jpg" alt="Vassel Goleyu" fill sizes="(max-width: 700px) 80vw, 360px" className="portrait-image" /><span className="portrait-corner top-left" /><span className="portrait-corner bottom-right" /></div><div className="portrait-caption"><span>VASSEL GOLEYU</span><span>Always a work in progress ↗</span></div></div>
      <div className="about-copy"><span className="eyebrow">A little about me</span><h2 id="about-title">Rooted in technology.<br /><em>Driven by curiosity.</em></h2>{profileSummary.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<div className="about-values"><span><Code2 size={15} /> Attentive to detail</span><span><Compass size={15} /> Curious & creative</span><span><Sprout size={15} /> People-minded</span></div><a className="forest-text-link" href="/files/vassel-goleyu-cv.pdf" download>Take a look at my CV <ArrowDownToLine size={15} /></a></div>
    </div>
    <div className="about-education"><span className="eyebrow">Currently growing at</span><div><strong>{education[0].institution}</strong><span>{education[0].program}</span></div><span>{education[0].period}</span></div>
  </section>;
}

export function ContactSection() {
  const email = socialLinks.find((link) => link.id === "email");
  return <section id="contact" className="forest-section forest-contact" aria-labelledby="contact-title">
    <Chapter number="05">A new beginning</Chapter>
    <div className="contact-clearing"><span className="contact-star" aria-hidden="true">✳</span><span className="eyebrow">Every good thing starts with a conversation</span><h2 id="contact-title">Let’s make<br /><em>something matter.</em></h2><p>An idea, a collaboration, or just a hello.<br />There’s always room for a new connection.</p>{email?.href && <a className="forest-button" href={email.href}>Say hello <ArrowUpRight size={16} /></a>}<div className="contact-socials">{socialLinks.filter((link) => link.id !== "instagram").map((link) => link.href ? <a key={link.id} href={link.href} target={link.id === "email" ? undefined : "_blank"} rel="noopener noreferrer">{link.label}<ArrowUpRight size={13} /></a> : <span key={link.id} className="social-coming-soon">{link.label}<small>Coming soon</small></span>)}</div></div>
    <div className="contact-signoff"><span>Tangerang, Indonesia</span><span>See you on the next path.</span></div>
  </section>;
}
