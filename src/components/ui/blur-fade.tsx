"use client";
// Adapted from Magic UI Blur Fade, MIT. See THIRD-PARTY-NOTICES.md.
import { useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { motion, useInView, type Variants } from "motion/react";
import { useReducedMotion } from "./use-reduced-motion";
const subscribe = () => () => {};

export function BlurFade({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const inView = useInView(ref, { once: false, amount: 0.08, margin: "0px 0px -32px 0px" });
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const reduced = useReducedMotion();
  const visible = !hydrated || reduced || inView || focused;
  const variants: Variants = {
    hidden: { y: 36, opacity: 0.12, filter: "blur(6px)" },
    visible: { y: 0, opacity: 1, filter: "blur(0px)" },
  };
  return <motion.div ref={ref} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }} data-component="21st-blur-fade" data-in-view={visible} initial={false} animate={visible ? "visible" : "hidden"} variants={variants} transition={{ duration: reduced || focused ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }} className={className}>{children}</motion.div>;
}
