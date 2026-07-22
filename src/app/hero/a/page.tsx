import Header from '@/components/Header';
import DotField from '@/components/DotField';
import ConceptSwitcher from '@/components/ConceptSwitcher';
import { hero } from '@/content/hero';
import { asset } from '@/lib/paths';

export const metadata = { title: 'Концепция A — «Живая формула» | C&B-лаборатория 2.0' };

const formulas = [
  'Мотивация = (Признание × Справедливость) + Смысл',
  'ROI льгот = Δ вовлечённость ÷ затраты',
  'Удержание = Ясность грейдов × Доверие',
  'Total Rewards = Оклад + Бонус + Льготы + Развитие',
  'eNPS ↑ когда прозрачность ↑',
];

export default function ConceptA() {
  return (
    <>
      <Header />
      <main className="relative flex min-h-screen flex-col overflow-hidden bg-bg-main pt-24 lg:pt-28">
        {/* Фон: точечное поле + световые пятна */}
        <div className="absolute inset-0">
          <DotField />
          <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan/10 blur-[130px]" />
          <div className="absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[130px]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 items-center gap-8 px-5 pb-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:px-10 lg:pb-16">
          {/* --- Текстовая колонка --- */}
          <div className="animate-rise">
            <div className="mb-6 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-glass-border bg-glass px-4 py-2 text-sm backdrop-blur-sm">
              <span className="font-semibold text-accent">{hero.days}</span>
              <span className="text-cyan-dim">|</span>
              <span>📅 {hero.dates}</span>
              <span className="text-cyan-dim">|</span>
              <span className="text-text-muted">
                📍 {hero.location}, {hero.locationNote}
              </span>
            </div>

            <h1
              className="text-[clamp(32px,5.2vw,64px)] font-extrabold leading-[1.08] tracking-tight"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {hero.titleMain}
              <br />
              <span className="text-gradient">{hero.titleAccent}</span>{' '}
              <span className="text-accent">{hero.version}</span>
            </h1>

            <p className="mt-6 max-w-[560px] text-[17px] leading-relaxed text-text-muted">
              {hero.subtitle}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
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
          </div>

          {/* --- Визуальная колонка: сцена лаборатории ---
              Плашки с понятиями C&B уже впечатаны в саму иллюстрацию,
              поэтому своих поверх не рисуем — дублировали бы. */}
          <div className="relative mx-auto hidden w-full max-w-[560px] lg:block">
            <div className="absolute -inset-6 rounded-[32px] bg-cyan/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-glass-border shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset('/img/mascots-lab.webp')}
                alt="Лаборанты конференции смешивают бюджет, мотивацию и заботу"
                width={1320}
                height={1191}
                className="h-full w-full object-cover"
              />
              {/* Затемнение снизу — картинка не спорит с текстом по контрасту */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-bg-main/70 to-transparent" />
            </div>
          </div>
        </div>

        {/* Бегущая строка с формулами — приём первой конференции */}
        <div className="relative border-y border-glass-border bg-bg-deep/50 py-3.5 backdrop-blur-sm">
          <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
            {[...formulas, ...formulas].map((f, i) => (
              <span key={i} className="text-sm text-text-muted">
                <span className="mr-3 text-cyan">◆</span>
                {f}
              </span>
            ))}
          </div>
        </div>
      </main>
      <ConceptSwitcher current="a" />
    </>
  );
}
