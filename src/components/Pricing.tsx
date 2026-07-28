import { pricing } from '@/content/hero';
import FlaskMark from '@/components/FlaskMark';

/**
 * Блок «Стоимость и покупка» (ТЗ 4.9). Тарифы из дополнений 27.07,
 * рекомендуемый выделен. CTA «Купить» и «Выставить счёт», ниже —
 * корпоративный пакет от 3 участников.
 *
 * ⚠️ РАСХОЖДЕНИЕ С ТЗ: ТЗ 4.9 требует 3 тарифа, заказчик прислал 2
 * («Один день» / «Два дня»). Дата дедлайна скидки 10% в документе не
 * заполнена — стоит плейсхолдер, уточняем у заказчика.
 * Матрицу сравнения не строим: составы тарифов совпадают, отличается
 * только число дней — таблица была бы пустой.
 */
export default function Pricing() {
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

        <p className="mt-5 text-[15px] text-text-muted">{pricing.note}</p>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
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

              <div
                className={`mt-6 text-[clamp(32px,3.6vw,44px)] font-extrabold leading-none ${
                  t.recommended ? 'text-accent' : 'text-white'
                }`}
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                {t.price}
              </div>

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

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#final-cta"
                  className={`flex-1 rounded-full py-3.5 text-center text-sm font-semibold transition-colors ${
                    t.recommended
                      ? 'bg-accent text-text-dark hover:bg-accent-hover'
                      : 'border border-glass-border bg-glass hover:border-cyan/50 hover:text-cyan'
                  }`}
                >
                  Купить билет
                </a>
                <a
                  href="#final-cta"
                  className="flex-1 rounded-full border border-glass-border py-3.5 text-center text-sm font-semibold text-text-muted transition-colors hover:border-cyan/50 hover:text-cyan"
                >
                  Выставить счёт
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Корпоративное участие — снимает барьер закупки от компании */}
        <div className="mt-5 flex flex-col gap-5 rounded-2xl border border-glass-border bg-glass p-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[16px] leading-relaxed">{pricing.corporate}</p>
          <a
            href="#final-cta"
            className="inline-flex shrink-0 items-center gap-2.5 self-start rounded-full border border-cyan/50 px-5 py-3 text-sm font-semibold text-cyan transition-colors hover:bg-cyan/10 sm:self-auto"
          >
            Корпоративная заявка
            <IconArrow />
          </a>
        </div>
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
