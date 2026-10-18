import type { Metadata } from "next";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { AuthForm } from "@/features/auth/components/auth-forms";
import { ProfileSettings } from "@/features/account/components/profile-settings";
import { getCurrentUser } from "@/features/account/api";
import { PublicCatalogListing, PublicOfferingDetail } from "@/features/catalog/components/public-catalog";
import { getCatalogOffering, listCatalogOfferings } from "@/features/catalog/api";
import type { CatalogOffering, CatalogOfferingDetail, CatalogFilters, OfferingKind, PricingModel } from "@/features/catalog/types";
import { isApiError } from "@/lib/api/errors";
import { apiFailure } from "@/lib/forms";
import { getSessionToken } from "@/lib/auth/session";
import { PlatformFrame, PlatformPage } from "@/features/pages/page-shell";
import { catalogRouteAcceptsKind, isOfferingKind, isPricingModel, resolveCatalogRoute, resolveAuthAlias } from "@/features/pages/route-resolution";
import { getPageDefinition, isKnownPlatformRoute } from "@/features/pages/page-content";
import { resolveExperienceRoute, workspaceForExperience } from "@/features/experience/route-registry";
import { PublicExperience } from "@/features/experience/public/public-experience";
import { LearnerExperience } from "@/features/experience/learner/learner-experience";
import { AdminExperience } from "@/features/experience/admin/admin-experience";
import { ExperienceDirectory } from "@/features/experience/directory";
import { ExperienceWorkspace } from "@/features/experience/shared/workspace";
import { PreviewNotice } from "@/features/experience/shared/ui";
import "@/features/experience/shared/experience.css";

export const dynamic = "force-dynamic";

const getCatalogOfferingForRender = cache((slug: string) => getCatalogOffering(slug));

type RouteParams = { params: Promise<{ slug: string[] }> };
type QueryParams = { searchParams: Promise<Record<string, string | string[] | undefined>> };
type PlatformRouteProps = RouteParams & QueryParams;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function catalogTitle(kind: string): string {
  return ({
    track: "المسارات التعليمية",
    initiative: "المبادرات التعليمية",
    intensive_program: "البرامج المكثفة",
    seasonal_program: "البرامج الموسمية",
    course: "الدورات التعليمية",
  } as Record<string, string>)[kind] ?? "الفهرس التعليمي";
}

function safeErrorMessage(error: unknown, fallback: string): string {
  const failure = apiFailure(error);
  return failure.status === "error" ? failure.message : fallback;
}

function matchesRouteKind(route: NonNullable<ReturnType<typeof resolveCatalogRoute>>, offering: CatalogOfferingDetail): boolean {
  return route.type !== "detail" || catalogRouteAcceptsKind(route, offering.kind);
}

async function loadOfferings(route: Extract<NonNullable<ReturnType<typeof resolveCatalogRoute>>, { type: "listing" }>, query: Record<string, string | string[] | undefined>) {
  const pricingValue = first(query.pricing);
  const pricing: PricingModel | undefined = isPricingModel(pricingValue) ? pricingValue : undefined;
  const queryKind = first(query.kind);
  const selectedKind: OfferingKind | undefined = route.basePath === "/catalog" && isOfferingKind(queryKind) ? queryKind : undefined;
  const cursor = first(query.cursor) ?? null;
  const kinds: Array<OfferingKind | undefined> = selectedKind ? [selectedKind] : route.kinds.length ? route.kinds : [undefined];
  const results = await Promise.all(kinds.map(async (kind) => {
    const filters: CatalogFilters = { ...(kind ? { kind } : {}), pricing, cursor };
    return listCatalogOfferings(filters);
  }));

  const offerings = results.flatMap((result) => result.data);
  const nextCursor = results.map((result) => result.meta.next_cursor).find(Boolean) ?? null;
  const previousCursor = results.map((result) => result.meta.prev_cursor).find(Boolean) ?? null;

  return { offerings, pricing, nextCursor, previousCursor };
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const experience = resolveExperienceRoute(slug);
  if (experience) return { title: experience.title, description: "واجهة أكاديمية د. حازم شومان — معاينة تصميم تفاعلية ببيانات تجريبية.", robots: { index: false, follow: false } };
  const route = resolveCatalogRoute(slug);
  if (route?.type === "listing") return { title: route.title, description: route.description };
  if (route?.type === "detail") {
    try {
      const offering = await getCatalogOfferingForRender(slug[1]);
      if (offering && matchesRouteKind(route, offering)) {
        return { title: offering.title, description: offering.summary ?? offering.description ?? undefined, robots: { index: true, follow: true } };
      }
    } catch {
      // Keep route metadata safe when the catalog API is unavailable.
    }
  }

  const page = getPageDefinition(slug);
  return { title: page.title, description: page.description, robots: { index: false, follow: false } };
}

