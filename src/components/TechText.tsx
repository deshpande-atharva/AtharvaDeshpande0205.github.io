import { useRef, useEffect, useCallback } from "react";
import "./styles/TechText.css";

interface Glyph {
  char: string;
  x: number;
  w: number;
  left: number;
  right: number;
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
  outline: number;
  kickTime: number;
  fillSprite: HTMLCanvasElement | null;
  dashSprite: HTMLCanvasElement | null;
}

interface TechTextProps {
  text: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  letterSpacing?: number;
  color?: string;
  accentColor?: string;
  strokeWidth?: number;
  dashLength?: number;
  dashGap?: number;
  lineStyle?: "dashed" | "solid";
  specks?: number;
  reveal?: "letter" | "area";
  reach?: number;
  softness?: number;
  clickKick?: boolean;
  draggable?: boolean;
  sweep?: boolean;
  guides?: boolean;
  labels?: boolean;
  selection?: boolean;
  speed?: number;
  bounce?: number;
  intro?: "none" | "type";
  introDuration?: number;
  align?: "left" | "center" | "right";
  autoSize?: boolean;
}

const SPRING = 320;
const KICK_DECAY = 0.62;

function createSprite(
  char: string,
  fontSize: number,
  fontWeight: number,
  fontFamily: string,
  color: string,
  strokeWidth: number,
  dashLength: number,
  dashGap: number,
  lineStyle: string,
  isStroke: boolean
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const pad = fontSize * 0.5;
  canvas.width = fontSize * 2;
  canvas.height = fontSize * 2;
  const ctx = canvas.getContext("2d")!;
  const font = `${fontWeight} ${fontSize}px ${fontFamily || "Geist, sans-serif"}`;
  ctx.font = font;
  ctx.textBaseline = "middle";

  const cx = pad;
  const cy = canvas.height / 2;

  if (isStroke) {
    ctx.lineJoin = "round";
    ctx.lineWidth = strokeWidth * 2;
    ctx.strokeStyle = color;
    if (lineStyle === "dashed") {
      ctx.setLineDash([Math.max(1, dashLength), Math.max(1, dashGap)]);
    }
    ctx.strokeText(char, cx, cy);
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillText(char, cx, cy);
  } else {
    ctx.fillStyle = color;
    ctx.fillText(char, cx, cy);
  }

  return canvas;
}

