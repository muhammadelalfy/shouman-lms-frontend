// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MarketingDiscovery } from "./discovery";
afterEach(cleanup);
describe("audience-specific discovery", () => {
  it("gives students personal journeys without staff authoring tools", () => {
    render(<MarketingDiscovery audience="student" />);
    const links = screen.getAllByRole("link").map(link => link.getAttribute("href"));
    expect(links).toContain("/preview/marketing/family");
    expect(links).toContain("/preview/marketing/certificate");
    expect(links).not.toContain("/preview/marketing/notifications");
    expect(links).not.toContain("/preview/marketing/track-editor");
  });
  it("gives teachers notification composition and meetings retaining teacher context", () => {
    render(<MarketingDiscovery audience="teacher" />);
    expect(screen.getAllByRole("link").map(link => link.getAttribute("href"))).toEqual([
      "/preview/marketing/notifications", "/preview/marketing/meeting?audience=teacher",
    ]);
  });
  it("places only public discovery on the landing page", () => {
    render(<MarketingDiscovery audience="landing" />);
    expect(screen.getAllByRole("link").map(link => link.getAttribute("href"))).toEqual([
      "/preview/marketing/orientation", "/preview/marketing/tracks", "/preview/marketing/challenges", "/preview/marketing/scholarships",
    ]);
  });
  it("keeps the track editor in administration", () => {
    render(<MarketingDiscovery audience="admin" />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link").getAttribute("href")).toBe("/preview/marketing/track-editor");
  });
});
