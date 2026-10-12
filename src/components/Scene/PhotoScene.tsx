import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useRenderMode } from "@/hooks/useRenderMode";
import { VERT, PLAIN_EFFECT, buildFragment } from "./photoShaders";
import type { AudioLevels } from "@/context/AudioContext";
import styles from "./Scene.module.scss";

export interface PhotoSceneProps {
  /** Photo to show — served from /public. */
  src: string;
  /** GLSL chunk defining `warp` and `grade` (see photoShaders.ts). */
  effect: string;
  /** Flip the photo horizontally, the way it is placed in Figma. */
  mirrorX?: boolean;
  /** CSS `object-position` as 0..1 — [0.5, 0.5] is centred. */
  focus?: [number, number];
  /** Shown while the photo loads, so the page never flashes black. */
  placeholder?: string;
  /** Reads the live soundscape levels each frame (see AudioContext.getLevels) — only the About light uses them. */
  audioLevels?: () => AudioLevels;
  className?: string;
}

// A sliver of overscan so the pointer parallax can never reveal an edge.
const OVERSCAN = 1.02;

/**
 * Three.js full-screen shader that draws a photograph with "object-fit: cover"
 * maths and a few restrained effects on top. Same pattern as BlackHoleScene:
 * an orthographic quad + ShaderMaterial, guarded so a WebGL failure degrades
 * the whole site to the gradient themes instead of blanking the page.
 */
