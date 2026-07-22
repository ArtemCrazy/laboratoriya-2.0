import Header from '@/components/Header';
import ConceptSwitcher from '@/components/ConceptSwitcher';
import { hero, facts } from '@/content/hero';
import { asset } from '@/lib/paths';

export const metadata = { title: 'Концепция C — «Химия цифр» | C&B-лаборатория 2.0' };

/**
 * Концепция C — полностью новое направление, заданное референсом techrec.pro.
 * Отличия от A и B: светлая страница вместо тёмной, главный герой — типографика,
 * а не иллюстрация; сцена лаборатории уходит в фон карточки под дуотоном.
 *
 * ⚠️ Сознательный отход от узнаваемости первой конференции (ТЗ 5.1) —
 * показываем заказчику как альтернативу, а не как развитие бренда.
 */

const days = [
  { label: 'День 1', date: '21 октября', note: 'Модели вознаграждения' },
  { label: 'День 2', date: '22 октября', note: 'Мотивация и благополучие' },
];

export default function ConceptC() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-light-bg pt-24 text-ink lg:pt-28">
        <div className="mx-auto max-w-[1440px] px-4 pb-28 lg:px-8 lg:pb-16">
          {/* --- Тёмная карточка первого экрана --- */}
          <section className="relative overflow-hidden rounded-[28px] lg:rounded-[40px]">
            {/* Сцена лаборатории под дуотоном — бренд остаётся, но не спорит с текстом */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset('/img/mascots-lab.webp')}
              alt=""
              aria-hidden="true"
              width={1320}
              height={1191}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: 'center 30%' }}
            />
            <div className="absolute inset-0 bg-indigo-deep/90" />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-deep via-indigo-deep/80 to-indigo/50" />

            <div className="relative px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
              {/* Верхняя строка — как «шапка» карточки */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/70">
                <Sparkle />
                <span>Практическая конференция для C&amp;B и HR</span>
              </div>

              {/* Типографика — главный герой экрана */}
              <div className="mt-10 lg:mt-14">
                <div
                  className="text-[clamp(20px,2.6vw,34px)] font-semibold tracking-tight text-white/85"
                  style={{ fontFamily: 'var(--font-outfit)' }}
                >
                  {hero.titleMain.replace(':', '')}{' '}
                  <span className="text-accent">{hero.version}</span>
                </div>
                <h1
                  className="mt-2 text-[clamp(38px,7.6vw,104px)] font-extrabold uppercase leading-[0.94] tracking-[-0.02em] text-white"
                  style={{ fontFamily: 'var(--font-outfit)' }}
                >
                  Химия цифр
                  <br />и людей
                </h1>
              </div>

              <p className="mt-8 max-w-[620px] text-[17px] leading-relaxed text-white/75">
                {hero.subtitle}
              </p>

              {/* Два дня отдельными плашками — приём референса */}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {days.map((d) => (
                  <div
                    key={d.label}
                    className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 backdrop-blur-sm sm:max-w-[260px]"
                  >
                    <div className="text-xs uppercase tracking-[0.18em] text-accent">
                      {d.label}
                    </div>
                    <div
                      className="mt-1.5 text-xl font-bold text-white"
                      style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                      {d.date}
                    </div>
                    <div className="mt-1 text-sm text-white/60">{d.note}</div>
                  </div>
                ))}
                <div className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-5 py-4 backdrop-blur-sm sm:max-w-[260px]">
                  <div className="text-xs uppercase tracking-[0.18em] text-accent">Место</div>
                  <div
                    className="mt-1.5 text-xl font-bold text-white"
                    style={{ fontFamily: 'var(--font-outfit)' }}
                  >
                    {hero.location}
                  </div>
                  <div className="mt-1 text-sm text-white/60">{hero.locationNote}</div>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#price"
                  className="rounded-full bg-accent px-9 py-4 text-center font-semibold text-ink transition-all hover:bg-accent-hover hover:shadow-[0_0_36px_rgba(255,213,79,0.4)]"
                >
                  {hero.ctaPrimary}
                </a>
                <a
                  href="#program"
                  className="rounded-full border border-white/25 px-9 py-4 text-center font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
                >
                  {hero.ctaSecondary}
                </a>
              </div>
            </div>
          </section>

          {/* --- Факты первой конференции на светлом --- */}
          <section className="mt-6 grid grid-cols-2 gap-4 lg:mt-8 lg:grid-cols-4">
            {facts.map((f) => (
              <div
                key={f.label}
                className="rounded-2xl bg-light-card px-6 py-7 shadow-[0_2px_20px_rgba(23,18,69,0.06)]"
              >
                <div
                  className="text-[clamp(30px,3.4vw,44px)] font-extrabold leading-none text-indigo"
                  style={{ fontFamily: 'var(--font-outfit)' }}
                >
                  {f.value}
                </div>
                <div className="mt-2 text-sm text-ink/60">{f.label}</div>
              </div>
            ))}
          </section>

          <p className="mt-5 flex items-center gap-2 text-sm text-ink/50">
            <Sparkle tone="dark" />
            Итоги первой конференции — так это было в мае 2026
          </p>
        </div>
      </main>
      <ConceptSwitcher current="c" />
    </>
  );
}

/** Декоративная искра-акцент */
function Sparkle({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      aria-hidden="true"
      className={tone === 'light' ? 'text-accent' : 'text-indigo'}
    >
      <path
        d="M7 0 L8.4 5.6 L14 7 L8.4 8.4 L7 14 L5.6 8.4 L0 7 L5.6 5.6 Z"
        fill="currentColor"
      />
    </svg>
  );
}
