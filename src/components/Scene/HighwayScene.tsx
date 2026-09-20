import { useMemo, useRef } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";
import styles from "./Scene.module.scss";

interface Car { lane: number; pos: number; speed: number; color: string; }
const COLORS = ["#ffb04a", "#6fd8c7", "#ff6b6b", "#7aa2ff", "#f3efe6", "#c98bff"];

/** Bright daytime highway with a steady stream of cars — no cyclists. */
export default function HighwayScene({ className }: { className?: string }) {
  const cars = useMemo<Car[]>(
    () => Array.from({ length: 12 }, (_, i) => ({ lane: i % 3, pos: Math.random(), speed: 0.1 + Math.random() * 0.12, color: COLORS[i % COLORS.length] })),
    []
  );

  const skyCache = useRef<{ h: number; g: CanvasGradient } | null>(null);
  function skyFor(ctx: CanvasRenderingContext2D, h: number) {
    if (!skyCache.current || skyCache.current.h !== h) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#1c2340");
      g.addColorStop(1, "#0a0c18");
      skyCache.current = { h, g };
    }
    return skyCache.current.g;
  }
  const glowCache = useRef<Map<string, CanvasGradient>>(new Map());
  function glowFor(ctx: CanvasRenderingContext2D, color: string, x: number, carW: number) {
    // Unlike CityScene, this glow is drawn in world space (no translate), so
    // its x shifts every frame — cache per-color at a fixed relative offset
    // and translate the canvas instead of rebuilding the gradient.
    let g = glowCache.current.get(color);
    if (!g) {
      g = ctx.createLinearGradient(-carW * 3, 0, 0, 0);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(1, `${color}66`);
      glowCache.current.set(color, g);
    }
    return g;
  }

  const ref = useCanvasLoop((ctx, w, h, t, dt) => {
    ctx.fillStyle = skyFor(ctx, h);
    ctx.fillRect(0, 0, w, h);

    const horizon = h * 0.4;
    ctx.fillStyle = "#12151f";
    ctx.fillRect(0, horizon, w, h - horizon);

    const laneH = (h - horizon) / 3;
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 2;
    ctx.setLineDash([30, 20]);
    for (let i = 1; i < 3; i++) {
      ctx.lineDashOffset = -(t * 160);
      ctx.beginPath();
      ctx.moveTo(0, horizon + laneH * i);
      ctx.lineTo(w, horizon + laneH * i);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    for (const c of cars) {
      c.pos += c.speed * dt;
      if (c.pos > 1.15) c.pos = -0.15;
      const laneY = horizon + laneH * c.lane + laneH * 0.5;
      const x = c.pos * (w + 220) - 110;
      const carW = 50, carH = 22;

      ctx.save();
      ctx.translate(x, laneY);
      ctx.fillStyle = glowFor(ctx, c.color, x, carW);
      ctx.fillRect(-carW * 3, -carH * 0.3, carW * 3, carH * 0.6);
      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.roundRect(-carW / 2, -carH / 2, carW, carH, 7);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.fillRect(carW / 2 - 5, -carH / 2 + 3, 3, carH - 6);
      ctx.fillStyle = "rgba(255,60,60,0.9)";
      ctx.fillRect(-carW / 2 + 2, -carH / 2 + 3, 3, carH - 6);
      ctx.restore();
    }

    // roadside light glow strip
    ctx.fillStyle = "rgba(255,176,74,0.06)";
    ctx.fillRect(0, horizon - 4, w, 8);
  });

  return <canvas ref={ref} className={[styles.canvas, className].filter(Boolean).join(" ")} aria-hidden="true" />;
}
