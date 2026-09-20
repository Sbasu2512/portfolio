import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import styles from "./Scene.module.scss";

const FRAG = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform sampler2D uForest;
const float DA = 1.7857;
const vec2 HOLE = vec2(0.575, 0.47);
const float R = 0.246;

float hash(vec2 p){ return fract(sin(p.x*127.1+p.y*311.7)*43758.5453123); }
float noise(vec2 p){
  vec2 i=floor(p), f=p-i;
  vec2 u=f*f*(3.0-2.0*f);
  float a=hash(i), b=hash(i+vec2(1.0,0.0));
  float c=hash(i+vec2(0.0,1.0)), d=hash(i+vec2(1.0,1.0));
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
const mat2 M = mat2(1.6,-1.2,1.2,1.6);
float fbm4(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<4;i++){ v+=a*noise(p); p=M*p; a*=0.5; } return v; }
float fbm5(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p=M*p; a*=0.5; } return v; }
float fbm6(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<6;i++){ v+=a*noise(p); p=M*p; a*=0.5; } return v; }
vec2 rot(vec2 p, float a){ float c=cos(a), s=sin(a); return vec2(c*p.x-s*p.y, s*p.x+c*p.y); }
vec2 anchored(vec2 w, vec2 a){ return w - vec2((a.x-0.5)*DA, (a.y-0.5)); }

