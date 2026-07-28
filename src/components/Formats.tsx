import { formats } from '@/content/hero';
import FlaskMark from '@/components/FlaskMark';

/**
 * Блок «Форматы участия в программе» (ТЗ §3). Задача блока — показать, что
 * два дня это не только доклады. Карточки-«реактивы»: символ элемента,
 * название формата и что происходит внутри.
 */

/** Цвета берём из дизайн-системы: тот же набор, что у ключевых тем */
const accents: Record<string, string> = {
  cyan: '#00E5FF',
  yellow: '#FFD54F',
  violet: '#A78BFA',
  green: '#A3E635',
  pink: '#F472B6',
};

export default function Formats() {
  return (
    <section id="formats" className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28">
      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="mb-3 flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-cyan">
          <FlaskMark />
          Форматы участия
        </div>

        <h2
          className="max-w-[820px] text-[clamp(26px,3.4vw,44px)] font-extrabold leading-[1.15] tracking-tight"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Шесть форматов, в которых работают участники
        </h2>

        <p className="mt-5 max-w-[640px] text-[17px] leading-relaxed text-text-muted">
          Доклады задают рамку, практические форматы превращают её в решения. Каждый день
          собран так, чтобы вы не только слушали, но и работали над своими задачами.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {formats.map((f) => {
            const color = accents[f.accent];
            return (
              <article
                key={f.title}
                className="group rounded-2xl border border-glass-border bg-glass p-6 transition-colors hover:border-cyan/40"
              >
                {/* Символ-«элемент» в кружке — язык лаборатории без колб */}
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl border text-lg font-extrabold"
                  style={{
                    fontFamily: 'var(--font-outfit)',
                    borderColor: `${color}55`,
                    color,
                    background: `${color}12`,
                  }}
                >
                  {f.symbol}
                </span>

                <h3
                  className="mt-5 text-[20px] font-bold leading-snug"
                  style={{ fontFamily: 'var(--font-outfit)' }}
                >
                  {f.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-text-muted">{f.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
