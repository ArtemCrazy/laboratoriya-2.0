import { participants } from '@/content/hero';
import { asset } from '@/lib/paths';
import FlaskMark from '@/components/FlaskMark';

/**
 * Блок «Наши участники» (ТЗ 4.7). Авто-карусель логотипов: нейтральный вид,
 * подсветка при наведении. Формулировка строго «Участники конференции» —
 * ТЗ запрещает называть эти компании партнёрами или клиентами.
 *
 * Логотипы белые с прозрачностью, поэтому «серость» задаётся прозрачностью,
 * а не цветом файла: так все девять выглядят одинаково по плотности.
 * Цветных версий заказчик не передавал, поэтому hover — подсветка до белого.
 */
export default function Participants() {
  /**
   * Лента едет на -50% и должна стыковаться без шва, поэтому:
   * 1) половина ленты обязана быть шире экрана, иначе справа появляется
   *    пустота — набор из девяти логотипов на широком мониторе не покрывает
   *    ширину, поэтому в половину кладём набор дважды;
   * 2) отступ вшит в саму карточку (mr-3), а не задан через gap: gap между
   *    половинами не учитывается в 50%, и на стыке лента дёргается.
   */
  const half = [...participants, ...participants];
  const row = [...half, ...half];

  return (
    <section
      id="participants"
      className="relative border-t border-glass-border bg-bg-main py-20 lg:py-24"
    >
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

      <div className="relative mt-12 overflow-hidden">
        <div className="animate-marquee flex w-max items-center">
          {row.map((p, i) => (
            <span
              key={i}
              className="group mr-3 flex h-24 w-[210px] shrink-0 items-center justify-center rounded-2xl border border-glass-border bg-glass px-7 transition-colors hover:border-cyan/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(p.logo)}
                alt={p.name}
                width={400}
                height={130}
                loading="lazy"
                // Логотипы разной ширины, поэтому ограничиваем и высоту, и ширину
                className="max-h-9 w-auto max-w-full opacity-55 transition-opacity duration-300 group-hover:opacity-100"
              />
            </span>
          ))}
        </div>

        {/* Края растворяются в фон, чтобы лента не обрывалась */}
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