export default function PhotoScene({ src, effect, mirrorX = false, focus = [0.5, 0.5], placeholder, audioLevels, className }: PhotoSceneProps) {
  // Read through a ref so a new callback each render never restarts the WebGL scene.
  const audioRef = useRef(audioLevels);
  audioRef.current = audioLevels;
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const { fallBackToGradient } = useRenderMode();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false });
    } catch (err) {
      fallBackToGradient(`PhotoScene: WebGL unavailable (${String(err)})`);
      return;
    }

    let disposed = false;
    let raf = 0;
    let ro: ResizeObserver | undefined;
    let texture: THREE.Texture | undefined;
    let material: THREE.ShaderMaterial | undefined;
    let lostTimer = 0;
    const cleanups: Array<() => void> = [];

    try {
      renderer.setClearColor(0x05070c, 1);
      mount.appendChild(renderer.domElement);
      renderer.domElement.className = styles.photoCanvas;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const uniforms = {
        uTex: { value: null as THREE.Texture | null },
        uRes: { value: new THREE.Vector2(1, 1) },
        uImg: { value: new THREE.Vector2(1, 1) },
        uFocus: { value: new THREE.Vector2(focus[0], focus[1]) },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uTime: { value: 0 },
        uMirror: { value: mirrorX ? 1 : 0 },
        uZoom: { value: OVERSCAN },
        uAspect: { value: 1 },
        uLow: { value: 0 },
        uHigh: { value: 0 },
      };
      material = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: buildFragment(effect) });
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let loaded = false;

      // If an effect shader won't compile on this GPU, show the plain photograph rather than nothing.
      let effectFailed = false;
      let plain = false;
      renderer.debug.onShaderError = (gl, _program, _vs, fs) => {
        console.error("PhotoScene: effect shader failed to compile.", gl.getShaderInfoLog(fs));
        effectFailed = true;
      };

      const draw = () => {
        try {
          renderer.render(scene, camera);
          if (effectFailed) {
            effectFailed = false;
            if (plain) { fallBackToGradient("PhotoScene: shader failed to compile"); return; }
            plain = true;
            material!.fragmentShader = buildFragment(PLAIN_EFFECT);
            material!.needsUpdate = true;
            renderer.render(scene, camera);
          }
        } catch (err) {
          cancelAnimationFrame(raf);
          fallBackToGradient(`PhotoScene: render failed (${String(err)})`);
        }
      };

      function resize() {
        const w = Math.max(1, mount!.clientWidth), h = Math.max(1, mount!.clientHeight);
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, h, false);
        uniforms.uRes.value.set(w * dpr, h * dpr);
        if (reduce && loaded) draw(); // no animation loop in reduced-motion mode
      }
      resize();
      ro = new ResizeObserver(resize);
      ro.observe(mount);

      // Pointer parallax, eased.
      const target = new THREE.Vector2(0, 0);
      if (!reduce) {
        const onMove = (e: PointerEvent) => target.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
        window.addEventListener("pointermove", onMove, { passive: true });
        cleanups.push(() => window.removeEventListener("pointermove", onMove));
      }

      // If the GPU context is lost and doesn't come back, give up gracefully.
      const onLost = (e: Event) => {
        e.preventDefault();
        cancelAnimationFrame(raf);
        lostTimer = window.setTimeout(() => fallBackToGradient("PhotoScene: WebGL context lost"), 1500);
      };
      const onRestored = () => {
        window.clearTimeout(lostTimer);
        if (!reduce) loop();
        else draw();
      };
      renderer.domElement.addEventListener("webglcontextlost", onLost);
      renderer.domElement.addEventListener("webglcontextrestored", onRestored);
      cleanups.push(() => {
        renderer.domElement.removeEventListener("webglcontextlost", onLost);
        renderer.domElement.removeEventListener("webglcontextrestored", onRestored);
      });

      // Wall-clock time, not an accumulated per-frame delta: on a slow (e.g. software-rendered)
      // GPU a capped delta-per-frame makes simulated time crawl well behind real time, since each
      // frame can only ever advance the cap even though far more real time has actually passed.
      // Animations are cosmetic here, so a big jump after a stalled tab is harmless and preferable
      // to a clock that never catches up.
      const start = performance.now();
      function loop() {
        raf = requestAnimationFrame(loop);
        uniforms.uTime.value = (performance.now() - start) / 1000;
        uniforms.uMouse.value.lerp(target, 0.04);
        if (audioRef.current) {
          const a = audioRef.current();
          // wind eases in and out; a bird call snaps on and decays
          uniforms.uLow.value += (a.low - uniforms.uLow.value) * 0.06;
          uniforms.uHigh.value = Math.max(a.high, uniforms.uHigh.value * 0.93);
        }
        draw();
      }

      new THREE.TextureLoader().load(
        src,
        (tex) => {
          if (disposed) { tex.dispose(); return; }
          texture = tex;
          // Raw sRGB in, raw sRGB out — the shader never re-encodes, so the pixels match the photo.
          tex.colorSpace = THREE.NoColorSpace;
          tex.flipY = false;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
          tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
          tex.generateMipmaps = true;
          tex.needsUpdate = true;
          const img = tex.image as HTMLImageElement;
          uniforms.uImg.value.set(img.naturalWidth || img.width, img.naturalHeight || img.height);
          uniforms.uAspect.value = uniforms.uImg.value.x / uniforms.uImg.value.y;
          uniforms.uTex.value = tex;
          loaded = true;
          if (reduce) draw(); else loop();
          setReady(true);
        },
        undefined,
        (err) => fallBackToGradient(`PhotoScene: could not load ${src} (${String(err)})`)
      );
    } catch (err) {
      fallBackToGradient(`PhotoScene: setup failed (${String(err)})`);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(lostTimer);
      ro?.disconnect();
      cleanups.forEach((fn) => fn());
      try {
        material?.dispose();
        texture?.dispose();
        renderer.dispose();
        if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      } catch {
        // already torn down
      }
    };
    // The photo and its effect are fixed for the lifetime of a page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, effect, mirrorX]);

  return (
    <div
      ref={mountRef}
      className={[styles.canvas, styles.photo, className].filter(Boolean).join(" ")}
      style={placeholder ? { background: placeholder } : undefined}
      data-ready={ready}
      aria-hidden="true"
    />
  );
}
