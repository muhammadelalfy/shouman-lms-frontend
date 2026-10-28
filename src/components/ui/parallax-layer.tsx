"use client";
import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "./use-reduced-motion";

/** Decorative background that drifts slower than the page while its section crosses the viewport. */
export function ParallaxLayer({ children, className, distance = 60 }: { children: ReactNode; className?: string; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);
  return <div ref={ref} aria-hidden="true" className={className}><motion.div data-component="parallax-layer" style={reduced ? undefined : { y, scale: 1.2 }} className="h-full w-full">{children}</motion.div></div>;
}
