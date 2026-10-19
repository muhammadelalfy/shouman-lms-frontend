"use client";
import Link from "next/link";
import { useState } from "react";
import type { AdminOffering } from "../types";
import { ActionForm } from "../components/action-form";
import { ContentControls } from "./content-controls";
import { reorderContentAction } from "./actions";
function OrderEditor({
  items,
  offeringId,
  subjectId,
}: {
  items: { id: number; title: string }[];
  offeringId: number;
  subjectId?: number;
}) {
  const incoming = items.map((item) => item.id).join(",");
  const [draft, setDraft] = useState({
    source: incoming,
    ids: items.map((item) => item.id),
    changed: false,
  });
  if (draft.source !== incoming) {
    const dirty = draft.ids.join(",") !== draft.source;
    const currentIds = new Set(items.map((item) => item.id));
    // Preserve a local draft's relative order, dropping deleted siblings and
    // appending new ones. A clean editor follows the refreshed server order.
    const retained = draft.ids.filter((id) => currentIds.has(id));
    setDraft({
      source: incoming,
      ids: dirty
        ? [
            ...retained,
            ...items
              .filter((item) => !retained.includes(item.id))
              .map((item) => item.id),
          ]
        : items.map((item) => item.id),
      changed: dirty && draft.ids.join(",") !== incoming,
    });
  }
  const ordered = draft.ids.flatMap((id) => {
    const item = items.find((item) => item.id === id);
    return item ? [item] : [];
  });
  const move = (index: number, delta: number) =>
    setDraft((current) => {
      const next = [...current.ids];
      [next[index], next[index + delta]] = [next[index + delta], next[index]];
      return { ...current, ids: next };
    });
  return (
    <details className="admin-outline-item">
      <summary>ترتيب {subjectId ? "الدروس" : "المواد"}</summary>
      {draft.changed && (
        <p role="status" className="xp-muted">
          تغيّرت القائمة أثناء التحرير. احتُفظ بترتيبك للعناصر الحالية. راجع القائمة المحدّثة قبل الحفظ.
        </p>
      )}
      <ActionForm action={reorderContentAction} label="حفظ الترتيب">
        <input type="hidden" name="offering_id" value={offeringId} />
        <input
          type="hidden"
          name="entity"
          value={subjectId ? "lessons" : "subjects"}
        />
        {subjectId && (
          <input type="hidden" name="subject_id" value={subjectId} />
        )}
        <input
          type="hidden"
          name="ids"
          value={ordered.map((i) => i.id).join(",")}
        />
        <ol>
          {ordered.map((item, index) => (
            <li key={item.id}>
              <div className="xp-row">
                <span>{item.title}</span>
                <span>
                  <button
                    type="button"
                    className="xp-icon-button"
                    disabled={index === 0}
                    aria-label={`تقديم ${item.title}`}
                    onClick={() => move(index, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="xp-icon-button"
                    disabled={index === ordered.length - 1}
                    aria-label={`تأخير ${item.title}`}
                    onClick={() => move(index, 1)}
                  >
                    ↓
                  </button>
                </span>
              </div>
            </li>
          ))}
        </ol>
      </ActionForm>
    </details>
  );
}
export function OutlineEditor({
  offering,
  manage,
  publish,
}: {
  offering: AdminOffering;
  manage: boolean;
  publish: boolean;
}) {
  const subjects = [...(offering.subjects ?? [])].sort(
    (a, b) => a.position - b.position,
  );
  const base = `/admin/offerings/${offering.id}`;
  return (
    <section className="xp-card">
      <div className="xp-row">
        <h2>المنهج التعليمي</h2>
        {manage && (
          <Link
            className="xp-button xp-button-outline"
            href={`${base}/subjects/new`}
          >
            إضافة مادة
          </Link>
        )}
      </div>
      {!subjects.length && (
        <p className="xp-muted">لم تُضف مواد بعد. ابدأ بإضافة المادة الأولى.</p>
      )}
      {manage && subjects.length > 1 && (
        <OrderEditor
          key={`subjects-${offering.id}`}
          items={subjects}
          offeringId={offering.id}
        />
      )}
      {subjects.map((s) => (
        <article className="admin-outline-item" key={s.id}>
          <div className="xp-row">
            <h3>
              {s.position}. {s.title}
            </h3>
            {manage && (
              <Link
                className="xp-button xp-button-outline"
                href={`${base}/subjects/${s.id}`}
              >
                تحرير المادة
              </Link>
            )}
          </div>
          <p>{s.description}</p>
          <ContentControls
            offeringId={offering.id}
            id={s.id}
            entity="subjects"
            status={s.status}
            title={s.title}
            manage={manage}
            publish={publish}
          />
          <h3>الدروس</h3>
          {!s.lessons?.length && (
            <p className="xp-muted">لا توجد دروس في هذه المادة.</p>
          )}
          {[...(s.lessons ?? [])]
            .sort((a, b) => a.position - b.position)
            .map((l) => (
              <details className="admin-outline-item" key={l.id}>
                <summary>
                  {l.position}. {l.title}
                </summary>
                <p>{l.description}</p>
                {manage && (
                  <p>
                    <Link
                      className="xp-button xp-button-outline"
                      href={`${base}/subjects/${s.id}/lessons/${l.id}`}
                    >
                      تحرير الدرس
                    </Link>
                  </p>
                )}
                <ContentControls
                  offeringId={offering.id}
                  id={l.id}
                  entity="lessons"
                  status={l.status}
                  title={l.title}
                  manage={manage}
                  publish={publish}
                />
              </details>
            ))}
          {manage && (
            <>
              <Link
                className="xp-button xp-button-outline"
                href={`${base}/subjects/${s.id}/lessons/new`}
              >
                إضافة درس
              </Link>
              {(s.lessons?.length ?? 0) > 1 && (
                <OrderEditor
                  key={`lessons-${offering.id}-${s.id}`}
                  items={[...s.lessons!].sort(
                    (a, b) => a.position - b.position,
                  )}
                  offeringId={offering.id}
                  subjectId={s.id}
                />
              )}
            </>
          )}
        </article>
      ))}
    </section>
  );
}
