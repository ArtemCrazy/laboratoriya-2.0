import Header from '@/components/Header';
import DotField from '@/components/DotField';
import Flask3D from '@/components/Flask3D';
import ConceptSwitcher from '@/components/ConceptSwitcher';
import { hero } from '@/content/hero';
import { asset } from '@/lib/paths';

export const metadata = { title: 'Концепция B — «Эксперимент» | C&B-лаборатория 2.0' };

export default function ConceptB() {
  return (
    <>
      <Header />
      <main className="relative flex min-h-screen flex-col overflow-hidden bg-bg-main pt-24 lg:pt-28">
        {/* Фон приглушён — сцена не должна спорить с колбой */}
        <div className="absolute inset-0">
          <DotField opacity={0.18} />
          <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan/[0.07] blur-[150px]" />
          <div className="absolute right-[8%] top-1/3 h-[380px] w-[380px] rounded-full bg-accent/[0.08] blur-[120px]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 items-center gap-6 px-5 pb-32 lg:grid-cols-[1fr_0.85fr] lg:px-10 lg:pb-20">
          {/* --- Текст: больше воздуха, крупная типографика --- */}
          <div className="animate-rise">
            <div className="mb-8 flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-cyan">
              <span className="h-px w-10 bg-cyan/50" />
              {hero.days} · {hero.dates}
            </div>

            <h1
              className="text-[clamp(36px,6vw,76px)] font-extrabold leading-[1.02] tracking-tight"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {hero.titleMain}
              <br />
              <span className="text-gradient">{hero.titleAccent}</span>
              <span className="ml-3 align-top text-[0.45em] font-bold text-accent">
                {hero.version}
              </span>
            </h1>

            <p className="mt-7 max-w-[540px] text-[17px] leading-relaxed text-text-muted">
              {hero.subtitle}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#price"
                className="rounded-full bg-accent px-9 py-4 text-center font-semibold text-text-dark transition-all hover:bg-accent-hover hover:shadow-[0_0_36px_rgba(255,213,79,0.4)]"
              >
                {hero.ctaPrimary}
              </a>
              <a
                href="#program"
                className="rounded-full border border-glass-border bg-glass px-9 py-4 text-center font-semibold backdrop-blur-sm transition-colors hover:border-cyan hover:text-cyan"
              >
                {hero.ctaSecondary}
              </a>
            </div>

            <div className="mt-10 flex items-center gap-4 text-sm text-text-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset('/img/hr_lab_mascots_2d.png')}
                alt=""
                aria-hidden="true"
                className="h-14 w-14 rounded-full border border-glass-border object-cover opacity-80"
              />
              <span>
                📍 {hero.location}, {hero.locationNote}
              </span>
            </div>
          </div>

          {/* --- Колба --- */}
          <div className="relative h-[320px] w-full lg:h-[620px]">
            <Flask3D />
          </div>
        </div>
      </main>
      <ConceptSwitcher current="b" />
    </>
  );
}
