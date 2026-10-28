"use client";
import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "./use-reduced-motion";

/** Gold reading-progress bar pinned to the start edge of the viewport top. Decorative; hidden under reduced motion. */
export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  if (reduced) return null;
  return <motion.div aria-hidden="true" data-component="scroll-progress" className="academy-scroll-progress" style={{ scaleX }} />;
}
