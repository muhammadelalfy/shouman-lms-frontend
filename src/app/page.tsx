import { getPublishedNeeds } from "@/features/home/content/api";
import type { NeedsSection } from "@/features/home/content/schema";
import type { Metadata } from "next";
import BuildExactlyHome from "@/features/home/components/build-exactly-home";
import { getSessionToken } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "مركز د. حازم شومان | علم ينتقل بك",
  description:
    "مسارات علمية وإيمانية متكاملة لتزكية النفس وبناء الشخصية المسلمة، مع محتوى موثوق وإشراف مباشر من د. حازم شومان.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "مركز د. حازم شومان | علم ينتقل بك",
    description:
      "مسارات علمية وإيمانية متكاملة لتزكية النفس وبناء الشخصية المسلمة، مع محتوى موثوق وإشراف مباشر.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default async function HomePage() {
  let needsSection: NeedsSection | null = null;
  let needsError = false;
  try { needsSection = await getPublishedNeeds(); } catch { needsError = true; }
  return <BuildExactlyHome needsSection={needsSection} needsError={needsError} hasSession={Boolean(await getSessionToken())} />;
}