export default async function PlatformRoute({ params, searchParams }: PlatformRouteProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const authAlias = resolveAuthAlias(slug);
  if (authAlias) {
    const queryString = new URLSearchParams(Object.entries(query).flatMap(([key, value]) => { const item = first(value); return item === undefined ? [] : [[key, item]]; })).toString();
    redirect(`${authAlias}${queryString ? `?${queryString}` : ""}`);
  }
  const experience = resolveExperienceRoute(slug);
  if (experience) {
    const previewQuery = { q: first(query.q) };
    const previewKey = `${experience.path.join("/")}:${previewQuery.q ?? ""}`;
    const workspace = workspaceForExperience(experience);
    const content = experience.area === "directory" ? <ExperienceDirectory />
      : experience.area === "public" ? <PublicExperience key={previewKey} path={experience.path} query={previewQuery} />
        : experience.area === "learner" ? <LearnerExperience key={previewKey} path={experience.path} />
          : <AdminExperience key={previewKey} path={experience.path} />;
    return <PlatformFrame><div className="experience">{!workspace
      ? <main id="platform-main" className="xp-public-main"><PreviewNotice />{content}</main>
      : <ExperienceWorkspace area={workspace} currentPath={`/${experience.path.join("/")}`}><main id="platform-main"><PreviewNotice />{content}</main></ExperienceWorkspace>}
    </div></PlatformFrame>;
  }
  const catalogRoute = resolveCatalogRoute(slug);

  if (catalogRoute?.type === "listing") {
    let result: Awaited<ReturnType<typeof loadOfferings>> | null = null;
    let loadError: unknown;
    try {
      result = await loadOfferings(catalogRoute, query);
    } catch (error) {
      loadError = error;
    }

    const selectedKind = first(query.kind);
    const selectedPricingValue = first(query.pricing);
    const selectedPricing = isPricingModel(selectedPricingValue) ? selectedPricingValue : undefined;
    const title = catalogRoute.basePath === "/catalog" && isOfferingKind(selectedKind)
      ? catalogTitle(selectedKind)
      : catalogRoute.title;
    if (loadError) {
      const empty: CatalogOffering[] = [];
      return (
        <PlatformFrame>
          <div id="platform-main" className="platform-main">
            <PublicCatalogListing
              title={catalogRoute.title}
              description={catalogRoute.description}
              basePath={catalogRoute.basePath}
              offerings={empty}
              kind={selectedKind && catalogRoute.basePath === "/catalog" && isOfferingKind(selectedKind) ? selectedKind : undefined}
              pricing={selectedPricing}
              nextCursor={null}
              previousCursor={null}
              errorMessage={safeErrorMessage(loadError, "تعذر تحميل الفهرس. حاول مرة أخرى لاحقًا.")}
            />
          </div>
        </PlatformFrame>
      );
    }
    if (!result) throw new Error("Catalog request completed without a result");

    return (
      <PlatformFrame>
        <div id="platform-main" className="platform-main">
          <PublicCatalogListing
            title={title}
            description={catalogRoute.description}
            basePath={catalogRoute.basePath}
            offerings={result.offerings as CatalogOffering[]}
            kind={selectedKind && catalogRoute.basePath === "/catalog" && isOfferingKind(selectedKind) ? selectedKind : undefined}
            pricing={result.pricing}
            nextCursor={result.nextCursor}
            previousCursor={result.previousCursor}
          />
        </div>
      </PlatformFrame>
    );
  }

  if (catalogRoute?.type === "detail") {
    let offering: CatalogOfferingDetail | null;
    try {
      offering = await getCatalogOfferingForRender(slug[1]);
    } catch (error) {
      return <PlatformPage page={{
        title: "تعذر تحميل المحتوى", englishTitle: "Catalog temporarily unavailable", eyebrow: "الفهرس التعليمي",
        description: safeErrorMessage(error, "تعذر تحميل المحتوى. حاول مرة أخرى لاحقًا."), kind: "preview", previewLabel: "تعذر الاتصال بالفهرس",
        links: [{ label: "إعادة المحاولة", href: `/${slug.join("/")}` }, { label: "الفهرس", href: "/catalog" }],
      }} />;
    }
    if (!offering || !matchesRouteKind(catalogRoute, offering)) notFound();

    return <PlatformFrame><div id="platform-main" className="platform-main"><PublicOfferingDetail offering={offering} backHref={catalogRoute.basePath} /></div></PlatformFrame>;
  }

  if (!isKnownPlatformRoute(slug)) notFound();

  if (slug[0] === "auth" && ["login", "register", "forgot-password", "reset-password"].includes(slug[1] ?? "")) {
    const mode = slug[1] as "login" | "register" | "forgot-password" | "reset-password";
    return <PlatformFrame><main id="platform-main" className="platform-main"><AuthForm mode={mode} token={first(query.token)} email={first(query.email)} redirectTo={first(query.redirectTo)} sessionExpired={first(query.expired) === "1"} /></main></PlatformFrame>;
  }

  if (slug.length === 1 && slug[0] === "account") {
    const token = await getSessionToken();
    if (!token) redirect("/auth/login?redirectTo=%2Faccount");
    let user: Awaited<ReturnType<typeof getCurrentUser>> | null = null;
    let accountError: unknown;
    try {
      user = await getCurrentUser(token);
    } catch (error) {
      accountError = error;
    }
    if (accountError) {
      const error = accountError;
      if (isApiError(error) && error.isUnauthenticated) redirect("/auth/login?redirectTo=%2Faccount&expired=1");
      return <PlatformPage page={{
        title: "تعذر تحميل الحساب", englishTitle: "Account unavailable", eyebrow: "حسابي",
        description: safeErrorMessage(error, "تعذر تحميل بيانات الحساب. حاول مرة أخرى لاحقًا."), kind: "preview", previewLabel: "تعذر تحميل بيانات الحساب",
        links: [{ label: "إعادة المحاولة", href: "/account" }, { label: "الرئيسية", href: "/" }],
      }} />;
    }
    if (!user) throw new Error("Account request completed without a user");
    return <PlatformFrame><main id="platform-main" className="platform-main"><ProfileSettings user={{ name: user.name, email: user.email, phone: user.phone }} /></main></PlatformFrame>;
  }

  const page = getPageDefinition(slug);
  if (page.title === "الصفحة غير موجودة") notFound();
  return <PlatformPage page={page} />;
}
