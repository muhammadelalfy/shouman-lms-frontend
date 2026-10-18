export interface PreviewNavigationItem { label: string; href?: string }

/** Shared section navigation; visual copy follows the immutable Lovable snapshot. */
export const HOME_PREVIEW = {
  navigation: [
    { label: "الرئيسية", href: "#home" },
    { label: "المسارات", href: "#tracks" },
    { label: "المبادرات", href: "#initiatives" },
    { label: "البرامج", href: "#programs" },
    { label: "اللقاءات" },
    { label: "الأسئلة الشائعة" },
  ] satisfies PreviewNavigationItem[],
};
