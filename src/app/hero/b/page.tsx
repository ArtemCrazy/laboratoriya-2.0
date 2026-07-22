import Header from '@/components/Header';
import DotField from '@/components/DotField';
import ConceptSwitcher from '@/components/ConceptSwitcher';
import { hero, facts, elements } from '@/content/hero';
import { asset } from '@/lib/paths';

export const metadata = { title: 'Концепция B — «Таблица элементов» | C&B-лаборатория 2.0' };

export default function ConceptB() {
  return (
    <>
      <Header />
      <main className="relative flex min-h-screen flex-col overflow-hidden bg-bg-main pt-24 lg:pt-28">
        <div className="absolute inset-0">
          <DotField opacity={0.22} />
          <div className="absolute -right-32 top-0 h-[520px] w-[520px] rounded-full bg-cyan/[0.09] blur-[140px]" />
          <div className="absolute -left-24 bottom-10 h-[380px] w-[380px] rounded-full bg-accent/[0.07] blur-[120px]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-5 pb-32 lg:px-10 lg:pb-20">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* --- Текст --- */}
            <div className="animate-rise">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-4 py-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-cyan" />
                <span className="font-semibold text-cyan">{hero.days}</span>
                <span className="text-text-muted">
                  · {hero.dates} · {hero.location}
                </span>
              </div>

              {/* Как в концепции A: строка с «2.0» держится одним рядом
                  от 1280px, ниже перенос разрешён */}
              <h1
                className="text-[clamp(30px,4vw,56px)] font-extrabold leading-[1.05] tracking-tight"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                {hero.titleMain}
                <br />
                <span className="xl:whitespace-nowrap">
                  <span className="text-gradient">{hero.titleAccent}</span>{' '}
                  <span className="text-accent">{hero.version}</span>
                </span>
              </h1>

              <p className="mt-6 max-w-[540px] text-[17px] leading-relaxed text-text-muted">
                {hero.subtitle}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#price"
                  className="rounded-full bg-accent px-8 py-4 text-center font-semibold text-text-dark transition-all hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(255,213,79,0.35)]"
                >
                  {hero.ctaPrimary}
                </a>
                <a
                  href="#program"
                  className="rounded-full border border-glass-border bg-glass px-8 py-4 text-center font-semibold backdrop-blur-sm transition-colors hover:border-cyan hover:text-cyan"
                >
                  {hero.ctaSecondary}
                </a>
              </div>

              {/* Ключевой ход концепции: доказательство стоит рядом с кнопкой покупки */}
              <div className="mt-9 border-t border-glass-border pt-6">
                <div className="mb-4 text-xs uppercase tracking-[0.2em] text-text-muted">
                  Первая конференция в цифрах
                </div>
                <div className="flex flex-wrap gap-x-10 gap-y-5">
                  {facts.map((f) => (
                    <div key={f.label}>
                      <div
                        className="text-[32px] font-extrabold leading-none text-cyan"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                      >
                        {f.value}
                      </div>
                      <div className="mt-1.5 text-sm text-text-muted">{f.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* --- Таблица элементов --- */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {elements.map((el, i) => (
                  <div
                    key={el.symbol}
                    className="animate-rise group relative aspect-square rounded-2xl border border-glass-border bg-glass p-4 backdrop-blur-sm transition-all hover:border-cyan/50 hover:bg-glass-hover"
                    style={{ animationDelay: `${0.1 + i * 0.09}s` }}
                  >
                    <div className="text-[11px] text-text-muted">{el.num}</div>
                    <div
                      className="mt-1 text-[clamp(28px,3.4vw,42px)] font-extrabold leading-none text-white transition-colors group-hover:text-cyan"
                      style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                      {el.symbol}
                    </div>
                    <div className="absolute bottom-3 left-4 right-3 text-[13px] leading-tight text-text-muted">
                      {el.name}
                    </div>
                  </div>
                ))}
              </div>

              {/* Сцена лаборатории компактной полосой — кадрируем по верху,
                  чтобы лица лаборантов оставались в кадре */}
              <div className="mt-5 flex items-center gap-4 overflow-hidden rounded-2xl border border-glass-border bg-bg-deep/60 backdrop-blur-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset('/img/mascots-lab.webp')}
                  alt="Лаборанты конференции смешивают бюджет, мотивацию и заботу"
                  width={1320}
                  height={1191}
                  className="h-20 w-28 shrink-0 object-cover"
                  style={{ objectPosition: 'center 28%' }}
                />
                <p className="py-3 pr-4 text-sm text-text-muted">
                  Разбираем <span className="text-white">формулы мотивации</span> на реальных
                  кейсах компаний
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ConceptSwitcher current="b" />
    </>
  );
}
