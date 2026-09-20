import { useMemo } from "react";
import { useCanvasLoop } from "@/hooks/useCanvasLoop";
import styles from "./Scene.module.scss";

interface Tree { x: number; scale: number; layer: number; sway: number; }

/** Layered silhouette forest with drifting fog and a slowly hue-shifting light. */
export default function ForestScene({ className }: { className?: string }) {
  const trees = useMemo<Tree[]>(
    () => Array.from({ length: 46 }, (_, i) => ({
      x: Math.random(),
      scale: 0.5 + Math.random() * 0.9,
      layer: i % 3,
      sway: Math.random() * Math.PI * 2,
    })),
    []
  );

  const ref = useCanvasLoop((ctx, w, h, t) => {
    const hue = 150 + Math.sin(t * 0.06) * 30;
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, `hsl(${hue + 20},32%,${10 + 4 * Math.sin(t * 0.05)}%)`);
    sky.addColorStop(0.55, `hsl(${hue},28%,9%)`);
    sky.addColorStop(1, "hsl(160,20%,4%)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const lx = w * (0.28 + 0.05 * Math.sin(t * 0.04));
    const ly = h * 0.22;
    const beam = ctx.createRadialGradient(lx, ly, 0, lx, ly, w * 0.55);
    beam.addColorStop(0, `hsla(${hue + 40},90%,75%,0.22)`);
    beam.addColorStop(1, "hsla(0,0%,0%,0)");
    ctx.fillStyle = beam;
    ctx.fillRect(0, 0, w, h);

    for (const layer of [0, 1, 2]) {
      const depth = 1 - layer * 0.28;
      const baseY = h * (0.52 + layer * 0.16);
      const lightness = 4 + layer * 3;
      ctx.fillStyle = `hsl(${hue},22%,${lightness}%)`;
      for (const tr of trees.filter((tr) => tr.layer === layer)) {
        const sway = Math.sin(t * 0.7 + tr.sway) * (3 + layer * 2);
        const treeH = 140 * tr.scale * depth;
        const treeW = 46 * tr.scale * depth;
        const x = tr.x * w + sway;
        drawTree(ctx, x, baseY + h * 0.1, treeW, treeH);
      }
    }

    // drifting fog bands
    for (let i = 0; i < 3; i++) {
      const fy = h * (0.62 + i * 0.1) + Math.sin(t * 0.2 + i) * 6;
      const fx = ((t * (14 + i * 8)) % (w + 400)) - 400;
      const fog = ctx.createLinearGradient(fx, 0, fx + 500, 0);
      fog.addColorStop(0, "rgba(230,240,235,0)");
      fog.addColorStop(0.5, `rgba(230,240,235,${0.05 + i * 0.015})`);
      fog.addColorStop(1, "rgba(230,240,235,0)");
      ctx.fillStyle = fog;
      ctx.fillRect(0, fy, w, 46);
    }
  });

  return <canvas ref={ref} className={[styles.canvas, className].filter(Boolean).join(" ")} aria-hidden="true" />;
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, groundY: number, w: number, h: number) {
  ctx.fillRect(x - w * 0.05, groundY - h * 0.22, w * 0.1, h * 0.22);
  const tiers = 4;
  for (let i = 0; i < tiers; i++) {
    const ty = groundY - h * 0.18 - (i * h * 0.24);
    const tw = w * (1 - i * 0.18);
    ctx.beginPath();
    ctx.moveTo(x, ty - h * 0.3);
    ctx.lineTo(x - tw / 2, ty);
    ctx.lineTo(x + tw / 2, ty);
    ctx.closePath();
    ctx.fill();
  }
}
