// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MarketingToolsPage } from './tools-pages';
import { toDataURL } from 'qrcode';
vi.mock('qrcode', () => ({ toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,c2FtcGxl') }));
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); this.dispatchEvent(new Event('close')); };
});
afterEach(cleanup);
describe('marketing tool previews', () => {
  it('validates video and keeps track drafts unpublished', () => {
    render(<MarketingToolsPage page="track-editor" />);
    fireEvent.click(screen.getByRole('button', { name: 'مراجعة المسودة المحلية' }));
    expect(screen.getByText(/أضف رابط HTTPS/)).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByLabelText('اسم المسار'));
    fireEvent.change(screen.getByLabelText('اسم المسار'), { target: { value: 'مسار نموذجي' } });
    fireEvent.change(screen.getByLabelText('لمن هذا المسار؟'), { target: { value: 'جمهور نموذجي' } });
    fireEvent.change(screen.getByLabelText('وصف المدة'), { target: { value: 'وصف تجريبي' } });
    fireEvent.change(screen.getByLabelText('رابط الفيديو التعريفي'), { target: { value: 'https://youtu.be/example' } });
    fireEvent.change(screen.getByLabelText('ماذا سيتعلم الطالب؟'), { target: { value: 'مخرج نموذجي' } });
    fireEvent.click(screen.getByRole('button', { name: 'مراجعة المسودة المحلية' }));
    expect(screen.getByRole('status').textContent).toContain('لم تُحفظ ولم تُنشر');
    fireEvent.change(screen.getByLabelText('اسم المسار'), { target: { value: 'تعديل' } });
    expect(screen.queryByRole('status')).toBeNull();
  });
  it('reviews recipients, restores focus, and invalidates completion after editing', () => {
    render(<MarketingToolsPage page="notifications" />);
    fireEvent.change(screen.getByLabelText('طالب واحد'), { target: { value: 'sample-a' } });
    fireEvent.change(screen.getByLabelText('عنوان الرسالة'), { target: { value: 'عنوان محلي' } });
    fireEvent.change(screen.getByLabelText('نص الرسالة'), { target: { value: 'نص نموذجي' } });
    const trigger = screen.getByRole('button', { name: 'مراجعة الجمهور والرسالة' });
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog').textContent).toContain('الجمهور النموذجي: 1');
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));
    expect(document.activeElement).toBe(trigger);
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'إنهاء المعاينة دون إرسال' }));
    expect(document.activeElement).toBe(trigger);
    expect(screen.getByRole('status').textContent).toContain('لم يُرسل أي إشعار');
    fireEvent.change(screen.getByLabelText('تصفية الجمهور'), { target: { value: 'female' } });
    expect(screen.queryByRole('status')).toBeNull();
    fireEvent.click(trigger);
    expect(screen.getByRole('alert').textContent).toContain('طالب مؤهل');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
  it('never opens an external meeting or simulates a connected call', () => {
    const { container } = render(<MarketingToolsPage page="meeting" />);
    expect(container.querySelector('iframe,a,video')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'التحقق من إتاحة الانضمام' }));
    expect(screen.getByRole('status').textContent).toContain('غير مهيأة');
    fireEvent.change(screen.getByLabelText('مزود اللقاء'), { target: { value: 'meet' } });
    expect(screen.getByText('التضمين داخل الموقع قيد التحقق')).toBeTruthy();
    expect(container.querySelector('iframe,a,video')).toBeNull();
  });
  it('encodes only the same-origin preview verification URL in the QR', async () => {
    render(<MarketingToolsPage page="certificate" />);
    await waitFor(() => expect(screen.getByAltText('رمز QR يفتح صفحة التحقق التجريبية فقط')).toBeTruthy());
    expect(toDataURL).toHaveBeenCalledWith(`${window.location.origin}/preview/marketing/verify`, expect.objectContaining({ margin: 4 }));
    expect(screen.getByText('نموذج شهادة للتصميم فقط')).toBeTruthy();
  });
  it('shows QR failure with retry rather than claiming a valid certificate', async () => {
    vi.mocked(toDataURL).mockRejectedValueOnce(new Error('canvas unavailable'));
    render(<MarketingToolsPage page="certificate" />);
    await waitFor(() => expect(screen.getByText('تعذر إنشاء الرمز.')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'إعادة إنشاء الرمز' }));
    await waitFor(() => expect(screen.getByAltText('رمز QR يفتح صفحة التحقق التجريبية فقط')).toBeTruthy());
  });
});
