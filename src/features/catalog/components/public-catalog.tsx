import Link from "next/link";
import { catalogListingHref, type CatalogQueryValues } from "../search-query";
import { formatPrice } from "@/lib/format/price";
import type {
  CatalogOffering,
  CatalogOfferingDetail,
  OfferingKind,
  PricingModel,
} from "../types";
import "./public-catalog.css";

const kindLabels: Record<OfferingKind, string> = {
  track: "مسار تعليمي",
  initiative: "مبادرة",
  intensive_program: "برنامج مكثف",
  seasonal_program: "برنامج موسمي",
  course: "دورة",
};

const detailPaths: Record<OfferingKind, string> = {
  track: "/tracks",
  initiative: "/initiatives",
  intensive_program: "/programs",
  seasonal_program: "/seasonal-programs",
  course: "/courses",
};

export interface PublicCatalogListingProps {
  /** Only offerings returned by the public catalog API should be passed here. */
  offerings: CatalogOffering[];
  title: string;
  description: string;
  /** Route that owns this list and its query parameters. */
  basePath: string;
  /** Current server-parsed filter value, echoed by the native GET form. */
  pricing?: PricingModel;
  /** All-catalog kind selection; fixed-kind routes omit this control. */
  kind?: OfferingKind;
  nextCursor: string | null;
  previousCursor: string | null;
  errorMessage?: string | null;
  q?: string;
  featured?: boolean;
  perPage?: number;
  queryError?: string;
  /** Keep rejected non-sensitive URL fields visible rather than silently dropping them. */
  submittedFilters?: CatalogQueryValues;
  fieldErrors?: Record<string, string>;
  retryHref?: string;
}

