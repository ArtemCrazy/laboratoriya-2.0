'use client';

import { partnerCategories as builtinPartners } from '@/content/hero';
import { mediaSrc } from '@/lib/paths';
import { useLiveContent } from '@/lib/useLiveContent';
import FlaskMark from '@/components/FlaskMark';
import BlockNote from '@/components/BlockNote';
import { useLead } from '@/components/LeadProvider';

/**
 * Блок «Партнёры» (ТЗ 4.10). Категории: генеральный / стратегический /
 * партнёр конференции / партнёр выставки. CTA «Стать партнёром».
 *
 * Партнёрство — отдельный сценарий конверсии (ТЗ §6), не покупка билета,
 * поэтому кнопка открывает свою форму, а не ведёт в общий CTA.
 *
 * Правки 18.08: карточка с логотипом белая. Логотипы приходят без фона,
 * и тёмные элементы пропадали на тёмной подложке. Заливка на уровне
 * карточки, а не файла: иначе логотипы выглядят разнородно.
 *
 * ⚠️ ЛОГОТИПЫ И ССЫЛКИ НЕ ПЕРЕДАНЫ: пока показываем структуру уровней с
 * пустыми слотами. Как придут логотипы с URL — слот заменяется на ссылку
 * с target="_blank" и UTM (требование ТЗ).
 */
type Partner = { name: string; logo: string; url: string };
type Category = { level: string; hidden: boolean; slots: number; partners: Partner[] };

export default function Partners() {
  const openLead = useLead();

  const categories = useLiveContent<Category[]>(
    'partners',
    builtinPartners.map((c) => ({ level: c.level, hidden: false, slots: c.slots, partners: [] })),
  );

  // Скрытый статус не показываем: по нему пакет ещё не продан.
  // Пустой статус без слотов тоже прячем, чтобы не висел голый заголовок.
  const visible = categories.filter((c) => !c.hidden && (c.partners?.length || c.slots > 0));

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
            onClick={() => openLead('partner')}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2.5 self-start rounded-full bg-accent px-5 py-3 text-sm font-semibold text-text-dark transition-colors hover:bg-accent-hover lg:self-auto"
          >
            Стать партнёром
            <IconArrow />
          </button>
        </div>

        <BlockNote section="partners" />

        <div className="mt-12 flex flex-col gap-10">
          {visible.map((c) => {
            const partners = c.partners ?? [];
            // Пустые места дорисовываем только до заявленного количества
            const empty = Math.max(0, c.slots - partners.length);
            const wide = partners.length + empty <= 2;

            return (
              <div key={c.level}>
                <div className="flex items-center gap-4">
                  <span className="text-xs uppercase tracking-[0.18em] text-text-muted">
                    {c.level}
                  </span>
                  <span className="h-px flex-1 bg-glass-border" />
                </div>

                <div
                  className={`mt-5 grid gap-4 ${
                    wide
                      ? 'sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
                  }`}
                >
                  {partners.map((p, i) => {
                    const card = (
                      <span
                        className={`flex items-center justify-center rounded-2xl bg-white px-5 py-3 ring-1 ring-white/15 transition-shadow hover:ring-2 hover:ring-cyan ${
                          wide ? 'h-28' : 'h-20'
                        }`}
                      >
                        {p.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={mediaSrc(p.logo)}
                            alt={p.name}
                            loading="lazy"
                            className="max-h-12 w-auto max-w-full object-contain"
                          />
                        ) : (
                          <span className="text-center text-[14px] font-medium text-text-dark">
                            {p.name}
                          </span>
                        )}
                      </span>
                    );

                    // Ссылки партнёров открываем в новой вкладке (ТЗ 4.10)
                    return p.url ? (
                      <a
                        key={i}
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={p.name}
                      >
                        {card}
                      </a>
                    ) : (
                      <span key={i}>{card}</span>
                    );
                  })}

                  {Array.from({ length: empty }).map((_, i) => (
                    <span
                      key={`empty-${i}`}
                      className={`flex items-center justify-center rounded-2xl border border-dashed border-glass-border bg-glass/50 text-[13px] text-text-muted ${
                        wide ? 'h-28' : 'h-20'
                      }`}
                    >
                      Логотип
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
