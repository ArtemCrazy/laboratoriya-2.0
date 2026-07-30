'use client';

import { reviews as builtinReviews } from '@/content/hero';
import { useLiveContent } from '@/lib/useLiveContent';
import FlaskMark from '@/components/FlaskMark';
import BlockNote from '@/components/BlockNote';

/**
 * Блок «Отзывы участников» (ТЗ 4.8). Сетка карточек, без автокарусели —
 * ТЗ прямо запрещает бесконечную прокрутку без управления. Текст не
 * обрезается: ключевая мысль должна быть видна целиком.
 *
 * ⚠️ ТЗ просит 5–6 отзывов, заказчик передал два (у второго нет ФИО и фото).
 * Ждём остальные — сетка рассчитана на 3 колонки и добьётся сама.
 */
type Review = { text: string; name: string; role: string; company: string };

export default function Reviews() {
  const reviews = useLiveContent<Review[]>('reviews', builtinReviews as never);

  // Блока нет, пока не добавили ни одного отзыва
  if (!reviews.length) return null;

  return (
    <section id="reviews" className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28">
      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="mb-3 flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-cyan">
          <FlaskMark />
          Отзывы
        </div>

        <h2
          className="max-w-[820px] text-[clamp(26px,3.4vw,44px)] font-extrabold leading-[1.15] tracking-tight"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Что говорили участники первой лаборатории
        </h2>

        <BlockNote section="reviews" />

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={r.text.slice(0, 40)}
              className="flex flex-col rounded-2xl border border-glass-border bg-glass p-6 transition-colors hover:border-cyan/40"
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
