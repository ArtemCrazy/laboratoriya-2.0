'use client';

import { useState } from 'react';
import { partnerCategories } from '@/content/hero';
import FlaskMark from '@/components/FlaskMark';
import PartnerModal from '@/components/PartnerModal';

/**
 * Блок «Партнёры» (ТЗ 4.10). Категории: генеральный / стратегический /
 * партнёр конференции / партнёр выставки. CTA «Стать партнёром».
 *
 * Партнёрство — отдельный сценарий конверсии (ТЗ §6), не покупка билета,
 * поэтому кнопка открывает свою форму, а не ведёт в общий CTA.
 *
 * ⚠️ ЛОГОТИПЫ И ССЫЛКИ НЕ ПЕРЕДАНЫ: пока показываем структуру уровней с
 * пустыми слотами. Как придут логотипы с URL — слот заменяется на ссылку
 * с target="_blank" и UTM (требование ТЗ).
 */
export default function Partners() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="partners" className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28">
      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="mb-3 flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-cyan">
          <FlaskMark />
          Партнёры
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2
            className="max-w-[820px] text-[clamp(26px,3.4vw,44px)] font-extrabold leading-[1.15] tracking-tight"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            Компании, которые делают лабораторию вместе с нами
          </h2>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2.5 self-start rounded-full bg-accent px-5 py-3 text-sm font-semibold text-text-dark transition-colors hover:bg-accent-hover lg:self-auto"
          >
            Стать партнёром
            <IconArrow />
          </button>
        </div>

        {/* Правки 29.07: статус без партнёров со страницы убирается —
            достаточно поставить ему slots: 0 в контенте */}
        <div className="mt-12 flex flex-col gap-10">
          {partnerCategories
            .filter((c) => c.slots > 0)
            .map((c) => (
              <div key={c.level}>
                <div className="flex items-center gap-4">
                  <span className="text-xs uppercase tracking-[0.18em] text-text-muted">
                    {c.level}
                  </span>
                  <span className="h-px flex-1 bg-glass-border" />
                </div>

                <div
                  className={`mt-5 grid gap-4 ${
                    c.slots <= 2
                      ? 'sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
                  }`}
                >
                  {Array.from({ length: c.slots }).map((_, i) => (
                    <span
                      key={i}
                      className={`flex items-center justify-center rounded-2xl border border-dashed border-glass-border bg-glass/50 text-[13px] text-text-muted ${
                        c.slots === 1 ? 'h-28' : 'h-20'
                      }`}
                    >
                      Логотип
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      <PartnerModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}

function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10m0 0-4-4m4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
