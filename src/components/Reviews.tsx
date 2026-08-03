'use client';

import { useRef } from 'react';
import { reviews as builtinReviews } from '@/content/hero';
import { useLiveContent } from '@/lib/useLiveContent';
import FlaskMark from '@/components/FlaskMark';
import BlockNote from '@/components/BlockNote';

/**
 * Блок «Отзывы участников» (ТЗ 4.8). Слайдер на три карточки, листается
 * стрелками и свайпом. Автопрокрутки нет — ТЗ прямо её запрещает.
 *
 * Слайдер, а не сетка: отзывов может быть любое количество, и при четырёх
 * последняя карточка висела в новом ряду одна. Текст не обрезаем, ключевая
 * мысль должна читаться целиком.
 */
type Review = { text: string; name: string; role: string; company: string };

export default function Reviews() {
  const reviews = useLiveContent<Review[]>('reviews', builtinReviews as never);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('figure');
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const atStart = el.scrollLeft <= 4;

    // Зацикливаем, как в карусели спикеров
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir === -1 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    else el.scrollBy({ left: step * dir, behavior: 'smooth' });
  };

  // Блока нет, пока не добавили ни одного отзыва
  if (!reviews.length) return null;

  return (
    <section id="reviews" className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28">
      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="mb-3 flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-cyan">
          <FlaskMark />
          Отзывы
        </div>

        <div className="flex items-end justify-between gap-6">
          <h2
            className="max-w-[820px] text-[clamp(26px,3.4vw,44px)] font-extrabold leading-[1.15] tracking-tight"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            Что говорили участники первой лаборатории
          </h2>

          {/* Стрелки нужны, только если карточки не помещаются разом */}
          {reviews.length > 3 && (
            <div className="hidden shrink-0 gap-2 lg:flex">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                aria-label="Предыдущий отзыв"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-glass-border text-text-muted transition-colors hover:border-cyan/50 hover:text-white"
              >
                <Arrow dir="left" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                aria-label="Следующий отзыв"
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-glass-border text-text-muted transition-colors hover:border-cyan/50 hover:text-white"
              >
                <Arrow dir="right" />
              </button>
            </div>
          )}
        </div>

        <BlockNote section="reviews" />

        <div
          ref={trackRef}
          className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {reviews.map((r) => (
            <figure
              key={r.text.slice(0, 40)}
              className="flex w-[300px] shrink-0 snap-start flex-col rounded-2xl border border-glass-border bg-glass p-6 transition-colors hover:border-cyan/40 sm:w-[380px] lg:w-[calc((100%-2*16px)/3)]"
            >
              <span aria-hidden="true" className="text-4xl leading-none text-cyan/40">
                &laquo;
              </span>

              <blockquote className="mt-3 flex-1 text-[16px] leading-relaxed">{r.text}</blockquote>

              <figcaption className="mt-6 border-t border-glass-border pt-5">
                <span
                  className="block text-[16px] font-bold"
                  style={{ fontFamily: 'var(--font-outfit)' }}
                >
                  {r.name}
                </span>
                <span className="mt-1 block text-sm text-text-muted">{r.role}</span>
                {r.company && (
                  <span className="mt-0.5 block text-sm font-medium text-cyan">{r.company}</span>
                )}
              </figcaption>
            </figure>
          ))}
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
