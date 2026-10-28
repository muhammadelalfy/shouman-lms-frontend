"use client";
import { useSyncExternalStore } from "react";
const query = "(prefers-reduced-motion: reduce)";
function subscribe(listener: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
function snapshot() { return window.matchMedia(query).matches; }
// Start with static SSR decoration; subscribe to live OS changes after hydration.
export function useReducedMotion() { return useSyncExternalStore(subscribe, snapshot, () => true); }