vec3 ramp(float I){
  vec3 base=vec3(0.045,0.012,0.010), deep=vec3(0.52,0.065,0.018);
  vec3 orange=vec3(1.0,0.33,0.035), gold=vec3(1.0,0.72,0.26), white=vec3(1.0,0.96,0.85);
  vec3 c = mix(base, deep, smoothstep(0.0,0.30,I));
  c = mix(c, orange, smoothstep(0.30,0.72,I));
  c = mix(c, gold, smoothstep(0.68,1.05,I));
  c = mix(c, white, smoothstep(1.00,1.60,I));
  return c;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes; uv.y = 1.0 - uv.y;
  float ca = uRes.x / uRes.y;
  vec2 w = vec2((uv.x-0.5)*ca, uv.y-0.5);
  if (ca > DA) w *= DA/ca;

  vec2 p = anchored(w, HOLE);
  float rr = length(p); float r = rr / R; float th = atan(p.y, p.x);
  float t = uTime;

  float swirl = (1.35/(r*0.55+0.45)) + t*0.05;
  vec2 s = rot(p / R, swirl);
  float w1 = fbm4(s*1.6 + vec2(3.1+t*0.03, t*0.02));
  float d = fbm6(s*3.4 + w1*2.2); d = pow(clamp(d,0.0,1.0),1.5);
  float fil = fbm4(s*9.0 + w1*3.0); d = d*0.72 + fil*fil*0.55;
  float wisp = fbm4(vec2(s.x*2.2+w1*1.4, s.y*15.0+t*0.35));
  wisp = max(wisp-0.42,0.0)*2.6;
  d += wisp * exp(-abs(r-1.28)*1.7) * 0.85;

  float inner = smoothstep(0.98,1.10,r);
  float falloff = exp(-max(r-1.0,0.0)*1.05);
  float axis = cos(th-0.42); axis*=axis;
  float I = d*falloff*inner*(0.45+1.7*axis)*4.2;

  float cl = fbm5(p*2.0 + vec2(11.0, 5.0+t*0.012));
  I *= (0.30 + 1.45*smoothstep(0.32,0.74,cl));
  float cl2 = fbm4(p*0.85 + vec2(-4.0,9.0));
  I *= (0.45 + 1.10*smoothstep(0.30,0.66,cl2));

  vec3 col = ramp(I);

  float ted = fbm5(vec2(s.x*1.5+21.0, s.y*6.0+3.0));
  ted = max(ted-0.5,0.0)*2.2*exp(-abs(r-2.2)*0.85)*smoothstep(1.05,1.5,r);
  ted *= (0.25+1.5*smoothstep(0.3,0.7,cl));
  col += ted * vec3(0.85,0.13,0.05);

  vec2 dir = vec2(0.918,0.396);
  vec2 p2 = anchored(w, vec2(0.05,-0.06));
  float alo = dot(p2,dir), per = dot(p2, vec2(-dir.y,dir.x));
  float stri = fbm4(vec2(alo*1.5+t*0.05, per*110.0));
  float shaft = exp(-abs(per)*8.5) * (0.15+1.05*stri*stri) * exp(-max(alo-0.05,0.0)*1.35);
  vec2 p3 = anchored(w, vec2(0.55,0.62));
  float alo3 = dot(p3,dir), per3 = dot(p3, vec2(-dir.y,dir.x));
  float stri3 = fbm4(vec2(alo3*1.5-t*0.04, per3*130.0));
  float shaft3 = exp(-abs(per3)*9.0) * (0.2+0.8*stri3*stri3) * smoothstep(-0.2,0.3,alo3);
  float src = exp(-length(anchored(w, vec2(0.13,-0.02)))*5.0);
  col += (shaft*0.95 + shaft3*0.55 + src*1.7) * vec3(1.0,0.86,0.60);

  col += vec3(0.012,0.013,0.020) * (1.0-smoothstep(0.0,0.5,I));
  vec2 g = floor(uv*uRes.y*1.05);
  float st = hash(g);
  float twinkle = 0.65 + 0.35*sin(t*1.7 + hash(g+7.0)*30.0);
  col += clamp((st-0.9992)*900.0,0.0,1.0)*0.75*twinkle*(1.0-smoothstep(0.02,0.25,I))*vec3(0.9,0.85,0.8);

  float ar = abs(r-1.0);
  float ring = exp(-ar*60.0)*2.4 + exp(-ar*11.0)*0.7 + exp(-ar*3.0)*0.22;
  float rm = cos(th*2.0+1.1); ring *= 0.78+0.45*rm*rm;
  ring *= smoothstep(0.55,0.95,r);
  col += ring * vec3(1.0,0.68,0.22);

  // deep-space void inside the horizon, with the forest photo lensed near the rim
  float mask = smoothstep(1.005,0.975,r);
  if (mask > 0.001) {
    vec2 pn = p / R;
    float rn = length(pn);
    pn *= 1.0 - 0.16 * rn * rn;
    vec2 tuv = vec2(0.5 + pn.x * 0.42, 0.5 - pn.y * 0.42);
    vec3 forest = texture2D(uForest, tuv).rgb;
    forest *= 1.0 - 0.5 * smoothstep(0.5, 1.0, rn);
    forest += vec3(1.0, 0.55, 0.16) * smoothstep(0.76, 1.0, rn) * 0.42;
    col = mix(col, forest * 1.05, mask);
  }

  col *= 1.0 - 0.55*smoothstep(0.30,1.10,length(w));
  col = vec3(1.0) - exp(-col*1.35);
  col = pow(clamp(col,0.0,1.0), vec3(1.05));
  gl_FragColor = vec4(col, 1.0);
}
`;

const VERT = `void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }`;

/** Three.js full-screen shader: the swirling accretion disc behind the landing page. */
export default function BlackHoleScene({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // WebGL context creation can throw (blocked GPU, restricted iframe,
    // disabled hardware acceleration, some insecure-context sandboxes) —
    // never let that take the whole app down with it.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false });
    } catch (err) {
      console.error("BlackHoleScene: WebGL unavailable, falling back to CSS.", err);
      setFailed(true);
      return;
    }

    let ro: ResizeObserver | undefined;
    let raf = 0;
    let forestTex: THREE.Texture | undefined;
    let material: THREE.ShaderMaterial | undefined;

    try {
      renderer.setClearColor(0x05070c, 1);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      forestTex = new THREE.TextureLoader().load(
        "/forest.jpg",
        undefined,
        undefined,
        (err) => console.warn("BlackHoleScene: forest texture failed to load.", err)
      );
      forestTex.minFilter = THREE.LinearFilter;
      forestTex.magFilter = THREE.LinearFilter;
      forestTex.wrapS = forestTex.wrapT = THREE.ClampToEdgeWrapping;
      forestTex.generateMipmaps = false;
      const uniforms = { uRes: { value: new THREE.Vector2(1, 1) }, uTime: { value: 0 }, uForest: { value: forestTex } };
      material = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG });
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      function resize() {
        const w = mount!.clientWidth, h = mount!.clientHeight;
        renderer.setPixelRatio(dpr);
        renderer.setSize(w, h, false);
        uniforms.uRes.value.set(w * dpr, h * dpr);
      }
      resize();
      ro = new ResizeObserver(resize);
      ro.observe(mount);

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const clock = new THREE.Clock();
      let t = 0;
      function frame() {
        raf = requestAnimationFrame(frame);
        if (!reduce) t += Math.min(clock.getDelta(), 0.05);
        uniforms.uTime.value = t;
        try {
          renderer.render(scene, camera);
        } catch (err) {
          console.error("BlackHoleScene: render failed, stopping loop.", err);
          cancelAnimationFrame(raf);
          setFailed(true);
        }
      }
      frame();
    } catch (err) {
      console.error("BlackHoleScene: setup failed, falling back to CSS.", err);
      setFailed(true);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      try {
        renderer.dispose();
        material?.dispose();
        forestTex?.dispose();
        if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
      } catch {
        // already torn down
      }
    };
  }, []);

  if (failed) {
    // CSS-only stand-in so the landing page still has a background and a nav.
    return <div className={[styles.canvas, styles.fallback, className].filter(Boolean).join(" ")} aria-hidden="true" />;
  }

  return <div ref={mountRef} className={[styles.canvas, className].filter(Boolean).join(" ")} aria-hidden="true" />;
}
