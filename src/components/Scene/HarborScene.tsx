import { useMemo } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";
import styles from "./Scene.module.scss";

interface Ship { pos: number; speed: number; lane: number; scale: number; }

/** Sunset harbor: shimmering sun, moving water bands, and ships gliding past. */
export default function HarborScene({ className }: { className?: string }) {
  const ships = useMemo<Ship[]>(
    () => Array.from({ length: 4 }, (_, i) => ({ pos: Math.random(), speed: 0.02 + i * 0.008, lane: i, scale: 0.7 + Math.random() * 0.6 })),
    []
  );

  const ref = useCanvasLoop((ctx, w, h, t, dt) => {
    const horizon = h * 0.45;
    const sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, "#1a2338");
    sky.addColorStop(1, "#5a4a5a");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, horizon);

    // sun with heat-shimmer: thin offset arcs animated
    const sx = w * 0.5, sy = horizon * 0.62, base = Math.min(w, h) * 0.09;
    for (let i = 6; i >= 0; i--) {
      const wobble = Math.sin(t * 3 + i) * 1.6;
      const rad = base + i * 2 + wobble;
      const a = 0.06 + (6 - i) * 0.012;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,${170 - i * 6},90,${a})`;
      ctx.arc(sx, sy, rad, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.fillStyle = "#ffd9a0";
    ctx.arc(sx, sy, base, 0, Math.PI * 2);
    ctx.fill();

    // water
    const water = ctx.createLinearGradient(0, horizon, 0, h);
    water.addColorStop(0, "#3a3350");
    water.addColorStop(1, "#0c1220");
    ctx.fillStyle = water;
    ctx.fillRect(0, horizon, w, h - horizon);

    // sun reflection
    ctx.save();
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 18; i++) {
      const yy = horizon + i * 6;
      const wobble = Math.sin(t * 2 + i * 0.6) * 10;
      const width = 60 - i * 2.2;
      ctx.fillStyle = "rgba(255,200,140,0.35)";
      ctx.fillRect(sx - width / 2 + wobble, yy, width, 3);
    }
    ctx.restore();

    ctx.strokeStyle = "rgba(200,210,230,0.14)";
    for (let i = 0; i < 26; i++) {
      const yy = horizon + (i * (h - horizon)) / 26;
      const off = ((t * 22 + i * 40) % 120) - 60;
      ctx.beginPath();
      for (let x = -60; x < w + 60; x += 24) {
        const yy2 = yy + Math.sin((x + off) * 0.05 + t) * 2;
        x === -60 ? ctx.moveTo(x, yy2) : ctx.lineTo(x, yy2);
      }
      ctx.stroke();
    }

    for (const s of ships) {
      s.pos += s.speed * dt;
      if (s.pos > 1.2) s.pos = -0.2;
      const x = s.pos * (w + 260) - 130;
      const y = horizon + 24 + s.lane * 20 + Math.sin(t * 1.4 + s.lane) * 2.5;
      drawShip(ctx, x, y, 70 * s.scale, "rgba(10,12,20,0.85)");
    }
  });

  return <canvas ref={ref} className={[styles.canvas, className].filter(Boolean).join(" ")} aria-hidden="true" />;
}

function drawShip(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, color: string) {
  const h = w * 0.26;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y);
  ctx.lineTo(x + w / 2, y);
  ctx.lineTo(x + w / 2 - h * 0.6, y + h);
  ctx.lineTo(x - w / 2 + h * 0.3, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(x - w * 0.12, y - h * 1.6, w * 0.05, h * 1.6);
  ctx.fillRect(x - w * 0.05, y - h * 1.1, w * 0.22, h * 0.7);
}
