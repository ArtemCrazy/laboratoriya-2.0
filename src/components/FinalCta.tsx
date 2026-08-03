'use client';

import { hero } from '@/content/hero';
import LiquidButton from '@/components/LiquidButton';
import { useLead } from '@/components/LeadProvider';

/**
 * Финальный CTA (ТЗ §3) — краткое повторение оффера и действия.
 * Кнопки открывают формы заявок, заявка уходит в панель управления и на почту.
 */
export default function FinalCta() {
  const openLead = useLead();
  return (
    <section
      id="final-cta"
      className="relative overflow-hidden border-t border-glass-border bg-bg-main py-20 lg:py-28"
    >
      {/* Световые пятна — рифма с первым экраном, композиция закольцовывается */}
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute -left-20 top-0 h-[420px] w-[420px] rounded-full bg-cyan/10 blur-[130px]" />
        <div className="absolute -right-20 bottom-0 h-[380px] w-[380px] rounded-full bg-accent/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="mx-auto max-w-[860px] text-center">
          <h2
            className="text-[clamp(28px,3.8vw,50px)] font-extrabold leading-[1.12] tracking-tight"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            Два дня, которые помогут усилить вашу{' '}
            <span className="text-gradient">систему мотивации персонала</span>
          </h2>

          <p className="mx-auto mt-6 max-w-[620px] text-[17px] leading-relaxed text-text-muted">
            {hero.dates} · {hero.location}, {hero.locationNote}, {'зал «Архангельск»'}.
            Места ограничены: зал рассчитан на 150–200 участников.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LiquidButton onClick={() => openLead('ticket')}>{hero.ctaPrimary}</LiquidButton>
            <LiquidButton onClick={() => openLead('program')} variant="ghost">
              {hero.ctaSecondary}
            </LiquidButton>
          </div>

          <p className="mt-8 text-sm text-text-muted">
            Нужен счёт на компанию или участие командой?{' '}
            <button
              type="button"
              onClick={() => openLead('quote')}
              className="cursor-pointer font-medium text-cyan underline-offset-4 transition-colors hover:underline"
            >
              Запросите расчёт
            </button>{' '}
            — подготовим документы.
          </p>
        </div>
      </div>
    </section>
  );
}
