'use client';

import { useRef } from 'react';
import { speakers, speakerThemes } from '@/content/hero';
import { asset } from '@/lib/paths';
import FlaskMark from '@/components/FlaskMark';

/**
 * Блок «Спикеры» (правки 24.07) — горизонтальная карусель вместо молекулы.
 * Молекулярная схема ушла в «Ключевые темы»: спикеров будет 30+, в молекуле
 * они бы перегрузились. На десктопе видно 4–5 карточек, есть стрелки,
 * на мобильном — свайп. Прокрутка зациклена: с конца перескакивает в начало.
 *
 * Данные и фото — реальные спикеры первой конференции (cblabconference.ru).
 */
export default function SpeakersCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('article');
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const atStart = el.scrollLeft <= 4;

    // Зацикливание: со стрелки в конце — в начало, и наоборот
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir === -1 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    else el.scrollBy({ left: step * dir, behavior: 'smooth' });
  };

  return (
    <section id="speakers" className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28">
      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="mb-3 flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-cyan">
          <FlaskMark />
          Спикеры
        </div>

        <div className="flex items-end justify-between gap-6">
          <h2
            className="max-w-[820px] text-[clamp(26px,3.4vw,44px)] font-extrabold leading-[1.15] tracking-tight"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            Практики, которые строят системы вознаграждения в крупных компаниях
          </h2>

          {/* Стрелки навигации — десктоп */}
          <div className="hidden shrink-0 gap-2 lg:flex">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              aria-label="Назад"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-glass-border text-text-muted transition-colors hover:border-cyan/50 hover:text-white"
            >
              <Arrow dir="left" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              aria-label="Вперёд"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-glass-border text-text-muted transition-colors hover:border-cyan/50 hover:text-white"
            >
              <Arrow dir="right" />
            </button>
          </div>
        </div>

        {/* Дорожка карусели: нативный скролл + snap, свайп на мобильном */}
        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {speakers.map((s) => {
            const color = speakerThemes[s.theme];
            return (
              <article
                key={s.name}
                className="w-[240px] shrink-0 snap-start overflow-hidden rounded-2xl border border-glass-border bg-glass transition-colors hover:border-cyan/40 sm:w-[260px] lg:w-[calc((100%-4*16px)/5)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(s.photo)}
                    alt={`${s.name}, ${s.role}, ${s.company}`}
                    width={400}
                    height={500}
                    className="h-full w-full object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
                    style={{ background: `linear-gradient(to top, ${color}22, transparent)` }}
                  />
                </div>
                <div className="p-4">
                  <div
                    className="text-[17px] font-bold leading-tight"
                    style={{ fontFamily: 'var(--font-outfit)' }}
                  >
                    {s.name}
                  </div>
                  <div className="mt-1.5 text-sm leading-snug text-text-muted">{s.role}</div>
                  <div className="mt-1 text-sm font-medium" style={{ color }}>
                    {s.company}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d={dir === 'right' ? 'M6 3l6 6-6 6' : 'M12 3L6 9l6 6'}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
