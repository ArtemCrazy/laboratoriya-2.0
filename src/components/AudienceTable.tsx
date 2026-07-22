import { audience, audienceTitle } from '@/content/hero';

/**
 * Блок «Для кого конференция» (ТЗ 4.3) в виде таблицы Менделеева:
 * каждая аудитория — ячейка элемента с порядковым номером и символом.
 * Метафора продолжает «лабораторию» первого экрана.
 */
export default function AudienceTable() {
  return (
    <section id="audience" className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28">
      {/* Мягкая подсветка, чтобы блок не читался плоским продолжением экрана */}
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

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {audience.map((a, i) => (
            <article
              key={a.symbol}
              className="animate-rise group flex flex-col rounded-2xl border border-glass-border bg-glass p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/50 hover:bg-glass-hover hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Шапка ячейки — как в периодической таблице */}
              <div className="flex items-start justify-between">
                <span className="text-[13px] text-text-muted">{a.num}</span>
                <span className="h-2 w-2 rounded-full bg-cyan/30 transition-colors group-hover:bg-cyan" />
              </div>

              <div
                className="mt-3 text-[clamp(40px,4vw,54px)] font-extrabold leading-none text-white transition-colors group-hover:text-cyan"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                {a.symbol}
              </div>

              <div className="mt-5 border-t border-glass-border pt-5">
                <h3
                  className="text-[19px] font-bold leading-tight"
                  style={{ fontFamily: 'var(--font-outfit)' }}
                >
                  {a.role}
                </h3>
                {/* 16px — нижняя граница по ТЗ 5.2 для основного текста */}
                <p className="mt-3 text-base leading-relaxed text-text-muted">{a.task}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
