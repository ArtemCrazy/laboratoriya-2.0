import { audience, audienceTitle } from '@/content/hero';
import { asset } from '@/lib/paths';

/**
 * Блок «Для кого конференция» (ТЗ 4.3).
 * Каждая аудитория — ячейка периодической таблицы: порядковый номер,
 * символ, роль и задачи, с которыми человек приходит на конференцию.
 *
 * Слева — квадратный портрет Менделеева, справа — сама таблица,
 * колонка уже, поэтому ячейки идут сеткой 2×2.
 */
export default function AudienceTable() {
  return (
    <section
      id="audience"
      className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-cyan/[0.06] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="max-w-[880px]">
          <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-cyan">
            <span className="h-px w-8 bg-cyan/50" />
            Для кого конференция
          </div>
          <h2
            className="text-[clamp(26px,3.4vw,44px)] font-extrabold leading-[1.15] tracking-tight"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            {audienceTitle}
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(320px,0.85fr)_1.15fr] lg:gap-8">
          {/* --- Портрет: строгий квадрат --- */}
          <figure className="relative aspect-square overflow-hidden rounded-2xl border border-glass-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset('/img/mendeleev.webp')}
              alt="Мраморный бюст Дмитрия Менделеева в тёмных очках"
              width={1000}
              height={1000}
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-bg-main via-bg-main/60 to-transparent" />
            <figcaption className="absolute bottom-5 left-6 right-6">
              <div
                className="text-2xl font-extrabold leading-none text-white"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                Своя таблица
              </div>
              <p className="mt-2 text-[15px] leading-snug text-text-muted">
                Только вместо элементов — те, кто отвечает за вознаграждение и мотивацию
              </p>
            </figcaption>
          </figure>

          {/* --- Таблица аудиторий --- */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {audience.map((a, i) => (
              <article
                key={a.symbol}
                className="animate-rise group flex flex-col rounded-2xl border border-glass-border bg-glass p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/50 hover:bg-glass-hover hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-[13px] text-text-muted">{a.num}</span>
                  <span className="h-2 w-2 rounded-full bg-cyan/30 transition-colors group-hover:bg-cyan" />
                </div>

                <div
                  className="mt-2 text-[clamp(36px,3vw,46px)] font-extrabold leading-none text-white transition-colors group-hover:text-cyan"
                  style={{ fontFamily: 'var(--font-outfit)' }}
                >
                  {a.symbol}
                </div>

                <div className="mt-4 border-t border-glass-border pt-4">
                  <h3
                    className="text-[18px] font-bold leading-tight"
                    style={{ fontFamily: 'var(--font-outfit)' }}
                  >
                    {a.role}
                  </h3>
                  {/* 16px — нижняя граница по ТЗ 5.2 для основного текста */}
                  <p className="mt-2.5 text-base leading-relaxed text-text-muted">{a.task}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
