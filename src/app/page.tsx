import type { Metadata } from "next";
import BuildExactlyHome from "@/features/home/components/build-exactly-home";
import { getSessionToken } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "أكاديمية د. حازم شومان | علم ينتقل بك",
  description:
    "مسارات علمية وإيمانية متكاملة لتزكية النفس وبناء الشخصية المسلمة، مع محتوى موثوق وإشراف مباشر من د. حازم شومان.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "أكاديمية د. حازم شومان | علم ينتقل بك",
    description:
      "مسارات علمية وإيمانية متكاملة لتزكية النفس وبناء الشخصية المسلمة، مع محتوى موثوق وإشراف مباشر.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default async function HomePage() {
  return <BuildExactlyHome hasSession={Boolean(await getSessionToken())} />;
}
