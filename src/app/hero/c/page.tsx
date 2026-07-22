import Header from '@/components/Header';
import DotField from '@/components/DotField';
import ConceptSwitcher from '@/components/ConceptSwitcher';
import AudienceTable from '@/components/AudienceTable';
import LiquidButton from '@/components/LiquidButton';
import { hero } from '@/content/hero';
import { asset } from '@/lib/paths';

export const metadata = { title: 'Концепция C — «Фон во всю ширину» | C&B-лаборатория 2.0' };

/**
 * Концепция C — сцена лаборатории занимает весь экран фоном,
 * а смысловые блоки собраны по центру поверх неё.
 * Обратная композиция к варианту, где фото стояло справа.
 */
export default function ConceptC() {
  return (
    <>
      <Header />
      <main>
        <section className="relative flex min-h-screen flex-col overflow-hidden bg-bg-main pt-24 lg:pt-28">
          {/* --- Сцена во всю ширину --- */}
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset('/img/hero-lab-wide.webp')}
              alt="Лаборанты конференции смешивают бюджет, мотивацию и заботу"
              width={1672}
              height={941}
              className="h-full w-full object-cover"
              style={{ objectPosition: 'center 40%' }}
            />
            {/* Затемнение: сцена яркая в центре, текст должен читаться поверх */}
            <div className="absolute inset-0 bg-bg-main/75" />
            <div className="absolute inset-0 bg-gradient-to-b from-bg-main via-transparent to-bg-main" />
            {/* Виньетка по краям — центр композиции остаётся открытым */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(6,11,25,0.75)_100%)]" />
          </div>

          <DotField opacity={0.18} />

          {/* --- Смысловые блоки по центру --- */}
          <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 items-center justify-center px-5 pb-32 lg:px-10 lg:pb-24">
            <div className="animate-rise flex w-full max-w-[860px] flex-col items-center text-center">
              <div className="flex flex-wrap justify-center gap-2.5">
                <Badge icon={<IconDays />}>{hero.days}</Badge>
                <Badge icon={<IconCalendar />}>{hero.dates}</Badge>
                <Badge icon={<IconPin />}>
                  {hero.location}, {hero.locationNote}
                </Badge>
              </div>

              <h1
                className="mt-9 text-[clamp(30px,4.4vw,60px)] font-extrabold leading-[1.08] tracking-tight [text-shadow:0_2px_30px_rgba(6,11,25,0.8)]"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                {hero.titleMain}
                <br />
                <span className="xl:whitespace-nowrap">
                  <span className="text-gradient">{hero.titleAccent}</span>
                  {/* Версия верхним индексом — как заряд в химической формуле */}
                  <sup className="ml-1.5 align-super text-[0.42em] font-extrabold text-accent">
                    {hero.version}
                  </sup>
                </span>
              </h1>

              <p className="mt-6 max-w-[620px] text-[17px] leading-relaxed text-text-muted [text-shadow:0_1px_16px_rgba(6,11,25,0.9)]">
                {hero.subtitle}
              </p>

              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                <LiquidButton href="#price">{hero.ctaPrimary}</LiquidButton>
                <LiquidButton href="#program" variant="ghost" icon={<IconDownload />}>
                  {hero.ctaSecondary}
                </LiquidButton>
              </div>
            </div>
          </div>

          {/* Подсказка «листайте дальше» — по центру, под блоками */}
          <a
            href="#audience"
            className="group absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-glass-border bg-bg-deep/70 py-2 pl-5 pr-2 backdrop-blur-md transition-colors hover:border-cyan/50 lg:flex"
          >
            <span className="text-sm text-text-muted transition-colors group-hover:text-white">
              О конференции
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-text-dark transition-transform group-hover:translate-y-0.5">
              <IconArrowDown />
            </span>
          </a>
        </section>

        {/* ТЗ 4.3 — «Для кого конференция» */}
        <AudienceTable />
      </main>
      <ConceptSwitcher current="c" />
    </>
  );
}

function Badge({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-glass-border bg-bg-deep/60 px-4 py-2.5 text-sm backdrop-blur-md">
      <span className="text-cyan">{icon}</span>
      {children}
    </span>
  );
}

/* --- Иконки --- */

function IconDays() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5 L13 12.5 H3 Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M5 8.5h6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 14.5s5-4.6 5-8a5 5 0 0 0-10 0c0 3.4 5 8 5 8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.4" r="1.8" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2.5v8m0 0 3-3m-3 3-3-3M3 13h10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconArrowDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 3v10m0 0 4-4m-4 4-4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
