"use client";
import { useEffect } from "react";
import { useReducedMotion } from "@/components/ui/use-reduced-motion";

const OFFSET = 56;
const STAGGER_MS = 90;

/** Tags landing-page elements and plays a staggered slide/rise/zoom as each enters the viewport. Content stays visible without JS and under reduced motion. */
export function ScrollEffects({ rootId }: { rootId: string }) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (reduced || !root || typeof IntersectionObserver === "undefined") return;
    const tagged: HTMLElement[] = [];
    const tag = (element: Element | null | undefined, kind: "up" | "zoom" | "start" | "end", index: number) => {
      if (!(element instanceof HTMLElement) || element.hasAttribute("data-reveal") || element.closest(".academy-slider, [data-component='carousel']")) return;
      const rtl = getComputedStyle(element).direction === "rtl";
      const side = (kind === "start") === rtl ? 1 : -1;
      element.dataset.reveal = kind;
      element.style.setProperty("--reveal-x", kind === "start" || kind === "end" ? `${side * OFFSET}px` : "0px");
      element.style.setProperty("--reveal-y", kind === "up" ? `${OFFSET * 0.6}px` : "0px");
      element.style.setProperty("--reveal-s", kind === "zoom" ? ".9" : "1");
      element.style.setProperty("--reveal-delay", `${Math.min(index, 6) * STAGGER_MS}ms`);
      tagged.push(element);
    };
    root.querySelectorAll("main > div > section, main > section").forEach(section => {
      if (section.id === "home") return;
      section.querySelectorAll(":scope h2").forEach(heading => { tag(heading, "up", 0); tag(heading.nextElementSibling, "up", 1); });
      section.querySelectorAll(".grid").forEach(grid => {
        const children = Array.from(grid.children);
        if (children.length === 2) { tag(children[0], "start", 0); tag(children[1], "end", 1); return; }
        children.forEach((child, index) => tag(child, index % 4 === 3 ? "zoom" : "up", index));
      });
    });
    root.querySelectorAll("footer .grid > *").forEach((column, index) => tag(column, "up", index));
    root.classList.add("reveal-ready");
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      (entry.target as HTMLElement).dataset.revealed = "true";
      observer.unobserve(entry.target);
    }), { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    tagged.forEach(element => observer.observe(element));
    return () => {
      observer.disconnect();
      root.classList.remove("reveal-ready");
      tagged.forEach(element => { ["reveal", "revealed"].forEach(key => delete element.dataset[key]); ["--reveal-x", "--reveal-y", "--reveal-s", "--reveal-delay"].forEach(name => element.style.removeProperty(name)); });
    };
  }, [reduced, rootId]);
  return null;
}
