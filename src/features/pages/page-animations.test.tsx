// @vitest-environment jsdom

import { cleanup, render } from "@testing-library/react";
import Link from "next/link";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PageAnimations } from "./page-animations";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("platform animations", () => {
  it("mounts and cleans up the GSAP context when motion is allowed", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));

    const view = render(
      <main className="platform-page">
        <PageAnimations />
        <header className="platform-header" />
        <section className="platform-hero-copy"><h1>المسارات</h1></section>
        <div className="platform-hero-symbol" />
        <article className="platform-card" />
        <nav className="platform-links"><Link href="/catalog">الفهرس</Link></nav>
        <footer className="platform-footer" />
      </main>,
    );

    expect(view.container.querySelector(".platform-page")).toBeTruthy();
    expect(() => view.unmount()).not.toThrow();
  });

  it("keeps content visible when reduced motion is requested", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true })));

    const view = render(
      <main className="platform-page">
        <PageAnimations />
        <h1>المسارات</h1>
      </main>,
    );

    expect(view.getByRole("heading", { name: "المسارات" }).getAttribute("style")).toBeNull();
  });
});

