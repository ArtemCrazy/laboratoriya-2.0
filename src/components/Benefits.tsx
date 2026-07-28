import { benefits } from '@/content/hero';
import FlaskMark from '@/components/FlaskMark';

/**
 * Блок «Что получит участник» (ТЗ §3) — конкретные результаты и материалы.
 * Список с чек-маркерами: без карточек, чтобы блок читался как итог, а не
 * как ещё одна сетка после «Форматов».
 */
export default function Benefits() {
  return (
    <section id="benefits" className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28">
      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <div className="mb-3 flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-cyan">
              <FlaskMark />
              Результат
            </div>

            <h2
              className="text-[clamp(26px,3.4vw,44px)] font-extrabold leading-[1.15] tracking-tight"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              Что вы заберёте с конференции
            </h2>

            <p className="mt-5 max-w-[460px] text-[17px] leading-relaxed text-text-muted">
              Два дня заканчиваются не блокнотом с заметками, а набором решений, данных
              и контактов, с которыми можно выходить к бизнесу.
            </p>
          </div>

          <ul className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {benefits.map((b) => (
              <li key={b.title} className="flex gap-3.5">
                <span className="mt-0.5 shrink-0 text-cyan">
                  <IconCheck />
                </span>
                <span>
                  <span
                    className="block text-[17px] font-bold leading-snug"
                    style={{ fontFamily: 'var(--font-outfit)' }}
                  >
                    {b.title}
                  </span>
                  <span className="mt-1.5 block text-[15px] leading-relaxed text-text-muted">
                    {b.desc}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.4" opacity="0.5" />
      <path
        d="M6 10.2l2.6 2.6L14 7.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
