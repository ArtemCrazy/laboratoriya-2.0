'use client';

import { pricing as builtinPricing } from '@/content/hero';
import { useLiveContent } from '@/lib/useLiveContent';
import FlaskMark from '@/components/FlaskMark';
import BlockNote from '@/components/BlockNote';

/**
 * Блок «Стоимость и покупка» (ТЗ 4.9). Три тарифа, рекомендуемый выделен.
 *
 * Правки 29.07: цена ушла вниз карточки, под состав пакета; «Выставить счёт»
 * и корпоративный пакет убраны, остался «Купить билет»; под карточками
 * «НДС 0%». Матрицу сравнения не строим: состав тарифов виден в карточках,
 * отличается только число дней — таблица дублировала бы их.
 */
type PricingData = typeof builtinPricing;

export default function Pricing() {
  // Тарифы и цены заказчик правит в админке (ТЗ §6)
  const pricing = useLiveContent<PricingData>('pricing', builtinPricing);

  return (
    <section id="price" className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28">
      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="mb-3 flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-cyan">
          <FlaskMark />
          Стоимость
        </div>

        <h2
          className="max-w-[820px] text-[clamp(26px,3.4vw,44px)] font-extrabold leading-[1.15] tracking-tight"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Форматы участия и цены
        </h2>

        <BlockNote section="pricing" />

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {pricing.tariffs.map((t) => (
            <article
              key={t.name}
              className={`relative flex flex-col rounded-2xl border p-7 lg:p-8 ${
                t.recommended
                  ? 'border-accent/60 bg-accent/[0.06]'
                  : 'border-glass-border bg-glass'
              }`}
            >
              {t.recommended && (
                <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-text-dark">
                  Рекомендуем
                </span>
              )}

              <h3
                className="text-[24px] font-extrabold leading-tight"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                Тариф «{t.name}»
              </h3>
              <p className="mt-2 text-sm text-text-muted">{t.audience}</p>

              <ul className="mt-7 flex-1 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15px] leading-snug">
                    <span
                      className={`mt-0.5 shrink-0 ${t.recommended ? 'text-accent' : 'text-cyan'}`}
                    >
                      <IconCheck />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Цена внизу карточки, после состава пакета (правки 29.07) */}
              <div className="mt-8 border-t border-glass-border pt-6">
                <div
                  className={`text-[clamp(30px,3.2vw,40px)] font-extrabold leading-none ${
                    t.recommended ? 'text-accent' : 'text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-outfit)' }}
                >
                  {t.price}
                </div>
                <p className="mt-2.5 text-[14px] leading-snug text-text-muted">
                  {pricing.earlyDeadline} —{' '}
                  <span className="font-semibold text-cyan">{t.earlyPrice}</span>
                </p>

                <a
                  href="#final-cta"
                  className={`mt-6 block rounded-full py-3.5 text-center text-sm font-semibold transition-colors ${
                    t.recommended
                      ? 'bg-accent text-text-dark hover:bg-accent-hover'
                      : 'border border-glass-border bg-glass hover:border-cyan/50 hover:text-cyan'
                  }`}
                >
                  Купить билет
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-[15px] text-text-muted">{pricing.note}</p>
      </div>
    </section>
  );
}

function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 10.4l3.4 3.4L15.5 6.7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
