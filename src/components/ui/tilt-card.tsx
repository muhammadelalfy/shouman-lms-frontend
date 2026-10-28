"use client";
import { useRef, type ComponentPropsWithoutRef } from "react";
import { useReducedMotion } from "./use-reduced-motion";

/** Article that leans toward the pointer. Mouse/pen only; keyboard and touch are unaffected. */
export function TiltCard({ className, children, max = 6, ...rest }: ComponentPropsWithoutRef<"article"> & { max?: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const move = (event: React.PointerEvent<HTMLElement>) => {
    const element = ref.current;
    if (reduced || !element || event.pointerType === "touch") return;
    const box = element.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    element.style.transform = `perspective(900px) rotateY(${x * max}deg) rotateX(${-y * max}deg) translateY(-6px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };
  return <article ref={ref} data-component="tilt-card" className={className} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset} {...rest}>{children}</article>;
}
