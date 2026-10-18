"use client";

import { useCallback, useEffect } from "react";
import { useReportWebVitals } from "next/web-vitals";

type ReportMetric = Parameters<typeof useReportWebVitals>[0];

function isLocalLab() {
  return ["127.0.0.1", "localhost", "[::1]"].includes(window.location.hostname)
    && new URLSearchParams(window.location.search).get("lab") === "1";
}

/** Local, opt-in browser evidence only: no UI, storage, network or production telemetry. */
export function HomepageLabMetrics() {
  const report = useCallback<ReportMetric>((metric) => {
    if (!isLocalLab()) return;
    console.info("HOMEPAGE_LAB_METRIC", JSON.stringify({
      name: metric.name,
      value: metric.value,
      navigationType: metric.navigationType,
    }));
  }, []);
  useReportWebVitals(report);

  useEffect(() => {
    if (!isLocalLab()) return;
    const shifts: { startTime: number; value: number }[] = [];
    const longTasks: number[] = [];
    const observers: PerformanceObserver[] = [];
    for (const type of ["layout-shift", "longtask"]) {
      if (!PerformanceObserver.supportedEntryTypes.includes(type)) continue;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.startTime > 5000) continue;
          if (type === "longtask") longTasks.push(entry.duration);
          else {
            const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean };
            if (!shift.hadRecentInput) shifts.push({ startTime: shift.startTime, value: shift.value });
          }
        }
      });
      observer.observe({ type, buffered: true });
      observers.push(observer);
    }
    const timer = window.setTimeout(() => {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
      let maximumShift = 0, sessionScore = 0, sessionStart = -Infinity, previousShift = -Infinity;
      for (const shift of shifts) {
        if (shift.startTime - previousShift >= 1000 || shift.startTime - sessionStart >= 5000) {
          sessionStart = shift.startTime;
          sessionScore = 0;
        }
        sessionScore += shift.value;
        maximumShift = Math.max(maximumShift, sessionScore);
        previousShift = shift.startTime;
      }
      console.info("HOMEPAGE_LAB_PROFILE", JSON.stringify({
        observationWindowMs: 5000,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        userAgent: navigator.userAgent,
        navigationType: navigation?.type,
        transferredBytes: (navigation?.transferSize ?? 0) + resources.reduce((total, item) => total + item.transferSize, 0),
        resources: resources.length,
        imageErrors: Array.from(document.images).filter((image) => image.complete && image.naturalWidth === 0).length,
        initialLoadCLS: PerformanceObserver.supportedEntryTypes.includes("layout-shift") ? maximumShift : null,
        longTaskCount: PerformanceObserver.supportedEntryTypes.includes("longtask") ? longTasks.length : null,
        longestTaskMs: longTasks.length ? Math.max(...longTasks) : 0,
      }));
      observers.forEach((observer) => observer.disconnect());
    }, 5000);
    return () => { window.clearTimeout(timer); observers.forEach((observer) => observer.disconnect()); };
  }, []);

  return null;
}
