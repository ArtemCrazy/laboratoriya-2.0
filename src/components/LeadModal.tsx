'use client';

import { useEffect, useState } from 'react';
import { asset } from '@/lib/paths';

/**
 * Формы заявок с сайта (ТЗ §6, правки 31.07 — «как на первой странице»).
 *
 * Один компонент на все сценарии: набор полей отличается, а логика отправки,
 * согласия и экран благодарности общие. Заявка уходит в панель управления и
 * дублируется письмом — заказчик сверяет по панели, потому что письма
 * попадали в спам.
 */

export type LeadType = 'ticket' | 'quote' | 'program' | 'partner';

type FieldKey = 'name' | 'company' | 'role' | 'email' | 'phone' | 'promo' | 'people' | 'comment';

type FieldDef = { key: FieldKey; label: string; type?: string; required?: boolean; half?: boolean };

const BASE: FieldDef[] = [
  { key: 'name', label: 'Имя и фамилия', required: true, half: true },
  { key: 'company', label: 'Компания', required: true, half: true },
  { key: 'role', label: 'Должность', half: true },
  { key: 'email', label: 'Рабочий email', type: 'email', required: true, half: true },
  { key: 'phone', label: 'Телефон', type: 'tel', required: true, half: true },
];

const CONFIG: Record<
  LeadType,
  { title: string; lead: string; submit: string; done: string; fields: FieldDef[] }
> = {
  ticket: {
    title: 'Регистрация на конференцию',
    lead: 'Оставьте заявку, и мы свяжемся с вами для подтверждения.',
    submit: 'Отправить заявку',
    done: 'Мы получили ваши данные и свяжемся с вами для подтверждения регистрации.',
    fields: [...BASE, { key: 'promo', label: 'Промокод', half: true }],
  },
  quote: {
    title: 'Расчёт для команды',
    lead: 'Стоимость зависит от количества участников. Оставьте заявку, и мы пришлём расчёт.',
    submit: 'Запросить расчёт',
    done: 'Мы получили заявку и пришлём расчёт для вашей команды.',
    fields: [
      ...BASE,
      { key: 'people', label: 'Сколько участников', half: true },
      { key: 'comment', label: 'Комментарий' },
    ],
  },
  program: {
    title: 'Программа конференции',
    lead: 'Оставьте контакты, и мы пришлём программу двух дней.',
    submit: 'Получить программу',
    done: 'Мы получили заявку и пришлём программу на указанную почту.',
    fields: [
      { key: 'name', label: 'Имя и фамилия', required: true, half: true },
      { key: 'company', label: 'Компания', required: true, half: true },
      { key: 'role', label: 'Должность', half: true },
      { key: 'email', label: 'Рабочий email', type: 'email', required: true, half: true },
    ],
  },
  partner: {
    title: 'Стать партнёром конференции',
    lead: 'Расскажите о компании — пришлём презентацию с форматами участия и условиями.',
    submit: 'Отправить заявку',
    done: 'Мы получили заявку и пришлём партнёрскую презентацию.',
    fields: [...BASE, { key: 'comment', label: 'Интересующий формат' }],
  },
};

export default function LeadModal({
  type,
  tariff,
  onClose,
}: {
  type: LeadType | null;
  /** Выбранный тариф подставляется в заявку (ТЗ 4.9) */
  tariff?: string;
  onClose: () => void;
}) {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type) return;
    setSent(false);
    setError(null);

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [type, onClose]);

  if (!type) return null;
  const cfg = CONFIG[type];

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const fields: Record<string, string> = {};
    form.forEach((v, k) => {
      if (k !== 'consent' && k !== 'website') fields[k] = String(v);
    });
    if (tariff) fields.tariff = tariff;

    try {
      const res = await fetch(asset('/api/leads.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, fields, website: form.get('website') || '' }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) throw new Error(data?.error || 'Не удалось отправить заявку');
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить заявку');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-bg-main/90 p-4 backdrop-blur-sm sm:items-center sm:p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-[580px] rounded-2xl border border-glass-border bg-bg-deep p-6 sm:p-9"
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
              id="lead-modal-title"
              className="mt-6 text-[24px] font-extrabold leading-tight"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              Спасибо за заявку!
            </h2>
            <p className="mx-auto mt-3 max-w-[400px] text-[15px] leading-relaxed text-text-muted">
              {cfg.done}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 cursor-pointer rounded-full bg-accent px-7 py-3 text-sm font-semibold text-text-dark transition-colors hover:bg-accent-hover"
            >
              Отлично
            </button>
          </div>
        ) : (
          <>
            <h2
              id="lead-modal-title"
              className="pr-10 text-[clamp(22px,2.6vw,28px)] font-extrabold leading-tight"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {cfg.title}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-text-muted">{cfg.lead}</p>

            {tariff && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan/35 bg-cyan/[0.07] px-4 py-2 text-[13px] font-medium text-cyan">
                Пакет участия: {tariff}
              </p>
            )}

            <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {cfg.fields.map((f) => (
                  <label
                    key={f.key}
                    className={`flex flex-col gap-2 ${f.half ? '' : 'sm:col-span-2'}`}
                  >
                    <span className="text-[13px] font-medium text-text-muted">
                      {f.label}
                      {f.required && <span className="ml-1 text-cyan">*</span>}
                    </span>
                    <input
                      type={f.type ?? 'text'}
                      name={f.key}
                      required={f.required}
                      autoComplete={AUTOCOMPLETE[f.key]}
                      className="rounded-xl border border-glass-border bg-glass px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-cyan/60"
                    />
                  </label>
                ))}
              </div>

              {/* Ловушка для ботов: люди этого поля не видят */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <label className="mt-1 flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-text-muted">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-cyan"
                />
                Согласен с политикой конфиденциальности, согласием на обработку персональных
                данных и публичной офертой
              </label>

              {error && (
                <p className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-2.5 text-[13px] text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="mt-2 cursor-pointer rounded-full bg-accent py-3.5 text-sm font-semibold text-text-dark transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? 'Отправляем…' : cfg.submit}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const AUTOCOMPLETE: Record<FieldKey, string | undefined> = {
  name: 'name',
  company: 'organization',
  role: 'organization-title',
  email: 'email',
  phone: 'tel',
  promo: 'off',
  people: 'off',
  comment: 'off',
};

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
