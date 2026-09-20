import { useMemo, useRef } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";
import styles from "./Scene.module.scss";

interface Drop { x: number; y: number; len: number; speed: number; }
interface Ripple { x: number; r: number; a: number; }

/** Rain falling onto a dark water surface, with expanding ripples where drops land. */
export default function RainScene({ className }: { className?: string }) {
  const drops = useMemo<Drop[]>(
    () => Array.from({ length: 160 }, () => ({ x: Math.random(), y: Math.random(), len: 10 + Math.random() * 18, speed: 500 + Math.random() * 400 })),
    []
  );
  const ripples = useRef<Ripple[]>([]);

  const ref = useCanvasLoop((ctx, w, h, t, dt) => {
    const flash = Math.max(0, Math.sin(t * 0.17) > 0.985 ? 0.5 : 0);
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, `rgba(${30 + flash * 150},${34 + flash * 150},${48 + flash * 150},1)`);
    sky.addColorStop(1, "#05070a");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const waterY = h * 0.72;
    ctx.fillStyle = "#0a0e14";
    ctx.fillRect(0, waterY, w, h - waterY);

    ctx.strokeStyle = "rgba(180,200,220,0.55)";
    ctx.lineWidth = 1.4;
    for (const d of drops) {
      const y = (d.y * h + t * d.speed) % (h + 40);
      const x = d.x * w - 40 + ((y / h) * 30);
      if (y < waterY) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 5, y + d.len);
        ctx.stroke();
      } else if (y < waterY + 6 && Math.random() < 0.6) {
        ripples.current.push({ x, r: 1, a: 0.5 });
      }
    }

    ripples.current.forEach((r) => {
      r.r += dt * 40;
      r.a -= dt * 0.6;
    });
    ripples.current = ripples.current.filter((r) => r.a > 0 && r.r < 60);
    ctx.strokeStyle = "rgba(150,190,210,1)";
    for (const r of ripples.current) {
      ctx.globalAlpha = Math.max(0, r.a);
      ctx.beginPath();
      ctx.ellipse(r.x, waterY + 2, r.r, r.r * 0.28, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // subtle water shimmer lines
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    for (let i = 0; i < 10; i++) {
      const yy = waterY + 10 + i * ((h - waterY - 10) / 10);
      ctx.beginPath();
      for (let x = 0; x < w; x += 30) {
        const yy2 = yy + Math.sin(x * 0.03 + t * 1.5 + i) * 2;
        x === 0 ? ctx.moveTo(x, yy2) : ctx.lineTo(x, yy2);
      }
      ctx.stroke();
    }

    if (flash > 0) {
      ctx.fillStyle = `rgba(220,225,255,${flash * 0.12})`;
      ctx.fillRect(0, 0, w, h);
    }
  });

  return <canvas ref={ref} className={[styles.canvas, className].filter(Boolean).join(" ")} aria-hidden="true" />;
}
