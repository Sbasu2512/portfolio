import { useMemo } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";
import styles from "./Scene.module.scss";

interface Star { x: number; y: number; z: number; }

/** Stars drifting past the camera — used behind the boot loader. */
export default function StarfieldScene({ speed = 34, className }: { speed?: number; className?: string }) {
  const stars = useMemo<Star[]>(
    () => Array.from({ length: 420 }, () => ({ x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z: Math.random() })),
    []
  );

  const ref = useCanvasLoop((ctx, w, h, _t, dt) => {
    ctx.fillStyle = "#05070c";
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;

    const g = ctx.createRadialGradient(cx, cy * 0.7, 0, cx, cy, Math.max(w, h) * 0.75);
    g.addColorStop(0, "rgba(60,50,90,0.28)");
    g.addColorStop(1, "rgba(5,7,12,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    for (const s of stars) {
      s.z -= dt * (speed / 1000);
      if (s.z <= 0.01) s.z = 1;
      const k = 0.6 / s.z;
      const x = cx + s.x * cx * k;
      const y = cy + s.y * cy * k;
      if (x < 0 || x > w || y < 0 || y > h) continue;
      const r = Math.max(0.3, (1 - s.z) * 1.6);
      const a = Math.min(1, (1 - s.z) * 1.3);
      ctx.beginPath();
      ctx.fillStyle = `rgba(244,239,230,${a})`;
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      if (s.z < 0.5) {
        ctx.strokeStyle = `rgba(244,239,230,${a * 0.35})`;
        ctx.lineWidth = r * 0.6;
        const px = cx + s.x * cx * (0.6 / Math.min(1, s.z + dt * (speed / 200)));
        const py = cy + s.y * cy * (0.6 / Math.min(1, s.z + dt * (speed / 200)));
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  });

  return <canvas ref={ref} className={[styles.canvas, className].filter(Boolean).join(" ")} aria-hidden="true" />;
}
