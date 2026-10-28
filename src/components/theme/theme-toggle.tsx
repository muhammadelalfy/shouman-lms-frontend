"use client";
import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
const key = "shouman-theme";
const eventName = "shouman-theme-change";
function preference() { try { return localStorage.getItem(key); } catch { return null; } }
function systemDark() { return typeof window.matchMedia === "function" && window.matchMedia("(prefers-color-scheme: dark)").matches; }
function apply(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  window.dispatchEvent(new Event(eventName));
}
function restore() { const saved = preference(); apply(saved === "dark" || (saved !== "light" && systemDark())); }
function subscribe(notify: () => void) { window.addEventListener(eventName, notify); return () => window.removeEventListener(eventName, notify); }
function snapshot() { return document.documentElement.classList.contains("dark"); }
export function ThemeSync() {
  useEffect(() => {
    restore();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const systemChange = () => { if (!['light', 'dark'].includes(preference() ?? '')) restore(); };
    const storageChange = (event: StorageEvent) => { if (event.key === key || event.key === null) restore(); };
    media.addEventListener("change", systemChange);
    window.addEventListener("storage", storageChange);
    return () => { media.removeEventListener("change", systemChange); window.removeEventListener("storage", storageChange); };
  }, []);
  return null;
}
export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, snapshot, () => false);
  const label = dark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن";
  return <button className="theme-toggle" data-theme-toggle type="button" aria-label={label} title={label} aria-pressed={dark} onClick={() => {
    const next = !snapshot();
    try { localStorage.setItem(key, next ? "dark" : "light"); } catch { /* Appearance still changes when storage is blocked. */ }
    apply(next);
  }}>{dark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}</button>;
}
