/** Mirrors Modules\Course\Enums\OfferingKind. */
export type OfferingKind = "track" | "initiative" | "intensive_program" | "seasonal_program" | "course";

export type PricingModel = "free" | "paid";

/** How the next subject unlocks; enforced by the backend. */
export type SequencingMode = "open" | "after_previous_completed" | "after_previous_quiz_passed";

/** "lessons" = show lessons flat (course → lessons); the offering then has a single subject. */
export type OutlineStyle = "subjects" | "lessons";

/** Amounts are integer minor units (e.g. piasters); format with formatPrice(). */
export interface PricingSummary {
  model: PricingModel;
  price_amount: number | null;
  discounted_price_amount: number | null;
  final_price_amount: number | null;
  currency: string | null;
}

/** GET /catalog/offerings — CatalogOfferingResource */
export interface CatalogOffering {
  id: number;
  kind: OfferingKind;
  title: string;
  slug: string;
  summary: string | null;
  is_featured: boolean;
  season_name: string | null;
  estimated_duration_minutes: number | null;
  starts_at: string | null;
  ends_at: string | null;
  pricing: PricingSummary;
  lesson_count: number;
}

export interface CatalogOutlineLesson {
  id: number;
  title: string;
  estimated_duration_minutes: number | null;
}

export interface CatalogOutlineSubject {
  id: number;
  title: string;
  description: string | null;
  lessons: CatalogOutlineLesson[];
}

/** GET /catalog/offerings/{slug} — CatalogOfferingDetailResource */
export interface CatalogOfferingDetail extends CatalogOffering {
  description: string | null;
  goals: string[];
  target_audience: string | null;
  sequencing_mode: SequencingMode;
  outline_style: OutlineStyle;
  total_lesson_minutes: number;
  instructors: { id: number; name: string }[];
  outline: CatalogOutlineSubject[];
}

export interface CatalogFilters {
  kind?: OfferingKind;
  pricing?: PricingModel;
  featured?: boolean;
  perPage?: number;
  cursor?: string | null;
}
