"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { BookOpen } from "lucide-react";

const vertexSource = `attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;
const fragmentSource = `precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - iResolution) / min(iResolution.x, iResolution.y);
  vec2 mouse = iMouse * 2.0 - 1.0;
  float time = iTime * 0.22;
  for (float i = 1.0; i < 8.0; i++) {
    uv.x += 0.5 / i * cos(i * 2.0 * uv.y + time + mouse.x);
    uv.y += 0.5 / i * cos(i * 2.0 * uv.x + time + mouse.y);
  }
  float glow = 1.0 - smoothstep(0.15, 0.95, abs(sin(uv.x + uv.y + time)));
  vec3 navy = vec3(11.0, 29.0, 58.0) / 255.0;
  vec3 blue = vec3(70.0, 120.0, 210.0) / 255.0;
  gl_FragColor = vec4(mix(navy, blue, glow * 0.48), 1.0);
}`;

/** Decorative only: static CSS fallback, bounded animation, and owned GPU resources. */
export function SmokeyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    let frame = 0;
    let stopped = false;
    const dispose = () => {
      cancelAnimationFrame(frame);
      shaders.forEach((shader) => gl.deleteShader(shader));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
    if (!program || !buffer) { dispose(); return; }
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]] as const) {
      const shader = gl.createShader(type);
      if (!shader) { dispose(); return; }
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { dispose(); return; }
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { dispose(); return; }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "iResolution");
    const time = gl.getUniformLocation(program, "iTime");
    const mouse = gl.getUniformLocation(program, "iMouse");
    let pointer = [0.5, 0.5];
    let started = performance.now();
    const draw = () => {
      if (stopped) return;
      // Cap resolution for mobile GPUs; never resize the backing buffer every frame.
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolution, width, height);
      gl.uniform1f(time, motion.matches ? 0 : (performance.now() - started) / 1000);
      gl.uniform2f(mouse, pointer[0], pointer[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      // A short ambient entrance avoids perpetual distracting motion behind a form.
      if (!motion.matches && !document.hidden && performance.now() - started < 4500) frame = requestAnimationFrame(draw);
    };
    const replay = () => { cancelAnimationFrame(frame); started = performance.now(); draw(); };
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer = [(event.clientX - rect.left) / Math.max(1, rect.width), 1 - (event.clientY - rect.top) / Math.max(1, rect.height)];
    };
    const lost = (event: Event) => { event.preventDefault(); stopped = true; cancelAnimationFrame(frame); };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", replay);
    document.addEventListener("visibilitychange", replay);
    motion.addEventListener("change", replay);
    canvas.addEventListener("webglcontextlost", lost);
    draw();
    return () => {
      stopped = true;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", replay);
      document.removeEventListener("visibilitychange", replay);
      motion.removeEventListener("change", replay);
      canvas.removeEventListener("webglcontextlost", lost);
      dispose();
    };
  }, []);
  return <div className="auth-smoke" aria-hidden="true"><canvas ref={canvasRef} /><div className="auth-smoke__veil" /></div>;
}

export function LoginForm({ children }: { children: ReactNode }) {
  return <div className="auth-page__frame">
    <div className="auth-page__brand"><span className="auth-page__brand-icon"><BookOpen size={22} aria-hidden="true" /></span><span>مركز د. حازم شومان</span></div>
    <div className="auth-card">{children}</div>
    <p className="auth-page__signature">رحلة علم، وتربية، وأثر.</p>
  </div>;
}
