import type { Metadata } from "next";
import { getPageDefinition } from "@/features/pages/page-content";
import { PlatformPage } from "@/features/pages/page-shell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PlatformRoute({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <PlatformPage page={getPageDefinition(slug)} />;
}


