"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";

export function PageAnimations() {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(".platform-page");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
      timeline
        .from(".platform-header", { y: -18, autoAlpha: 0, duration: 0.45 })
        .from(".platform-hero-copy > *", { y: 18, autoAlpha: 0, duration: 0.42, stagger: 0.07 }, "-=0.18")
        .from(".platform-hero-symbol", { scale: 0.78, rotate: -10, autoAlpha: 0, duration: 0.55 }, "-=0.35")
        .from(".platform-card", { y: 22, autoAlpha: 0, duration: 0.42, stagger: 0.08 }, "-=0.24")
        .from(".platform-empty, .platform-links, .platform-footer", { y: 14, autoAlpha: 0, duration: 0.35, stagger: 0.06 }, "-=0.2");
    }, root);

    const removeHoverListeners = gsap.utils
      .toArray<HTMLElement>(root.querySelectorAll(".platform-card, .platform-login, .platform-links a"))
      .map((element) => {
        const enter = () => gsap.to(element, { y: -4, duration: 0.2, overwrite: "auto" });
        const leave = () => gsap.to(element, { y: 0, duration: 0.24, overwrite: "auto" });
        element.addEventListener("mouseenter", enter);
        element.addEventListener("mouseleave", leave);
        return () => {
          element.removeEventListener("mouseenter", enter);
          element.removeEventListener("mouseleave", leave);
          gsap.killTweensOf(element);
        };
      });

    return () => {
      removeHoverListeners.forEach((remove) => remove());
      context.revert();
    };
  }, []);

  return null;
}