export function PublicCatalogListing({
  offerings,
  title,
  description,
  basePath,
  pricing,
  kind,
  nextCursor,
  previousCursor,
  errorMessage, q, featured, perPage, queryError, submittedFilters, fieldErrors = {}, retryHref,
}: PublicCatalogListingProps) {
  const hasItems = offerings.length > 0;
  const values: CatalogQueryValues = {
    q, kind, pricing,
    featured: featured === undefined ? undefined : featured ? "1" : "0",
    per_page: perPage === undefined ? undefined : String(perPage),
    ...submittedFilters,
  };
  const selectedKind = values.kind ?? "";
  const selectedPricing = values.pricing ?? "";
  const previousHref = previousCursor ? catalogListingHref(basePath, { ...values, cursor: previousCursor }) : null;
  const nextHref = nextCursor ? catalogListingHref(basePath, { ...values, cursor: nextCursor }) : null;
  const clearQueryHref = catalogListingHref(basePath, { ...values, q: undefined, cursor: undefined });
  const isUnscoped = basePath === "/catalog" || basePath === "/search";
  const hasFilters = !!(values.kind || values.pricing || values.featured || values.per_page);
  const hasError = !!(queryError || errorMessage || Object.keys(fieldErrors).length);

  return (
    <main className="public-catalog" dir="rtl">
      <header className="public-catalog__intro">
        <p className="public-catalog__eyebrow">أكاديمية د. حازم شومان</p>
        <h1>{title}</h1>
        <p className="public-catalog__description">{description}</p>
      </header>

      <section className="public-catalog__controls" aria-label="تصفية المحتوى">
        <form className="public-catalog__filter-form" action={basePath} method="get" noValidate>
          <div className="public-catalog__filter-field public-catalog__search-field">
            <label htmlFor="catalog-query">البحث في المحتوى</label>
            <input id="catalog-query" name="q" type="search" key={q ?? ""} defaultValue={q ?? ""}
              aria-invalid={queryError ? true : undefined} aria-describedby={queryError ? "catalog-query-error" : undefined} />
            {queryError ? <p id="catalog-query-error" role="alert">{queryError}</p> : null}
            {q ? <Link className="public-catalog__clear-filter" href={clearQueryHref}>مسح البحث</Link> : null}
          </div>
          {values.featured !== undefined ? <input type="hidden" name="featured" value={values.featured} /> : null}
          {values.per_page !== undefined ? <input type="hidden" name="per_page" value={values.per_page} /> : null}
          {!isUnscoped && values.kind !== undefined ? <input type="hidden" name="kind" value={values.kind} /> : null}
          {isUnscoped ? (
            <div className="public-catalog__filter-field">
              <label htmlFor="catalog-kind">نوع المحتوى</label>
              <select id="catalog-kind" name="kind" key={selectedKind || "all"} defaultValue={selectedKind} aria-invalid={fieldErrors.kind ? true : undefined} aria-describedby={fieldErrors.kind ? "catalog-kind-error" : undefined}>
                <option value="">كل المحتوى</option>
                {selectedKind && !Object.hasOwn(kindLabels, selectedKind) ? <option value={selectedKind}>{selectedKind} — غير صالح</option> : null}
                {Object.entries(kindLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
            </div>
          ) : null}
          <div className="public-catalog__filter-field">
            <label htmlFor="catalog-pricing">نوع السعر</label>
            <select id="catalog-pricing" name="pricing" key={selectedPricing || "all"} defaultValue={selectedPricing} aria-invalid={fieldErrors.pricing ? true : undefined} aria-describedby={fieldErrors.pricing ? "catalog-pricing-error" : undefined}>
              <option value="">كل الأسعار</option>
              {selectedPricing && !["free", "paid"].includes(selectedPricing) ? <option value={selectedPricing}>{selectedPricing} — غير صالح</option> : null}
              <option value="free">مجاني</option>
              <option value="paid">مدفوع</option>
            </select>
          </div>
          <button className="public-catalog__filter-submit" type="submit">
            تطبيق التصفية
          </button>
        </form>
        {pricing ? (
          <Link className="public-catalog__clear-filter" href={catalogListingHref(basePath, { ...values, pricing: undefined, cursor: undefined })}>
            إزالة التصفية
          </Link>
        ) : null}
        {(q || hasFilters) ? <Link className="public-catalog__clear-filter" href={basePath}>مسح الكل</Link> : null}
        {Object.entries(fieldErrors).map(([key, message]) => <p id={`catalog-${key}-error`} key={key} role="alert">{message}{values[key as keyof CatalogQueryValues] ? ` (${values[key as keyof CatalogQueryValues]})` : ""}</p>)}
      </section>

      {hasError ? (
        <section className="public-catalog__error" role="alert">
          <h2>{queryError || Object.keys(fieldErrors).length ? "راجع بيانات البحث والتصفية" : "تعذر تحميل المحتوى"}</h2>
          {errorMessage ? <p>{errorMessage}</p> : null}
          {!queryError && !Object.keys(fieldErrors).length ? <Link className="public-catalog__empty-link" href={retryHref ?? catalogListingHref(basePath, values)}>إعادة المحاولة</Link> : null}
        </section>
      ) : hasItems ? (
        <>
          <ul className="public-catalog__grid" aria-label="المحتوى المنشور">
            {offerings.map((offering) => (
              <li className="public-catalog__grid-item" key={offering.id}>
                <OfferingCard offering={offering} />
              </li>
            ))}
          </ul>
          <Pagination previousHref={previousHref} nextHref={nextHref} />
        </>
      ) : (
        <section className="public-catalog__empty" aria-live="polite">
          <span className="public-catalog__empty-mark" aria-hidden="true">✦</span>
          <h2>{q ? "لا توجد نتائج مطابقة لبحثك" : hasFilters ? "لا توجد مواد منشورة بهذه التصفية" : "لا توجد مواد منشورة للعرض الآن"}</h2>
          <p>
            {q ? "جرّب كلمات أخرى أو امسح البحث مع الاحتفاظ بالتصفية." : hasFilters
              ? "جرّب اختيار نوع سعر آخر لعرض المواد المنشورة المتاحة."
              : "ستظهر هنا المواد التي تنشرها الأكاديمية وتتيحها للزوار."}
          </p>
          {pricing ? (
              <Link className="public-catalog__empty-link" href={catalogListingHref(basePath, { ...values, pricing: undefined, cursor: undefined })}>
              عرض كل المحتوى
            </Link>
          ) : null}
        </section>
      )}
    </main>
  );
}

export interface PublicOfferingDetailProps {
  offering: CatalogOfferingDetail;
  backHref: string;
}

export function PublicOfferingDetail({ offering, backHref }: PublicOfferingDetailProps) {
  const description = offering.description ?? offering.summary;

  return (
    <main className="public-catalog public-catalog--detail" dir="rtl">
      <nav className="public-catalog__breadcrumbs" aria-label="مسار التنقل">
        <Link href="/">الرئيسية</Link>
        <span aria-hidden="true">/</span>
        <Link href={backHref}>{kindListLabel(offering.kind)}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{offering.title}</span>
      </nav>

      <article>
        <header className="public-catalog__detail-intro">
          <p className="public-catalog__eyebrow">{kindLabels[offering.kind]}</p>
          {offering.season_name ? (
            <p className="public-catalog__season">{offering.season_name}</p>
          ) : null}
          <h1>{offering.title}</h1>
          {description ? <p className="public-catalog__description">{description}</p> : null}
          <dl className="public-catalog__facts" aria-label="معلومات المحتوى">
            <div>
              <dt>عدد الدروس</dt>
              <dd>{formatNumber(offering.lesson_count)} درس</dd>
            </div>
            {offering.total_lesson_minutes > 0 ? (
              <div>
                <dt>المدة الإجمالية المقدّرة</dt>
                <dd>{formatNumber(offering.total_lesson_minutes)} دقيقة</dd>
              </div>
            ) : null}
            <div>
              <dt>السعر</dt>
              <dd><OfferingPrice pricing={offering.pricing} /></dd>
            </div>
          </dl>
        </header>

        {offering.goals.length > 0 || offering.target_audience || offering.instructors.length > 0 ? (
          <section className="public-catalog__details-grid" aria-label="تفاصيل المحتوى">
            {offering.goals.length > 0 ? (
              <section className="public-catalog__detail-panel">
                <h2>أهداف المحتوى</h2>
                <ul className="public-catalog__goals">
                  {offering.goals.map((goal) => <li key={goal}>{goal}</li>)}
                </ul>
              </section>
            ) : null}
            {offering.target_audience ? (
              <section className="public-catalog__detail-panel">
                <h2>لمن هذا المحتوى؟</h2>
                <p>{offering.target_audience}</p>
              </section>
            ) : null}
            {offering.instructors.length > 0 ? (
              <section className="public-catalog__detail-panel">
                <h2>المعلّمون</h2>
                <ul className="public-catalog__instructors">
                  {offering.instructors.map((instructor) => (
                    <li key={instructor.id}>{instructor.name}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </section>
        ) : null}

        <section className="public-catalog__outline" aria-labelledby="catalog-outline-title">
          <div className="public-catalog__section-heading">
            <p className="public-catalog__eyebrow">محتوى منشور</p>
            <h2 id="catalog-outline-title">ماذا ستجد في هذا المحتوى؟</h2>
          </div>
          {offering.outline.length > 0 ? (
            offering.outline_style === "lessons" ? (
              <ol className="public-catalog__lesson-list" aria-label="الدروس المنشورة">
                {offering.outline.flatMap((subject) => subject.lessons).map((lesson) => (
                  <li key={lesson.id}>
                    <span>{lesson.title}</span>
                    {lesson.estimated_duration_minutes !== null ? (
                      <span className="public-catalog__lesson-duration">
                        {formatNumber(lesson.estimated_duration_minutes)} دقيقة
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
            ) : (
              <ol className="public-catalog__subject-list" aria-label="المواد المنشورة">
                {offering.outline.map((subject) => (
                  <li className="public-catalog__subject" key={subject.id}>
                    <h3>{subject.title}</h3>
                    {subject.description ? <p>{subject.description}</p> : null}
                    <ol className="public-catalog__lesson-list" aria-label={`دروس ${subject.title}`}>
                      {subject.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <span>{lesson.title}</span>
                          {lesson.estimated_duration_minutes !== null ? (
                            <span className="public-catalog__lesson-duration">
                              {formatNumber(lesson.estimated_duration_minutes)} دقيقة
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ol>
                  </li>
                ))}
              </ol>
            )
          ) : (
            <p className="public-catalog__outline-empty">لا يوجد مخطط منشور لعرضه الآن.</p>
          )}
        </section>

        <aside className="public-catalog__availability" aria-label="حالة الخدمة">
          <p>هذه الصفحة تعرض معلومات المحتوى المنشورة فقط. التسجيل أو الدفع غير متاح من خلالها الآن.</p>
        </aside>
      </article>
    </main>
  );
}

function OfferingCard({ offering }: { offering: CatalogOffering }) {
  const href = `${detailPaths[offering.kind]}/${encodeURIComponent(offering.slug)}`;

  return (
    <article className="public-catalog__card">
      <div className="public-catalog__card-topline">
        <span className="public-catalog__kind">{kindLabels[offering.kind]}</span>
        {offering.season_name ? <span className="public-catalog__season">{offering.season_name}</span> : null}
      </div>
      <h2><Link href={href}>{offering.title}</Link></h2>
      <p className="public-catalog__card-summary">
        {offering.summary ?? "لا يتوفر وصف موجز لهذا المحتوى حاليًا."}
      </p>
      <div className="public-catalog__card-facts">
        <span>{formatNumber(offering.lesson_count)} درس</span>
        {offering.estimated_duration_minutes !== null ? (
          <span>{formatNumber(offering.estimated_duration_minutes)} دقيقة تقديريًا</span>
        ) : null}
        <OfferingPrice pricing={offering.pricing} />
      </div>
      <Link className="public-catalog__card-link" href={href}>
        تفاصيل المحتوى <span aria-hidden="true">←</span>
      </Link>
    </article>
  );
}

function OfferingPrice({ pricing }: { pricing: CatalogOffering["pricing"] }) {
  if (pricing.model === "free") {
    return <span className="public-catalog__price public-catalog__price--free">مجاني</span>;
  }

  const finalPrice = getFormattedPrice(pricing.final_price_amount, pricing.currency);
  const originalPrice = getFormattedPrice(pricing.price_amount, pricing.currency);
  const hasReturnedDiscount = pricing.discounted_price_amount !== null
    && pricing.price_amount !== null
    && pricing.discounted_price_amount < pricing.price_amount
    && pricing.final_price_amount !== null;

  if (!finalPrice) {
    return <span className="public-catalog__price">السعر غير متاح حاليًا</span>;
  }

  return (
    <span className="public-catalog__price">
      {hasReturnedDiscount && originalPrice ? (
        <s className="public-catalog__old-price"><bdi dir="ltr">{originalPrice}</bdi></s>
      ) : null}
      <bdi dir="ltr">{finalPrice}</bdi>
    </span>
  );
}

function Pagination({ previousHref, nextHref }: { previousHref: string | null; nextHref: string | null }) {
  if (!previousHref && !nextHref) return null;

  return (
    <nav className="public-catalog__pagination" aria-label="التنقل بين صفحات المحتوى">
      {previousHref ? <Link href={previousHref}>المحتوى السابق</Link> : <span aria-hidden="true" />}
      {nextHref ? <Link href={nextHref}>المحتوى التالي <span aria-hidden="true">←</span></Link> : null}
    </nav>
  );
}

function kindListLabel(kind: OfferingKind): string {
  if (kind === "track") return "المسارات";
  if (kind === "course") return "الدورات";
  if (kind === "initiative") return "المبادرات";
  return "البرامج";
}

function getFormattedPrice(amount: number | null, currency: string | null): string | null {
  if (amount === null || currency === null) return null;

  try {
    return formatPrice(amount, currency);
  } catch {
    return null;
  }
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ar-EG").format(value);
}
