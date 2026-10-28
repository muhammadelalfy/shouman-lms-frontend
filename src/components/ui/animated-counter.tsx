"use client";
import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";
import { useReducedMotion } from "./use-reduced-motion";

const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";
const NUMBER = /[0-9٠-٩][0-9٠-٩,٬]*/;

/** Counts a displayed number up on viewport entry. The server-rendered text is already the final value. */
export function AnimatedCounter({ value, className, duration = 1.8 }: { value: string; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = ref.current;
    const match = NUMBER.exec(value);
    if (!element || !match || !inView || reduced) return;
    const arabic = /[٠-٩]/.test(match[0]);
    const grouped = /[,٬]/.test(match[0]);
    const target = Number(match[0].replace(/[,٬]/g, "").replace(/[٠-٩]/g, digit => String(ARABIC_INDIC.indexOf(digit))));
    const [prefix, suffix] = [value.slice(0, match.index), value.slice(match.index + match[0].length)];
    const format = (n: number) => {
      const text = grouped ? Math.round(n).toLocaleString("en-US") : String(Math.round(n));
      return prefix + (arabic ? text.replace(/[0-9]/g, digit => ARABIC_INDIC[Number(digit)]) : text) + suffix;
    };
    const controls = animate(0, target, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: n => { element.textContent = format(n); }, onComplete: () => { element.textContent = value; } });
    return () => { controls.stop(); element.textContent = value; };
  }, [value, inView, reduced, duration]);
  return <span ref={ref} className={className} data-component="animated-counter" aria-label={value} style={{ fontVariantNumeric: "tabular-nums" }}>{value}</span>;
}
