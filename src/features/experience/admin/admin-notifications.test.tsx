// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MessageComposer } from './admin-workspaces';

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new Event('close')); };
});
afterEach(cleanup);

function fillMessage() {
  fireEvent.change(screen.getByLabelText('عنوان الرسالة'), { target: { value: 'تذكير دراسي نموذجي' } });
  fireEvent.change(screen.getByLabelText('نص الرسالة'), { target: { value: 'نص للمعاينة المحلية فقط' } });
}
function expectRecipients(names: string[]) {
  const region = screen.getByRole('heading', { name: 'الجمهور النموذجي بعد التصفية' }).closest('section')!;
  const list = within(region).queryByRole('list');
  expect(list ? within(list).getAllByRole('listitem').map(item => item.textContent) : []).toEqual(names);
}

describe('ADMIN-NOTIFY-20261023 administrative audience preview', () => {
  it('validates before review and keeps admin permission wording separate from teacher wording', () => {
    render(<MessageComposer />);
    fireEvent.click(screen.getByRole('button', { name: 'مراجعة الجمهور والرسالة' }));
    expect(screen.getByRole('alert').textContent).toContain('اختر جمهورًا');
    expect(document.activeElement).toBe(screen.getByLabelText('عنوان الرسالة'));
    expect(screen.getByText(/صلاحية مسؤول الإشعارات/)).toBeTruthy();
    expect(screen.queryByText(/صلاحية المعلم/)).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('selects one student or a manual list and intersects explicit gender', () => {
    render(<MessageComposer />);
    fireEvent.change(screen.getByLabelText('طالب واحد'), { target: { value: 'sample-b' } });
    expectRecipients(['طالبة نموذجية ب']);
    fireEvent.change(screen.getByLabelText('نوع الجمهور'), { target: { value: 'selected' } });
    expectRecipients([]);
    fireEvent.click(screen.getByRole('checkbox', { name: 'طالب نموذجي أ' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'طالبة نموذجية ب' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'متعلم نموذجي هـ' }));
    expectRecipients(['طالب نموذجي أ', 'طالبة نموذجية ب', 'متعلم نموذجي هـ']);
    fireEvent.change(screen.getByLabelText('تصفية الجمهور'), { target: { value: 'male' } });
    expectRecipients(['طالب نموذجي أ']);
    fireEvent.change(screen.getByLabelText('تصفية الجمهور'), { target: { value: 'female' } });
    expectRecipients(['طالبة نموذجية ب']);
    expect(screen.queryByRole('checkbox', { name: 'سجل خارج النطاق التجريبي' })).toBeNull();
  });

  it.each([
    ['track', 'مسار', 'start', ['طالب نموذجي أ', 'طالبة نموذجية ب', 'متعلم نموذجي هـ']],
    ['group', 'مجموعة', 'group-a', ['طالب نموذجي أ', 'طالبة نموذجية ب', 'متعلم نموذجي هـ']],
    ['stage', 'مرحلة تعليمية', 'stage-b', ['طالب نموذجي ج', 'طالبة نموذجية د', 'متعلم نموذجي هـ']],
  ])('supports %s membership without broadening the audience', (mode, label, value, names) => {
    render(<MessageComposer />);
    fireEvent.change(screen.getByLabelText('نوع الجمهور'), { target: { value: mode } });
    fireEvent.change(screen.getByLabelText(label as string), { target: { value } });
    expectRecipients(names as string[]);
    fireEvent.change(screen.getByLabelText('تصفية الجمهور'), { target: { value: 'female' } });
    expectRecipients([(names as string[])[1]]);
  });

  it('cancels with focus restoration and never sends, persists or retains stale confirmation', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const storageSpy = vi.spyOn(Storage.prototype, 'setItem');
    render(<MessageComposer />);
    fireEvent.change(screen.getByLabelText('نوع الجمهور'), { target: { value: 'track' } });
    fireEvent.change(screen.getByLabelText('مسار'), { target: { value: 'start' } });
    fillMessage();
    const trigger = screen.getByRole('button', { name: 'مراجعة الجمهور والرسالة' });
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog').textContent).toContain('الجمهور النموذجي: 3');
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'إنهاء المعاينة دون إرسال' }));
    expect(screen.getByRole('status').textContent).toContain('لم يُرسل أي إشعار');
    fireEvent.change(screen.getByLabelText('تصفية الجمهور'), { target: { value: 'male' } });
    expect(screen.queryByRole('status')).toBeNull();
    expectRecipients(['طالب نموذجي أ']);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(storageSpy).not.toHaveBeenCalled();
  });

  it('preserves the existing campaign composer', () => {
    render(<MessageComposer campaign />);
    expect(screen.getByRole('heading', { name: 'محتوى الحملة' })).toBeTruthy();
    expect(screen.queryByLabelText('نوع الجمهور')).toBeNull();
    fireEvent.change(screen.getByLabelText(/عنوان الرسالة/), { target: { value: 'حملة نموذجية' } });
    fireEvent.change(screen.getByLabelText(/نص الرسالة/), { target: { value: 'نص نموذج محلي' } });
    fireEvent.click(screen.getByRole('button', { name: 'تطبيق محلي للمعاينة' }));
    expect(screen.getByRole('status').textContent).toContain('لم تُرسل أي رسالة');
  });
});
