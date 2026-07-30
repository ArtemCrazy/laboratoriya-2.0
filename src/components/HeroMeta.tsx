'use client';

import { hero } from '@/content/hero';
import { useLiveContent } from '@/lib/useLiveContent';

export type HeroMetaData = {
  dates: string;
  location: string;
  locationNote: string;
  hall: string;
};

export const builtinHeroMeta: HeroMetaData = {
  dates: hero.dates,
  location: hero.location,
  locationNote: hero.locationNote,
  hall: 'зал «Архангельск»',
};

/**
 * Дата и место на первом экране (правки 29.07: крупнее и над кнопками).
 * Значения заказчик меняет в админке — даты правятся чаще всего (ТЗ §6).
 */
export default function HeroMeta() {
  const meta = useLiveContent<HeroMetaData>('hero', builtinHeroMeta);

  return (
    <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[clamp(16px,1.35vw,20px)] font-semibold">
      <span className="flex items-center gap-2.5">
        <span className="text-cyan">
          <IconCalendar />
        </span>
        {meta.dates}
      </span>
      <span className="text-cyan-dim">|</span>
      <span className="flex items-center gap-2.5">
        <span className="text-accent">
          <IconPin />
        </span>
        {[meta.location, meta.locationNote, meta.hall].filter(Boolean).join(', ')}
      </span>
    </div>
  );
}

function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 14.5s5-4.6 5-8a5 5 0 0 0-10 0c0 3.4 5 8 5 8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.4" r="1.7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