const TechText = ({
  text,
  fontSize = 150,
  fontWeight = 600,
  fontFamily = "",
  letterSpacing = -0.05,
  color = "currentColor",
  accentColor = "currentColor",
  strokeWidth = 1.5,
  dashLength = 4,
  dashGap = 2,
  lineStyle = "dashed",
  specks = 15,
  reveal = "letter",
  reach = 200,
  softness = 0.7,
  clickKick = true,
  draggable = true,
  sweep = true,
  guides = false,
  labels = false,
  selection = true,
  speed = 1,
  bounce = 0.4,
  intro = "none",
  introDuration = 2,
  align = "center",
  autoSize = false,
}: TechTextProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glyphsRef = useRef<Glyph[]>([]);
  const animRef = useRef<number>(0);
  const pointerRef = useRef({ x: -9999, y: -9999, inside: false });
  const lensRef = useRef({ x: -9999, y: -9999 });
  const dragRef = useRef<number>(-1);
  const grabRef = useRef({ x: 0, y: 0 });
  const clockRef = useRef(0);
  const introClockRef = useRef(0);
  const lastTimeRef = useRef(0);
  const viewRef = useRef({ left: 0, top: 0, right: 0, bottom: 0, baseline: 0, width: 0, height: 0 });
  const resolvedColorRef = useRef(color);
  const resolvedAccentRef = useRef(accentColor);
  const dprRef = useRef(window.devicePixelRatio || 1);
  const scaledSizeRef = useRef(fontSize);

  const resolveColor = useCallback((c: string, el: HTMLElement) => {
    if (c === "currentColor") {
      return getComputedStyle(el).color;
    }
    return c;
  }, []);

  const buildGlyphs = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const dpr = dprRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const resolvedC = resolveColor(color, canvas);
    resolvedColorRef.current = resolvedC;
    resolvedAccentRef.current = resolveColor(accentColor, canvas);

    let scaledSize = fontSize;
    if (autoSize && canvas.parentElement) {
      const computed = getComputedStyle(canvas.parentElement);
      scaledSize = parseFloat(computed.fontSize) || fontSize;
    }
    scaledSizeRef.current = scaledSize;
    const font = `${fontWeight} ${scaledSize}px ${fontFamily || "Geist, sans-serif"}`;
    ctx.font = font;
    ctx.textBaseline = "middle";

    const spacing = letterSpacing * scaledSize;
    const chars = text.split("");
    let totalWidth = 0;

    const measurements = chars.map((char) => {
      const m = ctx.measureText(char);
      const w = m.width + spacing;
      totalWidth += w;
      return { char, w, advance: m.width };
    });
    totalWidth -= spacing; // remove trailing spacing

    let startX: number;
    if (align === "center") startX = (rect.width - totalWidth) / 2;
    else if (align === "right") startX = rect.width - totalWidth - 20;
    else startX = 0;

    const centerY = rect.height / 2;

    let cursor = startX;
    const glyphs: Glyph[] = measurements.map(({ char, w }) => {
      const g: Glyph = {
        char,
        x: cursor,
        w,
        left: cursor,
        right: cursor + w,
        offset: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        outline: 0,
        kickTime: -1,
        fillSprite: createSprite(char, scaledSize, fontWeight, fontFamily, resolvedC, strokeWidth, dashLength, dashGap, lineStyle, false),
        dashSprite: createSprite(char, scaledSize, fontWeight, fontFamily, resolvedC, strokeWidth, dashLength, dashGap, lineStyle, true),
      };
      cursor += w;
      return g;
    });

    glyphsRef.current = glyphs;
    viewRef.current = {
      left: startX,
      top: centerY - scaledSize / 2,
      right: startX + totalWidth,
      bottom: centerY + scaledSize / 2,
      baseline: centerY,
      width: rect.width,
      height: rect.height,
    };
  }, [text, fontSize, fontWeight, fontFamily, letterSpacing, color, accentColor, strokeWidth, dashLength, dashGap, lineStyle, align, autoSize, resolveColor]);

  const perimeterPoint = useCallback((dist: number, x: number, y: number, w: number, h: number) => {
    const perimeter = 2 * (w + h);
    let d = ((dist % perimeter) + perimeter) % perimeter;
    if (d < w) return { px: x + d, py: y, nx: 0, ny: -1 };
    d -= w;
    if (d < h) return { px: x + w, py: y + d, nx: 1, ny: 0 };
    d -= h;
    if (d < w) return { px: x + w - d, py: y + h, nx: 0, ny: 1 };
    d -= w;
    return { px: x, py: y + h - d, nx: -1, ny: 0 };
  }, []);

  const noise = useCallback((a: number, b: number) => {
    let h = (a * 2654435761 + b * 2246822519) >>> 0;
    h = ((h >> 16) ^ h) * 0x45d9f3b;
    h = ((h >> 16) ^ h) * 0x45d9f3b;
    h = (h >> 16) ^ h;
    return (h & 0xffff) / 0xffff;
  }, []);

  useEffect(() => {
    buildGlyphs();

    const handleResize = () => {
      dprRef.current = window.devicePixelRatio || 1;
      buildGlyphs();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [buildGlyphs]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = dprRef.current;

    const getPos = (e: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onMove = (e: MouseEvent) => {
      const p = getPos(e);
      pointerRef.current = { ...p, inside: true };
      if (dragRef.current >= 0) {
        const g = glyphsRef.current[dragRef.current];
        if (g) {
          g.offset.x = p.x - grabRef.current.x;
          g.offset.y = p.y - grabRef.current.y;
          g.velocity.x = 0;
          g.velocity.y = 0;
        }
      }
    };
    const onLeave = () => {
      pointerRef.current.inside = false;
      if (dragRef.current >= 0) {
        dragRef.current = -1;
      }
    };
    const onDown = (e: MouseEvent) => {
      const p = getPos(e);
      if (clickKick) {
        const view = viewRef.current;
        const glyphs = glyphsRef.current;
        let closest = -1;
        let minDist = Infinity;
        for (let i = 0; i < glyphs.length; i++) {
          const g = glyphs[i];
          const cx = g.x + g.w / 2 + g.offset.x;
          const cy = view.baseline + g.offset.y;
          const dist = Math.hypot(p.x - cx, p.y - cy);
          if (dist < minDist && dist < reach) {
            minDist = dist;
            closest = i;
          }
        }
        if (closest >= 0) {
          const kickStrength = 600;
          glyphs[closest].velocity.y -= kickStrength;
          glyphs[closest].kickTime = performance.now();
          // Propagate to neighbors
          for (let dir = -1; dir <= 1; dir += 2) {
            let decay = KICK_DECAY;
            for (let j = closest + dir; j >= 0 && j < glyphs.length; j += dir) {
              glyphs[j].velocity.y -= kickStrength * decay;
              glyphs[j].kickTime = performance.now() + Math.abs(j - closest) * 55;
              decay *= KICK_DECAY;
              if (decay < 0.05) break;
            }
          }
        }
      }
      if (draggable) {
        const glyphs = glyphsRef.current;
        const view = viewRef.current;
        for (let i = glyphs.length - 1; i >= 0; i--) {
          const g = glyphs[i];
          const cx = g.x + g.w / 2 + g.offset.x;
          const cy = view.baseline + g.offset.y;
          if (Math.hypot(p.x - cx, p.y - cy) < g.w) {
            dragRef.current = i;
            grabRef.current = { x: p.x - g.offset.x, y: p.y - g.offset.y };
            break;
          }
        }
      }
    };
    const onUp = () => {
      dragRef.current = -1;
    };

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseup", onUp);

    return () => {
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseup", onUp);
    };
  }, [clickKick, draggable, reach]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const dpr = dprRef.current;
    lastTimeRef.current = performance.now();

    const damping = 2 * Math.sqrt(SPRING) * (1 - bounce * 0.96);

    const loop = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;

      const glyphs = glyphsRef.current;
      const view = viewRef.current;
      const pointer = pointerRef.current;
      const lens = lensRef.current;

      if (!glyphs.length) {
        animRef.current = requestAnimationFrame(loop);
        return;
      }

      // Intro
      if (intro === "type") {
        introClockRef.current += dt;
      }

      // Sweep (auto cursor when pointer is outside)
      const sweeping = sweep && !pointer.inside && dragRef.current < 0;
      if (sweeping) {
        clockRef.current += dt * speed;
        const t = clockRef.current;
        const targetX = view.left + (view.right - view.left) * (0.5 - 0.5 * Math.cos(t * 0.45));
        const targetY = view.top + (view.bottom - view.top) * (0.45 + 0.1 * Math.sin(t * 0.8));
        const lag = 1 - Math.exp(-dt / 0.22);
        lens.x += (targetX - lens.x) * lag;
        lens.y += (targetY - lens.y) * lag;
      } else {
        const lag = 1 - Math.exp(-dt / 0.05);
        lens.x += (pointer.x - lens.x) * lag;
        lens.y += (pointer.y - lens.y) * lag;
      }

      // Physics
      for (let i = 0; i < glyphs.length; i++) {
        const g = glyphs[i];
        if (dragRef.current === i) continue;

        g.velocity.x += (-SPRING * g.offset.x - damping * g.velocity.x) * dt;
        g.velocity.y += (-SPRING * g.offset.y - damping * g.velocity.y) * dt;
        g.offset.x += g.velocity.x * dt;
        g.offset.y += g.velocity.y * dt;

        // Reveal: transition outline based on pointer proximity
        const cx = g.x + g.w / 2;
        const cy = view.baseline;
        const dist = Math.hypot(lens.x - cx, lens.y - cy);
        const targetOutline = dist < reach ? 1 - Math.pow(Math.max(0, dist / reach), 1 / (1 - softness * 0.9 + 0.1)) : 0;
        const outlineSpeed = 8;
        g.outline += (targetOutline - g.outline) * Math.min(1, dt * outlineSpeed);
      }

      // Clear & draw
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, view.width, view.height);

      const scaledSize = scaledSizeRef.current;
      const pad = scaledSize * 0.5;

      // Guides
      if (guides) {
        const rc = resolvedAccentRef.current;
        ctx.strokeStyle = rc;
        ctx.globalAlpha = 0.12;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        const lines = [view.top, view.baseline, view.bottom];
        for (const ly of lines) {
          ctx.beginPath();
          ctx.moveTo(view.left, ly);
          ctx.lineTo(view.right, ly);
          ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }

      // Draw glyphs
      for (let i = 0; i < glyphs.length; i++) {
        const g = glyphs[i];

        // Intro typing gate
        if (intro === "type") {
          const charTime = 0.15 + (i * introDuration) / glyphs.length;
          if (introClockRef.current < charTime) continue;
        }

        const dx = g.x + g.offset.x;
        const dy = view.baseline + g.offset.y - scaledSize / 2 - pad / 2;

        // Draw fill (fades out as outline increases)
        if (g.outline < 0.999 && g.fillSprite) {
          ctx.globalAlpha = 1 - g.outline;
          ctx.drawImage(g.fillSprite, dx - pad, dy);
        }
        // Draw dashed outline (fades in)
        if (g.outline > 0.001 && g.dashSprite) {
          ctx.globalAlpha = g.outline;
          ctx.drawImage(g.dashSprite, dx - pad, dy);
        }
      }
      ctx.globalAlpha = 1;

      // Selection frame around hovered glyph
      if (selection) {
        let closestIdx = -1;
        let minDist = Infinity;
        for (let i = 0; i < glyphs.length; i++) {
          const g = glyphs[i];
          const cx = g.x + g.w / 2 + g.offset.x;
          const cy = view.baseline + g.offset.y;
          const d = Math.hypot(lens.x - cx, lens.y - cy);
          if (d < reach && d < minDist) {
            minDist = d;
            closestIdx = i;
          }
        }

        if (closestIdx >= 0) {
          const g = glyphs[closestIdx];
          const fx = g.x + g.offset.x - 4;
          const fy = view.top + g.offset.y - 4;
          const fw = g.w + 8;
          const fh = (view.bottom - view.top) + 8;

          ctx.strokeStyle = resolvedAccentRef.current;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.3 * Math.min(1, g.outline * 3);
          ctx.setLineDash([3, 3]);
          ctx.strokeRect(fx, fy, fw, fh);
          ctx.setLineDash([]);

          // Corner marks
          const cornerLen = 6;
          ctx.globalAlpha = 0.5 * Math.min(1, g.outline * 3);
          ctx.lineWidth = 1.5;
          const corners = [
            [fx, fy], [fx + fw, fy],
            [fx, fy + fh], [fx + fw, fy + fh],
          ];
          for (const [cx, cy] of corners) {
            const sx = cx === fx ? 1 : -1;
            const sy = cy === fy ? 1 : -1;
            ctx.beginPath();
            ctx.moveTo(cx + sx * cornerLen, cy);
            ctx.lineTo(cx, cy);
            ctx.lineTo(cx, cy + sy * cornerLen);
            ctx.stroke();
          }

          // Label
          if (labels) {
            ctx.globalAlpha = 0.5;
            ctx.font = "10px ui-monospace, monospace";
            ctx.fillStyle = resolvedAccentRef.current;
            ctx.textBaseline = "bottom";
            ctx.fillText(g.char, fx, fy - 4);
          }

          // Specks
          if (specks > 0) {
            const pulse = (now / 1000) * speed;
            const perimeter = 2 * (fw + fh);

            for (let k = 0; k < specks; k++) {
              const n1 = noise(closestIdx * 100 + k, 1);
              const n2 = noise(closestIdx * 100 + k, 2);
              const n3 = noise(closestIdx * 100 + k, 3);

              const pos = (n1 + pulse * 0.02 * (0.5 + n2)) * perimeter;
              const { px, py, nx, ny } = perimeterPoint(pos, fx, fy, fw, fh);
              const out = 6 + n3 * 14;
              const sx = px + nx * out;
              const sy = py + ny * out;
              const size = [2, 2, 3, 3, 4][Math.floor(n2 * 5)];

              // Blink
              const phase = (pulse * 0.5 + n1 * 10) % 3;
              const alpha = phase < 0.2 ? 0.15 : 0.4;

              ctx.globalAlpha = alpha * Math.min(1, g.outline * 3);
              ctx.fillStyle = resolvedAccentRef.current;
              ctx.fillRect(Math.round(sx) - size / 2, Math.round(sy) - size / 2, size, size);
            }

            // Runner dots
            for (let j = 0; j < 2; j++) {
              const head = (pulse * 0.42 * speed + j * 0.5) * perimeter;
              for (let trail = 0; trail < 4; trail++) {
                const { px, py } = perimeterPoint(head - trail * 6, fx, fy, fw, fh);
                ctx.globalAlpha = (0.6 - trail * 0.15) * Math.min(1, g.outline * 3);
                ctx.fillStyle = resolvedAccentRef.current;
                ctx.fillRect(Math.round(px) - 1.5, Math.round(py) - 1.5, 3, 3);
              }
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      ctx.restore();

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [fontSize, bounce, sweep, speed, reach, softness, intro, introDuration, guides, labels, selection, specks, noise, perimeterPoint]);

  return (
    <canvas
      ref={canvasRef}
      className="tech-text-canvas"
      data-cursor="disable"
    />
  );
};

export default TechText;
