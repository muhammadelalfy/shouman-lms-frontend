"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "@/components/ui/use-reduced-motion";

/** Enhance existing dashboard cards without changing their layout or SSR visibility. */
export function ScrollRevealGroup({ children, className }: { children: ReactNode; className: string }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !root.current || typeof IntersectionObserver === "undefined") return;
    const container = root.current;
    const animations = new Map<Element, Animation>();
    const cancelFocused = (event: FocusEvent) => {
      animations.forEach((animation, card) => {
        if (event.target instanceof Node && card.contains(event.target)) animation.cancel();
      });
    };
    container.addEventListener("focusin", cancelFocused);
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting || entry.target.contains(document.activeElement)) return;
        animations.get(entry.target)?.cancel();
        if (typeof entry.target.animate !== "function") return;
        animations.set(entry.target, entry.target.animate([
          { opacity: 0.15, transform: "translateY(28px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 700, delay: Math.min(index * 60, 180), easing: "cubic-bezier(.22,1,.36,1)" }));
      });
    }, { threshold: 0.12 });
    container.querySelectorAll(".xp-card, .learner-welcome").forEach(element => observer.observe(element));
    return () => { observer.disconnect(); container.removeEventListener("focusin", cancelFocused); animations.forEach(animation => animation.cancel()); };
  }, [reduced]);
  return <div ref={root} className={className}>{children}</div>;
}
