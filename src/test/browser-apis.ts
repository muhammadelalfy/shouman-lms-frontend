// jsdom omits layout/media observers. Browser verification exercises their real behavior.
if (typeof window !== "undefined") {
  window.matchMedia ??= (query: string): MediaQueryList => ({
    matches: false, media: query, onchange: null,
    addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
  });
  globalThis.ResizeObserver ??= class {
    observe() {} unobserve() {} disconnect() {}
  };
  globalThis.IntersectionObserver ??= class {
    root = null; rootMargin = "0px"; thresholds = [0];
    observe() {} unobserve() {} disconnect() {} takeRecords() { return []; }
  };
}
