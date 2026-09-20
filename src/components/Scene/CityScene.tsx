import { useMemo, useRef } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";
import styles from "./Scene.module.scss";

interface Car { lane: number; pos: number; speed: number; color: string; dir: 1 | -1; }
interface Bldg { x: number; w: number; h: number; lit: number[]; }

const CAR_COLORS = ["#ffb04a", "#6fd8c7", "#f3efe6", "#ff6b6b", "#7aa2ff"];

/** Night city street: skyline with twinkling windows and cars streaming both ways. */
export default function CityScene({ className }: { className?: string }) {
  const cars = useMemo<Car[]>(
    () => Array.from({ length: 16 }, (_, i) => ({
      lane: i % 4,
      pos: Math.random(),
      speed: 0.06 + Math.random() * 0.09,
      color: CAR_COLORS[i % CAR_COLORS.length],
      dir: i % 2 === 0 ? 1 : -1,
    })),
    []
  );
  const buildings = useMemo<Bldg[]>(() => {
    let x = 0;
    const list: Bldg[] = [];
    while (x < 2200) {
      const w = 40 + Math.random() * 70;
      const h = 80 + Math.random() * 220;
      list.push({ x, w, h, lit: Array.from({ length: 14 }, () => Math.random()) });
      x += w + 6;
    }
    return list;
  }, []);

  // Gradients are expensive to construct — these are in the car's own local
  // space (always -carW*3..0), so build one per color once and reuse it for
  // every car, every frame, instead of calling createLinearGradient per car.
  const glowCache = useRef<Map<string, CanvasGradient>>(new Map());
  function glowFor(ctx: CanvasRenderingContext2D, color: string, carW: number) {
    let g = glowCache.current.get(color);
    if (!g) {
      g = ctx.createLinearGradient(-carW * 3, 0, 0, 0);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(1, `${color}55`);
      glowCache.current.set(color, g);
    }
    return g;
  }

  const skyCache = useRef<{ h: number; g: CanvasGradient } | null>(null);
  function skyFor(ctx: CanvasRenderingContext2D, h: number) {
    if (!skyCache.current || skyCache.current.h !== h) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#070a14");
      g.addColorStop(1, "#141225");
      skyCache.current = { h, g };
    }
    return skyCache.current.g;
  }

  const ref = useCanvasLoop((ctx, w, h, t, dt) => {
    ctx.fillStyle = skyFor(ctx, h);
    ctx.fillRect(0, 0, w, h);

    const horizon = h * 0.62;
    ctx.save();
    ctx.translate(-(t * 12) % 500, 0);
    ctx.fillStyle = "#0c0e1c";
    for (const b of buildings) {
      const bx = b.x;
      const by = horizon - b.h * 0.55;
      ctx.fillRect(bx, by, b.w, b.h * 0.55);
      ctx.fillStyle = "rgba(255,190,110,0.85)";
      b.lit.forEach((v, i) => {
        if (v > 0.6) {
          const blink = 0.5 + 0.5 * Math.sin(t * 2 + i * 3 + b.x);
          ctx.globalAlpha = 0.35 + blink * 0.5;
          const wx = bx + 6 + (i % 4) * (b.w / 5);
          const wy = by + 8 + Math.floor(i / 4) * 14;
          ctx.fillRect(wx, wy, 4, 6);
        }
      });
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#0c0e1c";
    }
    ctx.restore();

    // road
    ctx.fillStyle = "#101018";
    ctx.fillRect(0, horizon, w, h - horizon);
    const laneH = (h - horizon) / 4;
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 2;
    ctx.setLineDash([26, 22]);
    for (let i = 1; i < 4; i++) {
      ctx.lineDashOffset = -(t * 140 * (i % 2 === 0 ? 1 : -1));
      ctx.beginPath();
      ctx.moveTo(0, horizon + laneH * i);
      ctx.lineTo(w, horizon + laneH * i);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    for (const c of cars) {
      c.pos += c.dir * c.speed * dt;
      if (c.pos > 1.15) c.pos = -0.15;
      if (c.pos < -0.15) c.pos = 1.15;
      const laneY = horizon + laneH * c.lane + laneH * 0.5;
      const x = c.pos * (w + 200) - 100;
      const carW = 46, carH = 20;
      ctx.save();
      ctx.translate(x, laneY);
      if (c.dir === -1) ctx.scale(-1, 1);
      // motion glow (cached gradient — see glowFor)
      ctx.fillStyle = glowFor(ctx, c.color, carW);
      ctx.fillRect(-carW * 3, -carH * 0.3, carW * 3, carH * 0.6);
      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.roundRect(-carW / 2, -carH / 2, carW, carH, 6);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillRect(carW / 2 - 4, -carH / 2 + 3, 3, carH - 6);
      ctx.fillStyle = "rgba(255,70,70,0.9)";
      ctx.fillRect(-carW / 2 + 1, -carH / 2 + 3, 3, carH - 6);
      ctx.restore();
    }
  });

  return <canvas ref={ref} className={[styles.canvas, className].filter(Boolean).join(" ")} aria-hidden="true" />;
}
