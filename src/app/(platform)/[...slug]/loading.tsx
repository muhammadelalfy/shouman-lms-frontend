import { PlatformFrame } from "@/features/pages/page-shell";

export default function Loading() {
  return (
    <PlatformFrame>
      <main id="platform-main" className="platform-loading" aria-live="polite" aria-busy="true">
        <span className="platform-loading-spinner" aria-hidden="true" />
        <p>جارٍ تحميل الصفحة…</p>
      </main>
    </PlatformFrame>
  );
}
