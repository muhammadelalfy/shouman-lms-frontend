import type { OfferingKind } from "@/features/catalog/types";

export type CatalogListingRoute = {
  type: "listing";
  basePath: string;
  title: string;
  description: string;
  kinds: OfferingKind[];
};

export type CatalogDetailRoute = {
  type: "detail";
  basePath: string;
  expectedKinds: OfferingKind[];
};

export type CatalogRoute = CatalogListingRoute | CatalogDetailRoute;

const listingRoutes: Record<string, CatalogListingRoute> = {
  catalog: {
    type: "listing", basePath: "/catalog", title: "الفهرس التعليمي",
    description: "تصفح المسارات والبرامج والدورات المنشورة من الأكاديمية.", kinds: [],
  },
  tracks: {
    type: "listing", basePath: "/tracks", title: "المسارات التعليمية",
    description: "مسارات منظمة تساعدك على التدرج في طلب العلم.", kinds: ["track"],
  },
  initiatives: {
    type: "listing", basePath: "/initiatives", title: "المبادرات التعليمية",
    description: "مبادرات منشورة من الأكاديمية ومحتواها المتاح للزوار.", kinds: ["initiative"],
  },
  programs: {
    type: "listing", basePath: "/programs", title: "البرامج التعليمية",
    description: "برامج مكثفة منشورة من الأكاديمية.", kinds: ["intensive_program"],
  },
  "seasonal-programs": {
    type: "listing", basePath: "/seasonal-programs", title: "البرامج الموسمية",
    description: "برامج موسمية منشورة من الأكاديمية.", kinds: ["seasonal_program"],
  },
  courses: {
    type: "listing", basePath: "/courses", title: "الدورات التعليمية",
    description: "دورات منشورة مع معلومات السعر والمدة كما وردت من خدمة الفهرس.", kinds: ["course"],
  },
};

const detailKinds: Record<string, OfferingKind[]> = {
  tracks: ["track"],
  initiatives: ["initiative"],
  programs: ["intensive_program"],
  "seasonal-programs": ["seasonal_program"],
  courses: ["course"],
};

export function resolveCatalogRoute(slug: string[]): CatalogRoute | null {
  if (slug.length === 1) return Object.hasOwn(listingRoutes, slug[0]) ? listingRoutes[slug[0]] : null;
  if (slug.length === 2 && Object.hasOwn(detailKinds, slug[0])) {
    return { type: "detail", basePath: `/${slug[0]}`, expectedKinds: detailKinds[slug[0]] };
  }

  return null;
}

export function resolveAuthAlias(slug: string[]): string | null {
  const aliases: Record<string, string> = { login: "login", register: "register", "forgot-password": "forgot-password", "reset-password": "reset-password" };
  return slug.length === 1 && Object.hasOwn(aliases, slug[0]) ? `/auth/${aliases[slug[0]]}` : null;
}

export function catalogRouteAcceptsKind(route: CatalogDetailRoute, kind: OfferingKind): boolean {
  return route.expectedKinds.includes(kind);
}

export function isOfferingKind(value: string | undefined): value is OfferingKind {
  return value === "track" || value === "initiative" || value === "intensive_program" || value === "seasonal_program" || value === "course";
}

export function isPricingModel(value: string | undefined): value is "free" | "paid" {
  return value === "free" || value === "paid";
}
