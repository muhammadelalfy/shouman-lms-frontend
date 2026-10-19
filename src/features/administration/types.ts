import type { AccountStatus, Role, Permission } from "@/features/auth/types";
import type { OfferingKind } from "@/features/catalog/types";
export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  status: AccountStatus;
  roles?: Role[];
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string | null;
}
export interface AdminRole {
  name: Role;
  permissions: Permission[];
  permissions_locked: boolean;
}
export type ContentStatus = "draft" | "published" | "hidden" | "archived";
export interface AdminLesson {
  id: number;
  subject_id: number;
  title: string;
  description: string | null;
  summary: string | null;
  key_points: string[];
  estimated_duration_minutes: number | null;
  position: number;
  status: ContentStatus;
  published_at: string | null;
}
export interface AdminSubject {
  id: number;
  offering_id: number;
  title: string;
  description: string | null;
  position: number;
  status: ContentStatus;
  published_at: string | null;
  lessons?: AdminLesson[];
}
export interface AdminOffering {
  id: number;
  kind: OfferingKind;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  goals: string[];
  target_audience: string | null;
  estimated_duration_minutes: number | null;
  starts_at: string | null;
  ends_at: string | null;
  visible_from: string | null;
  visible_until: string | null;
  is_featured: boolean;
  season_name: string | null;
  sequencing_mode:
    "open" | "after_previous_completed" | "after_previous_quiz_passed";
  outline_style: "subjects" | "lessons";
  pricing: {
    model: "free" | "paid";
    price_amount: number | null;
    discounted_price_amount: number | null;
    final_price_amount: number | null;
    currency: string | null;
  };
  status: ContentStatus;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  subjects_count?: number;
  subjects?: AdminSubject[];
  instructors?: { id: number; name: string }[];
}
