'use client';

import { useEffect, useState } from 'react';

/**
 * Форма «Стать партнёром» (ТЗ §6). Отдельный сценарий: это не покупка билета
 * и не запрос программы, поэтому и форма своя — уходит в партнёрскую воронку.
 *
 * Поля по ТЗ: имя, компания, должность, email, телефон, интересующий формат
 * и согласие на обработку данных.
 *
 * ⚠️ Отправки пока нет: CRM и почтовый сервис не подключены (ТЗ §6 «Функц.
 * требования»). Форма валидируется и показывает экран успеха, заявка никуда
 * не уходит — подключим, как появятся доступы.
 */

const FORMATS = [
  'Генеральный партнёр',
  'Стратегический партнёр',
  'Партнёр конференции',
  'Партнёр выставки',
  'Ещё не определились',
];

export default function PartnerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [sent, setSent] = useState(false);

  // Esc закрывает, фон под окном не прокручивается
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // Следующее открытие показывает чистую форму, а не прошлый экран успеха
  useEffect(() => {
    if (!open) setSent(false);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-bg-main/90 p-4 backdrop-blur-sm sm:items-center sm:p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-[560px] rounded-2xl border border-glass-border bg-bg-deep p-6 sm:p-9"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-4 top-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-glass-border text-text-muted transition-colors hover:border-cyan/50 hover:text-white"
        >
          <IconClose />
        </button>

        {sent ? (
          <div className="py-8 text-center">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan/50 text-cyan">
              <IconCheck />
            </span>
            <h2
              id="partner-modal-title"
              className="mt-6 text-[24px] font-extrabold leading-tight"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              Заявка отправлена
            </h2>
            <p className="mx-auto mt-3 max-w-[380px] text-[15px] leading-relaxed text-text-muted">
              Свяжемся с вами и пришлём партнёрскую презентацию с форматами
              и условиями участия.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 cursor-pointer rounded-full bg-accent px-7 py-3 text-sm font-semibold text-text-dark transition-colors hover:bg-accent-hover"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div className="mb-1 text-xs uppercase tracking-[0.22em] text-cyan">Партнёрство</div>
            <h2
              id="partner-modal-title"
              className="pr-10 text-[clamp(22px,2.6vw,28px)] font-extrabold leading-tight"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              Стать партнёром конференции
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-muted">
              Расскажите о компании — пришлём презентацию с форматами участия
              и условиями.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="mt-7 flex flex-col gap-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Имя" name="name" autoComplete="name" required />
                <Field label="Компания" name="company" autoComplete="organization" required />
                <Field label="Должность" name="role" autoComplete="organization-title" />
                <Field
                  label="Рабочий email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>

              <Field label="Телефон" name="phone" type="tel" autoComplete="tel" required />

              <label className="flex flex-col gap-2">
                <span className="text-[13px] font-medium text-text-muted">
                  Интересующий формат
                </span>
                <select
                  name="format"
                  defaultValue={FORMATS[FORMATS.length - 1]}
                  className="cursor-pointer rounded-xl border border-glass-border bg-glass px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-cyan/60"
                >
                  {FORMATS.map((f) => (
                    <option key={f} value={f} className="bg-bg-deep">
                      {f}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-1 flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-text-muted">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-cyan"
                />
                Согласен на обработку персональных данных и получение ответа
                по указанным контактам
              </label>

              <button
                type="submit"
                className="mt-3 cursor-pointer rounded-full bg-accent py-3.5 text-sm font-semibold text-text-dark transition-colors hover:bg-accent-hover"
              >
                Отправить заявку
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] font-medium text-text-muted">
        {label}
        {required && <span className="ml-1 text-cyan">*</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className="rounded-xl border border-glass-border bg-glass px-4 py-3 text-[15px] text-white outline-none transition-colors placeholder:text-text-muted/60 focus:border-cyan/60"
      />
    </label>
  );
}

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
