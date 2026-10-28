/** Explicitly synthetic templates: no approved production catalog, people, or claims. */
export const marketingTracks = [
  { id: "start", name: "سنة أولى علم", audience: "لمن يبحث عن بداية منظمة في طلب العلم", journey: "من أسئلة البداية إلى خطة تعلّم واضحة", outcomes: ["استكشاف أبواب العلم", "بناء عادة للمراجعة"], videoUrl: null },
  { id: "quran", name: "المعهد القرآني الدعوي", audience: "للمهتم بالقرآن والتعلّم المنتظم", journey: "صحبة القرآن، خطوة بخطوة", outcomes: ["التعرّف إلى رحلة الدراسة القرآنية", "الربط بين التعلّم والعمل"], videoUrl: null },
  { id: "seerah", name: "إنه محمد ﷺ", audience: "للمهتم بدراسة السيرة", journey: "تعرّف إلى السيرة في رحلة مترابطة", outcomes: ["استكشاف موضوعات السيرة", "تنظيم القراءة والمتابعة"], videoUrl: null },
] as const;
export const marketingStudents = [
  { id: "sample-a", name: "طالب نموذجي أ", gender: "male", trackId: "start", stageId: "stage-a", groupId: "group-a", authorized: true },
  { id: "sample-b", name: "طالبة نموذجية ب", gender: "female", trackId: "start", stageId: "stage-a", groupId: "group-a", authorized: true },
  { id: "sample-c", name: "طالب نموذجي ج", gender: "male", trackId: "quran", stageId: "stage-b", groupId: "group-b", authorized: true },
  { id: "sample-d", name: "طالبة نموذجية د", gender: "female", trackId: "quran", stageId: "stage-b", groupId: "group-b", authorized: true },
  { id: "sample-e", name: "متعلم نموذجي هـ", gender: "unknown", trackId: "start", stageId: "stage-b", groupId: "group-a", authorized: true },
  { id: "sample-outside", name: "سجل خارج النطاق التجريبي", gender: "male", trackId: "seerah", stageId: "stage-b", groupId: "group-b", authorized: false },
] as const;
export type MarketingStudent = typeof marketingStudents[number];
