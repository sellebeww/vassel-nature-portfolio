"use client";

import { createContext, useContext, useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/lib/theme";
import { createForestLayer, randomSource } from "@/lib/forest";
import ForestResidents from "@/components/forest/ForestResidents";
import { publishForestFrame } from "@/lib/forestFrame";
import { butterflyClearance, createButterflyFlight, measureForestContent, sampleButterflyFlight, type ButterflyFlight, type ForestObstacle } from "@/lib/forestWildlife";

const ForestContext = createContext({ paused: false, reduced: false });
export function useForestMotion() { return useContext(ForestContext); }
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const motionSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ForestProvider({ children }: { children: React.ReactNode }) {
  const reduced = useSyncExternalStore(subscribeMotion, motionSnapshot, () => false);
  useEffect(() => { document.documentElement.dataset.forestPaused = String(reduced); }, [reduced]);
  return <ForestContext.Provider value={{ paused: reduced, reduced }}>{children}</ForestContext.Provider>;
}

export default function ForestEnvironment() {
  return usePathname() === "/" ? <><ForestCanvas /><ForestResidents /></> : null;
}

function ForestCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const { paused, reduced } = useContext(ForestContext);
  const stateRef = useRef({ dark: theme === "dark", paused, reduced });
  const wakeRef = useRef<() => void>(() => {});
  useEffect(() => { stateRef.current = { dark: theme === "dark", paused, reduced }; wakeRef.current(); }, [theme, paused, reduced]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;
    let disposed = false;
    let width = 0, height = 0, dpr = 1, mobile = false;
    let layers: HTMLCanvasElement[] = [];
    let dayImage: HTMLImageElement | null = null, nightImage: HTMLImageElement | null = null;
    let ravenImage: HTMLImageElement | null = null;
    const journeyImages: Partial<Record<"awakening-day" | "awakening-night" | "fern" | "butterfly-pearl" | "butterfly-blue", HTMLImageElement>> = {};
    const grayWings: Partial<Record<"butterfly-pearl" | "butterfly-blue", HTMLCanvasElement>> = {};
    let nightFern: HTMLCanvasElement | null = null;
    let imageTier = "", loadVersion = 0;
    let raf = 0, previous = 0, elapsed = 0;
    let night = document.documentElement.dataset.theme === "dark" ? 1 : 0;
    let pointerX = 0, pointerY = 0, smoothX = 0, smoothY = 0, pointerInside = false;
    let scroll = window.scrollY, smoothScroll = scroll, maxScroll = 1;
    let camera = 0, publishedProgress = -1, publishedColor = -1;
    let colorStart = 0, colorAtOrganization = 1;
    let obstacles: ForestObstacle[] = [], geometryDirty = true, lastMeasurement = -1000;
    let wildlifeElapsed = 0;
    let reading = 0, readingTarget = 0;
    let menu = false, menuDepth = 0;
    const firstFlockAt = 2500, flockInterval = 30000, flockDuration = 12000, flockScrollCooldown = 16000;
    let flockStart = firstFlockAt, birdScroll = 0, scrollEnergy = 0;
    const random = randomSource(436);
    const stars = Array.from({ length: 90 }, () => ({ x: random(), y: random() * 0.53, depth: 0.2 + random() * 0.8, phase: random() * Math.PI * 2 }));
    const motes = Array.from({ length: 22 }, () => ({ x: random(), y: random(), phase: random() * Math.PI * 2 }));
    const butterflies: { nextAt: number; flight: ButterflyFlight | null }[] = Array.from({ length: 4 }, (_, index) => ({ nextAt: 1200 + index * 2800 + Math.random() * 1200, flight: null }));
    const color = (day: number[], dark: number[], alpha = 1) => `rgba(${day.map((value, i) => Math.round(value + (dark[i] - value) * night)).join(",")},${alpha})`;

    function cover(image: HTMLImageElement, zoom: number, dx: number, dy: number) {
      const ratio = Math.max(width / image.naturalWidth, height / image.naturalHeight) * zoom;
      const w = image.naturalWidth * ratio, h = image.naturalHeight * ratio;
      ctx!.drawImage(image, (width - w) / 2 + dx, (height - h) / 2 + dy, w, h);
    }

    function draw(now: number) {
      raf = 0;
      if (document.hidden || disposed) return;
      const state = stateRef.current;
      const interval = 1000 / (mobile ? 24 : 30);
      if (now - previous < interval && !state.paused) { raf = requestAnimationFrame(draw); return; }
      const dt = Math.min(now - previous || interval, 80);
      previous = now;
      if (!state.paused) elapsed += dt;
      if (!state.paused && !state.dark && !menu) wildlifeElapsed += dt;
      if (geometryDirty || elapsed - lastMeasurement > 750) {
        obstacles = measureForestContent(); geometryDirty = false; lastMeasurement = elapsed;
      }
      const target = state.dark ? 1 : 0;
      night = state.paused ? target : night + (target - night) * Math.min(dt / 520, 1);
      if (Math.abs(target - night) < 0.001) night = target;
      smoothX += ((state.paused || mobile ? 0 : pointerX) - smoothX) * 0.075;
      smoothY += ((state.paused || mobile ? 0 : pointerY) - smoothY) * 0.075;
      smoothScroll = state.paused ? scroll : smoothScroll + (scroll - smoothScroll) * (1 - Math.exp(-dt / 160));
      menuDepth = state.paused ? Number(menu) : menuDepth + (Number(menu) - menuDepth) * 0.06;
      scrollEnergy *= 0.94;
      reading = state.paused ? readingTarget : reading + (readingTarget - reading) * (1 - Math.exp(-dt / 180));
      const journey = Math.max(0, Math.min(smoothScroll / maxScroll, 1));
      const smoothStep = (value: number) => { const p = Math.max(0, Math.min(value, 1)); return p * p * (3 - 2 * p); };
      // Anchor color to the content: Organization is already 82% green, regardless
      // of screen size or the length of the galleries further down the page.
      const awakening = 0.82 * smoothStep((smoothScroll - colorStart) / Math.max(1, colorAtOrganization - colorStart))
        + 0.18 * smoothStep((smoothScroll - colorAtOrganization) / Math.max(1, maxScroll - colorAtOrganization));
      if (Math.abs(journey - publishedProgress) > 0.0005 || Math.abs(awakening - publishedColor) > 0.001) {
        document.documentElement.style.setProperty("--forest-progress", journey.toFixed(4));
        document.documentElement.style.setProperty("--forest-color", awakening.toFixed(4));
        canvas!.dataset.journey = journey.toFixed(4);
        canvas!.dataset.awakening = awakening.toFixed(4);
        publishedProgress = journey;
        publishedColor = awakening;
      }
      const clearing = Math.max(0, (journey - 0.84) / 0.16);
      // Continuous forward travel: returning upward retraces the same camera path.
      // Pausing holds the current depth; reduced motion starts at a fixed viewpoint.
      if (!state.paused) camera = journey;
      const travel = camera * (mobile ? 0.32 : 0.56);
      canvas!.dataset.cameraDepth = travel.toFixed(4);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.fillStyle = color([222, 223, 222], [15, 18, 24]);
      ctx!.fillRect(0, 0, width, height);

      // The aligned generated plates provide detailed bark and distant woodland.
      // Procedural trees supply clean parallax; the old cutouts contained horizontal artifacts.
      const zoom = 1.04 + travel * 0.62 + menuDepth * 0.025;
      const dx = smoothX * 17 + Math.sin(camera * Math.PI * 1.4) * (mobile ? 12 : 38);
      const dy = smoothY * 8 + travel * height * 0.035;
      if (dayImage && night < 1) cover(dayImage, zoom, dx, dy);
      if (journeyImages["awakening-day"] && awakening > 0.001 && night < 1) { ctx!.globalAlpha = awakening; cover(journeyImages["awakening-day"], zoom, dx, dy); ctx!.globalAlpha = 1; }
      if (nightImage && night > 0) { ctx!.globalAlpha = night; cover(nightImage, zoom, dx, dy); ctx!.globalAlpha = 1; }
      if (journeyImages["awakening-night"] && awakening > 0.001 && night > 0) { ctx!.globalAlpha = awakening * night; cover(journeyImages["awakening-night"], zoom, dx, dy); ctx!.globalAlpha = 1; }
      if (!nightImage && night > 0) { ctx!.fillStyle = `rgba(9,22,34,${night * 0.78})`; ctx!.fillRect(0, 0, width, height); }
      const dusk = Math.sin(night * Math.PI) * 0.06;
      if (dusk > 0.005) { ctx!.fillStyle = `rgba(154,155,160,${dusk})`; ctx!.fillRect(0, 0, width, height); }

      if (night > 0.01) {
        const aurora = ctx!.createRadialGradient(width * 0.6, 0, 5, width * 0.6, 0, width * 0.45);
        aurora.addColorStop(0, `rgba(126,140,160,${night * (0.075 + Math.sin(elapsed / 18000) * 0.015)})`);
        aurora.addColorStop(1, "rgba(126,140,160,0)");
        ctx!.fillStyle = aurora; ctx!.fillRect(0, 0, width, height * 0.6);
        stars.slice(0, mobile ? 30 : stars.length).forEach((star) => {
          const x = star.x * width + smoothX * (5 + star.depth * 27);
          const y = star.y * height + smoothY * star.depth * 17 - journey * star.depth * 28;
          const proximity = pointerInside && !state.paused && !mobile ? Math.max(0, 1 - Math.hypot(x - (pointerX + 0.5) * width, y - (pointerY + 0.5) * height) / 110) : 0;
          const radius = 0.45 + star.depth * 0.75 + proximity * 0.9;
          const alpha = night * Math.min(0.9, 0.32 + star.depth * 0.25 + Math.sin(elapsed / 2500 + star.phase) * 0.12 + proximity * 0.3);
          if (proximity > 0.03 || star.depth > 0.8) {
            const glowRadius = 4 + proximity * 9;
            const glow = ctx!.createRadialGradient(x, y, 0, x, y, glowRadius);
            glow.addColorStop(0, `rgba(196,219,230,${alpha * 0.45})`); glow.addColorStop(1, "rgba(196,219,230,0)");
            ctx!.fillStyle = glow; ctx!.fillRect(x - glowRadius, y - glowRadius, glowRadius * 2, glowRadius * 2);
          }
          ctx!.fillStyle = `rgba(224,236,235,${alpha})`;
          ctx!.beginPath(); ctx!.arc(x, y, radius, 0, Math.PI * 2); ctx!.fill();
        });
        const moonX = width * 0.7 + smoothX * 3, moonY = height * 0.17;
        const moonGlow = ctx!.createRadialGradient(moonX, moonY, 0, moonX, moonY, 62);
        moonGlow.addColorStop(0, `rgba(211,226,224,${night * 0.22})`); moonGlow.addColorStop(1, "rgba(211,226,224,0)");
        ctx!.fillStyle = moonGlow; ctx!.fillRect(moonX - 62, moonY - 62, 124, 124);
        ctx!.fillStyle = `rgba(230,238,226,${night * 0.8})`;
        ctx!.beginPath(); ctx!.arc(moonX, moonY, mobile ? 9 : 13, 0, Math.PI * 2); ctx!.fill();
        const meteorTime = (elapsed - 9000) % 31000;
        if (meteorTime >= 0 && meteorTime < 1800 && !state.paused) {
          const progress = meteorTime / 1800, x = width * (0.77 - progress * 0.2), y = height * (0.07 + progress * 0.13);
          const trail = ctx!.createLinearGradient(x, y, x + 74, y - 34);
          trail.addColorStop(0, `rgba(222,237,239,${Math.sin(progress * Math.PI) * 0.75 * night})`); trail.addColorStop(1, "rgba(222,237,239,0)");
          ctx!.strokeStyle = trail; ctx!.lineWidth = 1; ctx!.beginPath(); ctx!.moveTo(x, y); ctx!.lineTo(x + 74, y - 34); ctx!.stroke();
        }
      }

      // Small flocks visit every thirty seconds, with a quiet gap between crossings.
      if (elapsed - flockStart > flockInterval) flockStart = elapsed;
      const flockTime = elapsed - flockStart;
      canvas!.dataset.flockActive = String(night < 0.5 && flockTime >= 0 && flockTime < flockDuration);
      if (night < 0.99 && flockTime >= 0 && flockTime < flockDuration) {
        for (let i = 0; i < (mobile ? 2 : 3); i++) {
          const progress = (flockTime - i * 650) / 10000;
          if (progress < 0 || progress > 1) continue;
          const reverse = Math.floor(Math.max(0, elapsed - firstFlockAt) / flockInterval) % 2 === 1;
          const x = (reverse ? 1 - progress : progress) * (width + 100) - 50;
          const y = height * (0.18 + i * 0.025 + Math.sin(progress * Math.PI) * (i % 2 ? 0.06 : -0.04));
          const flap = Math.sin(elapsed / 170 + i * 1.7) * 2.6, size = mobile ? 3 : 4.5 - i * 0.6;
          ctx!.strokeStyle = `rgba(25,26,28,${(1 - night) * 0.72})`; ctx!.lineWidth = mobile ? 1 : 1.25;
          if (ravenImage && i === 0) {
            const birdSize = mobile ? 17 : 24;
            ctx!.save(); ctx!.globalAlpha = (1 - night) * 0.74;
            ctx!.translate(x, y); ctx!.scale(reverse ? -1 : 1, 0.84 + Math.sin(elapsed / 350) * 0.12);
            ctx!.drawImage(ravenImage, -birdSize / 2, -birdSize / 2, birdSize, birdSize); ctx!.restore();
            continue;
          }
          ctx!.beginPath(); ctx!.moveTo(x - size, y - flap); ctx!.quadraticCurveTo(x - size * 0.5, y - 2.5, x, y); ctx!.quadraticCurveTo(x + size * 0.5, y - 2.5, x + size, y - flap); ctx!.stroke();
        }
      }

      layers.forEach((layer, index) => {
        const depth = (index + 1) / layers.length;
        const scale = 1.04 + travel * depth * 1.8 + menuDepth * 0.035;
        ctx!.globalAlpha = dayImage ? (0.018 + index * 0.012) * (1 - clearing * 0.35) : 0.14 + index * 0.13;
        ctx!.drawImage(layer, (width - width * scale) / 2 + smoothX * depth * 35, (height - height * scale) / 2 + smoothY * depth * 14 + travel * depth * height * 0.14, width * scale, height * scale);
        ctx!.globalAlpha = 1;
      });

      // Independently drifting fog volumes connect the depth planes.
      for (let i = 0; i < (mobile ? 2 : 3); i++) {
        const x = width * (0.2 + i * 0.32 + Math.sin(elapsed / (19000 + i * 5000) + i) * 0.06);
        const y = height * (0.64 + i * 0.13) - travel * height * 0.2;
        const fog = ctx!.createRadialGradient(x, y, 0, x, y, width * 0.6);
        const fogOpacity = (i === 0 ? 0.055 : 0.035) + night * (i === 0 ? 0.095 : 0.075);
        fog.addColorStop(0, color([207, 215, 200], [123, 133, 148], fogOpacity + clearing * 0.01));
        fog.addColorStop(1, color([207, 215, 200], [123, 133, 148], 0));
        ctx!.fillStyle = fog; ctx!.fillRect(0, 0, width, height);
      }

      if (pointerInside && !state.paused && !mobile) {
        const px = (smoothX + 0.5) * width, py = (smoothY + 0.5) * height;
        const lantern = ctx!.createRadialGradient(px, py, 0, px, py, 210);
        lantern.addColorStop(0, color([255, 255, 251], [181, 195, 219], night > 0.5 ? 0.085 : 0.11));
        lantern.addColorStop(1, "rgba(230,233,238,0)");
        ctx!.fillStyle = lantern; ctx!.fillRect(px - 210, py - 210, 420, 420);
      }

      // New leaves appear with the color, swaying closest to the viewer.
      const fern = journeyImages.fern;
      if (fern && awakening > 0.001) {
        const scale = 1.03 + travel * 0.3;
        const fx = (width - width * scale) / 2 + Math.sin(elapsed / 6700) * 8 + smoothX * 33;
        const fy = height * (0.08 - camera * 0.1) + Math.sin(elapsed / 9100) * 3;
        ctx!.globalAlpha = awakening * (1 - night) * 0.7;
        ctx!.drawImage(fern, fx, fy, width * scale, height * scale);
        if (nightFern && night > 0) { ctx!.globalAlpha = awakening * night * 0.5; ctx!.drawImage(nightFern, fx, fy, width * scale, height * scale); }
        ctx!.globalAlpha = 1;
      }

      // A bounded reading clearing, leaving the forest visible at the edges.
      const haze = ctx!.createRadialGradient(width * 0.5, height * 0.48, 0, width * 0.5, height * 0.48, width * (mobile ? 0.64 : 0.4));
      haze.addColorStop(0, color([224, 229, 216], [16, 20, 28], mobile ? 0.54 + night * 0.04 : 0.5 + night * 0.12));
      haze.addColorStop(0.58, color([224, 229, 216], [16, 20, 28], mobile ? 0.28 + night * 0.06 : 0.27 + night * 0.16));
      haze.addColorStop(1, color([224, 229, 216], [16, 20, 28], 0));
      ctx!.fillStyle = haze; ctx!.fillRect(0, 0, width, height);
      // A short, muted veil supports the navigation without whitening the canopy.
      const topVeilHeight = height * (0.14 + night * 0.11);
      const topMist = ctx!.createLinearGradient(0, 0, 0, topVeilHeight);
      topMist.addColorStop(0, color([211, 217, 206], [14, 18, 25], 0.24 + night * 0.71));
      topMist.addColorStop(0.65, color([211, 217, 206], [14, 18, 25], 0.06 + night * 0.34));
      topMist.addColorStop(1, "rgba(0,0,0,0)"); ctx!.fillStyle = topMist; ctx!.fillRect(0, 0, width, topVeilHeight);
      // Daylight keeps the forest floor exposed; only night retains an edge shade.
      if (night > 0.001) {
        const groundMist = ctx!.createLinearGradient(0, height * 0.79, 0, height);
        groundMist.addColorStop(0, "rgba(17,22,29,0)"); groundMist.addColorStop(1, `rgba(17,22,29,${night * 0.88})`);
        ctx!.fillStyle = groundMist; ctx!.fillRect(0, height * 0.79, width, height * 0.21);
      }

      // Brief, irregular daylight visits. Content boundaries stay completely clear.
      let visibleButterflies = 0;
      if (night < 0.99 && !menu && !state.reduced) butterflies.slice(0, mobile ? 2 : 4).forEach(slot => {
        if (!slot.flight && wildlifeElapsed >= slot.nextAt && !state.paused) slot.flight = createButterflyFlight(wildlifeElapsed, mobile, readingTarget > 0.45, width, height, obstacles);
        const flight = slot.flight;
        if (!flight) return;
        if (wildlifeElapsed - flight.start >= flight.duration) {
          slot.flight = null; slot.nextAt = wildlifeElapsed + 2200 + Math.random() * 4800; return;
        }
        const sprite = journeyImages[flight.kind], gray = grayWings[flight.kind];
        if (!sprite || !gray) return;
        const { x, y, alpha: envelope, angle, flap } = sampleButterflyFlight(flight, wildlifeElapsed, width, height);
        const alpha = envelope * (1 - night) * butterflyClearance(x, y, flight.size * 0.72, obstacles);
        if (alpha < 0.005 || x < -flight.size || x > width + flight.size) return;
        if (alpha > 0.02 && x > 0 && x < width) visibleButterflies++;
        ctx!.save(); ctx!.translate(x, y); ctx!.rotate(angle); ctx!.scale(flap, 1);
        ctx!.globalAlpha = alpha * (1 - awakening); ctx!.drawImage(gray, -flight.size / 2, -flight.size / 2, flight.size, flight.size);
        if (awakening > 0.001) { ctx!.globalAlpha = alpha * awakening; ctx!.drawImage(sprite, -flight.size / 2, -flight.size / 2, flight.size, flight.size); }
        ctx!.restore();
      });
      canvas!.dataset.butterflies = String(visibleButterflies);
      // Quiet the whole photograph when dense content occupies the viewport.
      if (reading > 0.001) {
        ctx!.fillStyle = color([221, 228, 214], [16, 22, 29], reading * (0.1 + night * 0.16));
        ctx!.fillRect(0, 0, width, height);
      }
      canvas!.dataset.readingStrength = reading.toFixed(3);
      publishForestFrame({ elapsed, width, height, journey, paused: state.paused, reading: readingTarget > 0.45, menuOpen: menu, obstacles });
      motes.slice(0, mobile ? 9 : motes.length).forEach((mote) => {
        const x = ((mote.x + elapsed / 230000 * 0.1) % 1) * width + Math.sin(elapsed / 4700 + mote.phase) * 12;
        const y = (((mote.y - elapsed / 320000) % 1 + 1) % 1) * height;
        const alpha = 0.4 + Math.sin(elapsed / 2400 + mote.phase) * 0.2;
        ctx!.fillStyle = color([255, 255, 252], [220, 228, 239], alpha);
        ctx!.beginPath(); ctx!.arc(x, y, night > 0.5 ? 1.35 : 1, 0, Math.PI * 2); ctx!.fill();
      });
      if (!state.paused) raf = requestAnimationFrame(draw);
    }

    const wake = () => { if (!raf && !document.hidden && !disposed) raf = requestAnimationFrame(draw); };
    wakeRef.current = wake;
    function loadAssets() {
      const tier = mobile ? "-mobile" : "";
      if (tier === imageTier && dayImage) return;
      imageTier = tier;
      const version = ++loadVersion;
      for (const kind of ["morning", "night", "raven"] as const) {
        const image = new window.Image();
        image.decoding = "async";
        image.src = `/images/atmosphere/folklore-${kind}-v3${kind === "raven" ? "" : tier}.webp`;
        image.decode().then(() => {
          if (disposed || version !== loadVersion) return;
          if (kind === "morning") dayImage = image;
          else if (kind === "night") nightImage = image;
          else if (kind === "raven") ravenImage = image;
          canvas!.dataset.assetsLoaded = String([dayImage, nightImage, ravenImage].filter(Boolean).length);
          wake();
        }).catch(() => { /* Procedural trees remain available if a bitmap fails to load. */ });
      }
      for (const kind of ["awakening-day", "awakening-night", "fern", "butterfly-pearl", "butterfly-blue"] as const) {
        const image = new window.Image(); image.decoding = "async";
        image.src = `/images/forest-journey/${kind}${kind.startsWith("butterfly") ? "" : tier}.webp`;
        image.decode().then(() => {
          if (disposed || version !== loadVersion) return;
          journeyImages[kind] = image;
          if (kind === "butterfly-pearl" || kind === "butterfly-blue") {
            const gray = document.createElement("canvas"); gray.width = image.naturalWidth; gray.height = image.naturalHeight;
            const context = gray.getContext("2d")!; context.filter = "grayscale(1)"; context.drawImage(image, 0, 0); grayWings[kind] = gray;
          }
          if (kind === "fern") {
            nightFern = document.createElement("canvas"); nightFern.width = image.naturalWidth; nightFern.height = image.naturalHeight;
            const context = nightFern.getContext("2d")!; context.drawImage(image, 0, 0); context.globalCompositeOperation = "source-atop";
            context.fillStyle = "rgba(10,28,34,.73)"; context.fillRect(0, 0, image.naturalWidth, image.naturalHeight);
          }
          canvas!.dataset.journeyAssetsLoaded = String(Object.keys(journeyImages).length);
          wake();
        }).catch(() => { /* Keep the original monochrome forest if an extra asset is unavailable. */ });
      }
    }
    const resize = () => {
      width = window.innerWidth; height = window.innerHeight; mobile = width < 768;
      maxScroll = Math.max(1, document.documentElement.scrollHeight - height);
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.35);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      const layerWidth = Math.min(width, 1400), layerHeight = Math.round(height * layerWidth / width);
      layers = Array.from({ length: mobile ? 3 : 5 }, (_, index) => createForestLayer(layerWidth, layerHeight, index, mobile));
      loadAssets(); wake();
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || stateRef.current.paused) return;
      pointerInside = true; pointerX = event.clientX / width - 0.5; pointerY = event.clientY / height - 0.5;
    };
    const onPointerLeave = () => { pointerInside = false; pointerX = 0; pointerY = 0; };
    const onScroll = () => {
      geometryDirty = true;
      const delta = Math.abs(window.scrollY - scroll);
      birdScroll += delta; scrollEnergy = Math.min(1, scrollEnergy + delta / 500);
      scroll = window.scrollY; maxScroll = Math.max(1, document.documentElement.scrollHeight - height);
      readingTarget = 0;
      for (const section of document.querySelectorAll<HTMLElement>(".forest-section:not(.forest-contact)")) {
        const rect = section.getBoundingClientRect();
        const entering = Math.max(0, Math.min((height * 0.65 - rect.top) / (height * 0.28), 1));
        const leaving = Math.max(0, Math.min((rect.bottom - height * 0.35) / (height * 0.28), 1));
        readingTarget = Math.max(readingTarget, entering * leaving);
      }
      document.documentElement.dataset.forestReading = String(readingTarget > 0.45);
      const hero = document.getElementById("home");
      colorStart = (hero?.offsetHeight || height) * 0.2;
      const organization = document.getElementById("organization");
      colorAtOrganization = Math.max(colorStart + height, organization ? organization.getBoundingClientRect().top + scroll - height * 0.35 : maxScroll * 0.25);
      if (!stateRef.current.paused && !stateRef.current.dark && birdScroll > 180 && elapsed - flockStart > flockScrollCooldown) { flockStart = elapsed; birdScroll = 0; }
      wake();
    };
    const onMenu = (event: Event) => { menu = (event as CustomEvent<boolean>).detail; wake(); };
    const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else { previous = performance.now(); wake(); } };
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { resize(); onScroll(); }, 150); };
    resize(); onScroll();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("forest-menu", onMenu);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      disposed = true; cancelAnimationFrame(raf); clearTimeout(resizeTimer); layers = []; wakeRef.current = () => {};
      dayImage = null; nightImage = null; ravenImage = null;
      document.documentElement.style.removeProperty("--forest-progress"); document.documentElement.style.removeProperty("--forest-color");
      delete document.documentElement.dataset.forestReading;
      window.removeEventListener("resize", onResize); window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onPointerLeave); window.removeEventListener("scroll", onScroll);
      window.removeEventListener("forest-menu", onMenu); document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <div className="forest-environment" aria-hidden="true"><div className="forest-static-fallback" /><canvas ref={canvasRef} /><div className="forest-paper" /></div>;
}
