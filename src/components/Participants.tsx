import { participants } from '@/content/hero';
import FlaskMark from '@/components/FlaskMark';

/**
 * Блок «Наши участники» (ТЗ 4.7). Авто-карусель логотипов, все серые,
 * цвет — при наведении. Формулировка строго «Участники конференции»:
 * ТЗ запрещает называть эти компании партнёрами или клиентами.
 *
 * ⚠️ ЛОГОТИПЫ НЕ ПЕРЕДАНЫ: пакет лежит на Яндекс.Диске заказчика. Пока
 * вместо картинок — названия компаний в единой типографике. Как придут
 * SVG, меняется только содержимое плитки, лента остаётся прежней.
 */
export default function Participants() {
  // Лента едет бесконечно, поэтому набор дублируется: вторая половина
  // подхватывает первую в момент сдвига на -50%
  const row = [...participants, ...participants];

  return (
    <section id="participants" className="relative border-t border-glass-border bg-bg-main py-20 lg:py-24">
      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="mb-3 flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-cyan">
          <FlaskMark />
          Участники конференции
        </div>

        <h2
          className="max-w-[820px] text-[clamp(26px,3.4vw,44px)] font-extrabold leading-[1.15] tracking-tight"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Компании, представители которых были на первой лаборатории
        </h2>
      </div>

      {/* Лента во всю ширину, по краям — растворение в фон */}
      <div className="relative mt-10 overflow-hidden">
        <div className="animate-marquee flex w-max items-center gap-4">
          {row.map((name, i) => (
            <span
              key={i}
              className="flex h-20 min-w-[190px] items-center justify-center rounded-2xl border border-glass-border bg-glass px-7 text-[17px] font-semibold text-text-muted grayscale transition-all duration-300 hover:border-cyan/40 hover:text-white hover:grayscale-0"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {name}
            </span>
          ))}
        </div>

        {/* Маски по краям — чтобы лента уходила в фон, а не обрывалась */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg-main to-transparent lg:w-28"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg-main to-transparent lg:w-28"
        />
      </div>
    </section>
  );
}
