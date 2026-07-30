'use client';

import { useLiveContent } from '@/lib/useLiveContent';

/**
 * Сноска к блоку — короткая пометка под заголовком.
 *
 * Заказчик задаёт её в админке и убирает, когда она перестала быть нужной:
 * например, пока в «Спикерах» состав прошлой конференции. Пустая сноска
 * ничего не рисует, поэтому блок выглядит как обычно.
 */
export default function BlockNote({ section }: { section: string }) {
  const notes = useLiveContent<Record<string, string>>('notes', {});
  const text = notes?.[section]?.trim();

  if (!text) return null;

  return (
    <p className="mt-4 inline-flex items-start gap-2.5 rounded-xl border border-accent/35 bg-accent/[0.07] px-4 py-2.5 text-[14px] leading-snug text-accent">
      <span aria-hidden="true" className="mt-px shrink-0">
        <IconInfo />
      </span>
      {text}
    </p>
  );
}

function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.3" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 7.2v4M8 4.9v.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
