import Header from '@/components/Header';
import DotField from '@/components/DotField';
import ConceptSwitcher from '@/components/ConceptSwitcher';
import AudienceTable from '@/components/AudienceTable';
import { hero } from '@/content/hero';
import { asset } from '@/lib/paths';

export const metadata = { title: 'Концепция C — «Во всю высоту» | C&B-лаборатория 2.0' };

/**
 * Концепция C — по макету заказчика: тот же тёмный фон и тот же состав,
 * что в A, но сцена лаборатории занимает правую половину экрана целиком
 * и растворяется в фоне градиентом, а не сидит в круге.
 */
export default function ConceptC() {
  return (
    <>
      <Header />
      <main>
        <section className="relative flex min-h-screen flex-col overflow-hidden bg-bg-main pt-24 lg:pt-28">
          {/* --- Сцена лаборатории во всю высоту --- */}
          <div className="absolute inset-0 lg:left-auto lg:w-[56%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset('/img/hero-lab.webp')}
              alt="Лаборанты конференции смешивают бюджет, мотивацию и заботу"
              width={1254}
              height={1254}
              className="h-full w-full object-cover"
              style={{ objectPosition: 'center 35%' }}
            />
            {/* На мобильном фото уходит в подложку — текст читается поверх */}
            <div className="absolute inset-0 bg-bg-main/85 lg:hidden" />
            {/* На десктопе левый край растворяется в фоне */}
            {/* Плотность подобрана так, чтобы заголовок читался на участке,
                где он заходит на фото */}
            <div className="absolute inset-0 hidden bg-gradient-to-r from-bg-main from-25% via-bg-main/80 via-60% to-transparent lg:block" />
            <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-bg-main/90 to-transparent lg:block" />
            <div className="absolute inset-x-0 top-0 hidden h-24 bg-gradient-to-b from-bg-main/80 to-transparent lg:block" />
          </div>

          {/* Точечное поле — только на левой половине, чтобы не спорить с фото */}
          <div className="absolute inset-y-0 left-0 w-full lg:w-[52%]">
            <DotField opacity={0.3} />
            <div className="absolute -left-40 top-1/4 h-[520px] w-[520px] rounded-full bg-cyan/10 blur-[140px]" />
          </div>

          {/* --- Контент --- */}
          <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 items-center px-5 pb-32 lg:px-10 lg:pb-20">
            <div className="w-full max-w-[720px] animate-rise">
              {/* Бейджи отдельными пилюлями */}
              <div className="flex flex-wrap gap-2.5">
                <Badge icon={<IconDays />}>{hero.days}</Badge>
                <Badge icon={<IconCalendar />}>{hero.dates}</Badge>
                <Badge icon={<IconPin />}>
                  {hero.location}, {hero.locationNote}
                </Badge>
              </div>

              <h1
                className="mt-9 text-[clamp(30px,4vw,56px)] font-extrabold leading-[1.1] tracking-tight"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                {hero.titleMain}
                <br />
                <span className="xl:whitespace-nowrap">
                  <span className="text-gradient">{hero.titleAccent}</span>{' '}
                  <span className="text-accent">{hero.version}</span>
                </span>
              </h1>

              <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-text-muted">
                {hero.subtitle}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#price"
                  className="rounded-full bg-accent px-8 py-4 text-center font-semibold text-text-dark transition-all hover:bg-accent-hover hover:shadow-[0_0_30px_rgba(255,213,79,0.35)]"
                >
                  {hero.ctaPrimary}
                </a>
                <a
                  href="#program"
                  className="flex items-center justify-center gap-2.5 rounded-full border border-glass-border bg-glass px-8 py-4 font-semibold backdrop-blur-sm transition-colors hover:border-cyan hover:text-cyan"
                >
                  {hero.ctaSecondary}
                  <IconDownload />
                </a>
              </div>
            </div>
          </div>

          {/* Подсказка «листайте дальше» — как в макете, правый нижний угол */}
          <a
            href="#audience"
            className="group absolute bottom-8 right-10 z-10 hidden items-center gap-3 rounded-full border border-glass-border bg-bg-deep/70 py-2 pl-5 pr-2 backdrop-blur-md transition-colors hover:border-cyan/50 lg:flex"
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
    <span className="inline-flex items-center gap-2 rounded-xl border border-glass-border bg-glass px-4 py-2.5 text-sm backdrop-blur-sm">
      <span className="text-cyan">{icon}</span>
      {children}
    </span>
  );
}

/* --- Иконки --- */

function IconDays() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5 L13 12.5 H3 Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M5 8.5h6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="2"
        y="3"
        width="12"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
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
