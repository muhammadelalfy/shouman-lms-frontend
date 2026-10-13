import type { Metadata } from "next";
import { HomePreview } from "@/features/home/components/home-page";
import { HomepageLabMetrics } from "@/features/home/components/lab-metrics";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function HomePage() {
  return <><HomePreview /><HomepageLabMetrics /></>;
}

