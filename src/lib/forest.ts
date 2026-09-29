/** Seeded, cached woodland geometry. Only the five depth planes move per frame. */
export function randomSource(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

export function createForestLayer(width: number, height: number, depth: number, mobile: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const random = randomSource(781 + depth * 313);
  const ground = height * (0.67 + depth * 0.064);
  const count = mobile ? 17 - depth * 2 : 32 - depth * 4;

  function branch(x: number, y: number, length: number, angle: number, thickness: number, level: number) {
    const endX = x + Math.sin(angle) * length;
    const endY = y - Math.cos(angle) * length;
    ctx.lineWidth = Math.max(0.45, thickness);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + Math.sin(angle + 0.13) * length * 0.55, y - length * 0.55, endX, endY);
    ctx.stroke();
    if (level === 0) {
      for (let leaf = 0; leaf < 8; leaf++) {
        const lx = endX + (random() - 0.5) * 24;
        const ly = endY + (random() - 0.5) * 15;
        ctx.globalAlpha = 0.25 + random() * 0.45;
        ctx.beginPath();
        ctx.ellipse(lx, ly, 1 + random() * 2.4, 0.7 + random() * 1.1, random() * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      return;
    }
    branch(endX, endY, length * (0.61 + random() * 0.18), angle - 0.25 - random() * 0.45, thickness * 0.55, level - 1);
    branch(endX, endY, length * (0.56 + random() * 0.19), angle + 0.25 + random() * 0.5, thickness * 0.53, level - 1);
  }

  ctx.fillStyle = "#2b2d30";
  ctx.strokeStyle = "#2b2d30";
  ctx.lineCap = "round";
  for (let i = 0; i < count; i++) {
    let x = ((i + random() * 0.8) / count) * width;
    // A deliberate clearing: the closest trunks frame the introduction.
    if (depth > 1 && x > width * 0.29 && x < width * 0.72) {
      x = i % 2 ? width * (0.75 + random() * 0.23) : width * (random() * 0.24);
    }
    const base = ground + random() * height * 0.055;
    const treeHeight = height * (0.62 + random() * 0.36 + depth * 0.055);
    const thickness = (2.3 + random() * 4.3) * (1 + depth * 0.8) * (width / 1400);
    const lean = (random() - 0.5) * 65;
    const top = base - treeHeight;
    ctx.beginPath();
    ctx.moveTo(x - thickness * 0.95, base);
    ctx.bezierCurveTo(x - thickness / 2, base - treeHeight * 0.15, x + lean * 0.65 - thickness * 0.28, top + treeHeight * 0.32, x + lean - thickness * 0.13, top);
    ctx.lineTo(x + lean + thickness * 0.14, top);
    ctx.bezierCurveTo(x + lean * 0.65 + thickness * 0.28, top + treeHeight * 0.32, x + thickness / 2, base - treeHeight * 0.15, x + thickness * 0.95, base);
    ctx.fill();
    for (let b = 0; b < 6; b++) {
      const fraction = 0.48 + random() * 0.43;
      const side = b % 2 ? 1 : -1;
      branch(x + lean * fraction, base - treeHeight * fraction, treeHeight * (0.09 + random() * 0.06), side * (0.38 + random() * 0.5), thickness * 0.24, mobile ? 3 : 4);
    }
    // Fine, broken bark highlights avoid perfectly geometric silhouettes.
    ctx.strokeStyle = "rgba(227,232,221,0.16)";
    ctx.lineWidth = Math.max(0.5, thickness * 0.06);
    for (let b = 0; b < 12; b++) {
      const fraction = random() * 0.75;
      const by = base - treeHeight * fraction;
      const bx = x + lean * fraction + (random() - 0.5) * thickness * 0.6;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + 1, by - random() * 36); ctx.stroke();
    }
    ctx.strokeStyle = "#2b2d30";
  }

  // Dissolve roots into ground mist rather than ending trunks on a hard edge.
  ctx.globalCompositeOperation = "destination-out";
  const rootMist = ctx.createLinearGradient(0, ground - height * 0.14, 0, ground + height * 0.055);
  rootMist.addColorStop(0, "rgba(0,0,0,0)");
  rootMist.addColorStop(0.55, "rgba(0,0,0,0.25)");
  rootMist.addColorStop(1, "rgba(0,0,0,1)");
  ctx.fillStyle = rootMist;
  ctx.fillRect(0, ground - height * 0.14, width, height * 0.5);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#2b2d30";
  // Broken ground cover, with a narrow path left open in the center.
  for (let i = 0; i < (mobile ? 350 : 850); i++) {
    const x = random() * width;
    const y = ground + random() * height * 0.23;
    const pathWidth = (y - ground) * 0.75 + 24;
    if (Math.abs(x - width * 0.53) < pathWidth) continue;
    ctx.globalAlpha = random() * 0.25;
    ctx.beginPath();
    ctx.ellipse(x, y, 1 + random() * (2 + depth), 0.5 + random() * 1.5, random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  return canvas;
}
