import { hero } from '@/content/hero';
import LiquidButton from '@/components/LiquidButton';

/**
 * Финальный CTA (ТЗ §3) — краткое повторение оффера и действия.
 *
 * ⚠️ Формы пока не подключены: по ТЗ §6 нужны модальные окна («Купить билет»,
 * «Получить программу», «Корпоративное участие», «Стать партнёром») с отправкой
 * в CRM. До выбора CRM кнопки ведут на почту — заявка не теряется.
 */
export default function FinalCta() {
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
            Два дня, которые соберут вашу{' '}
            <span className="text-gradient">систему вознаграждения</span>
          </h2>

          <p className="mx-auto mt-6 max-w-[620px] text-[17px] leading-relaxed text-text-muted">
            {hero.dates} · {hero.location}, {hero.locationNote}, {'зал «Архангельск»'}.
            Места ограничены: зал рассчитан на 150–200 участников.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LiquidButton href="#price">{hero.ctaPrimary}</LiquidButton>
            <LiquidButton href="#program" variant="ghost">
              {hero.ctaSecondary}
            </LiquidButton>
          </div>

          <p className="mt-8 text-sm text-text-muted">
            Нужен счёт на компанию или участие командой?{' '}
            <a
              href="mailto:info@cblabconference.ru"
              className="font-medium text-cyan underline-offset-4 transition-colors hover:underline"
            >
              Напишите нам
            </a>{' '}
            — подготовим документы.
          </p>
        </div>
      </div>
    </section>
  );
}
