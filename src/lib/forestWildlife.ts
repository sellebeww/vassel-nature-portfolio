export type ForestObstacle = { left: number; top: number; right: number; bottom: number };

const contentSelectors = [
  ".forest-header", ".forest-footer", ".hero-topline", ".hero-bottomline", ".forest-hero-content",
  ".forest-chapter", ".about-layout", ".about-education", ".section-heading-row",
  ".gallery-track", ".projects-github", ".archive-footnote", ".contact-clearing",
  ".contact-signoff", ".experience-collection",
].join(",");

/** Measure content groups, not individual moving gallery frames. Cache between scrolls. */
export function measureForestContent(): ForestObstacle[] {
  return Array.from(document.querySelectorAll(contentSelectors), element => {
    const { left, top, right, bottom } = element.getBoundingClientRect();
    return { left, top, right, bottom };
  }).filter(box => box.bottom > -60 && box.top < innerHeight + 60 && box.right > box.left && box.bottom > box.top);
}

export function smoothStep(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

/** A soft invisible boundary fades wings out before they touch any content. */
export function butterflyClearance(x: number, y: number, radius: number, obstacles: ForestObstacle[]) {
  let clearance = 1;
  for (const box of obstacles) {
    const dx = Math.max(box.left - x, 0, x - box.right);
    const dy = Math.max(box.top - y, 0, y - box.bottom);
    clearance = Math.min(clearance, smoothStep((Math.hypot(dx, dy) - radius - 12) / 30));
  }
  return clearance;
}

export function isForestSpaceClear(box: ForestObstacle, obstacles: ForestObstacle[], padding = 12) {
  return obstacles.every(other => box.right + padding < other.left || box.left - padding > other.right
    || box.bottom + padding < other.top || box.top - padding > other.bottom);
}

export type ButterflyFlight = {
  start: number; duration: number; side: number; fromY: number; toY: number;
  phase: number; reach: number; crossing: boolean; size: number; wingPeriod: number;
  kind: "butterfly-pearl" | "butterfly-blue";
};

export function createButterflyFlight(now: number, mobile: boolean, reading: boolean, width: number, height: number, obstacles: ForestObstacle[]): ButterflyFlight {
  const flight: ButterflyFlight = {
    start: now, duration: 12000 + Math.random() * 7000, side: Math.random() < 0.5 ? -1 : 1,
    fromY: 0.2 + Math.random() * 0.5, toY: 0.2 + Math.random() * 0.55,
    phase: Math.random() * Math.PI * 2, reach: 0.1 + Math.random() * 0.13,
    crossing: !reading && Math.random() < 0.22,
    size: (mobile ? 22 : 28) + Math.random() * (mobile ? 8 : 14),
    wingPeriod: 175 + Math.random() * 100,
    kind: Math.random() < 0.65 ? "butterfly-pearl" : "butterfly-blue",
  };
  // Narrow screens have little usable margin. Prefer a real gap between content
  // groups so small visits can still be seen without crossing the reading area.
  if (mobile) {
    const x = flight.side < 0 ? 44 : width - 44;
    const lanes = Array.from({ length: Math.max(0, Math.floor((height - 132) / 18)) }, (_, index) => 96 + index * 18)
      .filter(y => butterflyClearance(x, y, flight.size * 0.72, obstacles) > 0.25);
    if (lanes.length) {
      flight.fromY = flight.toY = lanes[Math.floor(Math.random() * lanes.length)] / height;
      flight.crossing = false;
    }
  }
  return flight;
}

export function sampleButterflyFlight(flight: ButterflyFlight, now: number, width: number, height: number) {
  const t = Math.max(0, Math.min(1, (now - flight.start) / flight.duration));
  const curve = Math.sin(t * Math.PI);
  const approach = flight.crossing ? t * (width + flight.size * 2)
    : curve * Math.min(width * flight.reach, 220) + Math.sin(t * Math.PI * 2 + flight.phase) * curve * 14;
  const x = flight.side < 0 ? -flight.size + approach : width + flight.size - approach;
  const y = height * (flight.fromY + (flight.toY - flight.fromY) * smoothStep(t))
    + Math.sin(t * Math.PI * 2 + flight.phase) * 22 + Math.sin(now / 1300 + flight.phase) * 4;
  return { x, y, alpha: smoothStep(t / 0.18) * smoothStep((1 - t) / 0.22) * 0.82,
    angle: Math.sin(t * Math.PI * 2 + flight.phase) * 0.32,
    flap: 0.38 + Math.abs(Math.sin(now / flight.wingPeriod + flight.phase)) * 0.62 };
}
