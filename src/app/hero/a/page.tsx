import Header from '@/components/Header';
import DotField from '@/components/DotField';
import ConceptSwitcher from '@/components/ConceptSwitcher';
import AudienceTable from '@/components/AudienceTable';
import LiquidButton from '@/components/LiquidButton';
import { hero, terms } from '@/content/hero';
import { asset } from '@/lib/paths';

export const metadata = { title: 'Концепция A — «Живая формула» | C&B-лаборатория 2.0' };

/**
 * Лента внизу первого экрана: только суть события — сколько дней,
 * когда и где. Формулы убраны, чтобы не размывать сообщение.
 */
const ticker = [
  { kind: 'days' as const, text: 'Два дня практики' },
  { kind: 'date' as const, text: hero.dates },
  { kind: 'place' as const, text: `${hero.location}, ${hero.address}` },
];

// Половина ленты должна быть шире экрана, иначе при сдвиге на -50%
// в строке появятся пустоты — поэтому набор повторяется трижды
const tickerHalf = [...ticker, ...ticker, ...ticker];

export default function ConceptA() {
  return (
    <>
      <Header />
      <main>
        <section className="relative flex min-h-screen flex-col overflow-hidden bg-bg-main pt-24 lg:pt-28">
        {/* Фон: точечное поле + световые пятна */}
        <div className="absolute inset-0">
          <DotField />
          <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan/10 blur-[130px]" />
          <div className="absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[130px]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 items-center gap-8 px-5 pb-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:px-10 lg:pb-6">
          {/* --- Текстовая колонка --- */}
          <div className="animate-rise">
            {/* Вторая строка держится в один ряд вместе с «2.0» — на узких
                экранах перенос разрешаем, иначе строка не поместится */}
            <h1
              className="text-[clamp(30px,4vw,56px)] font-extrabold leading-[1.08] tracking-tight"
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

            <p className="mt-6 max-w-[560px] text-[17px] leading-relaxed text-text-muted">
              {hero.subtitle}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <LiquidButton href="#price">{hero.ctaPrimary}</LiquidButton>
              <LiquidButton href="#program" variant="ghost">
                {hero.ctaSecondary}
              </LiquidButton>
            </div>

          </div>

          {/* --- Визуальная колонка: сцена лаборатории в круге + плашки ---
              Круг срезает углы иллюстрации, где впечатаны её собственные
              подписи, поэтому понятия C&B выносим своими плашками вокруг. */}
          <div className="relative mx-auto hidden aspect-square w-full max-w-[600px] items-center justify-center lg:flex">
            {/* Круг ~500px — как в первой конференции, где он был 450px */}
            <div className="absolute inset-[8%] rounded-full border border-cyan/20" />
            <div className="absolute inset-0 rounded-full border border-white/5" />
            <div className="absolute inset-[8%] overflow-hidden rounded-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset('/img/mascots-lab.webp')}
                alt="Лаборанты конференции смешивают бюджет, мотивацию и заботу"
                width={1320}
                height={1191}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Плавающие плашки с понятиями C&B вокруг фотографии */}
            {terms.map((t, i) => {
              // Плашки стоят по краям круга, не заезжая на фотографию
              const positions = [
                'left-[-4%] top-[18%]',
                'right-[-6%] top-[30%]',
                'left-[2%] bottom-[20%]',
                'right-[0%] bottom-[28%]',
                'left-1/2 top-[-2%] -translate-x-1/2',
              ];
              return (
                <div
                  key={t.label}
                  className={`animate-float absolute ${positions[i]} flex items-center gap-2 rounded-2xl border border-glass-border bg-bg-deep/80 px-4 py-2.5 backdrop-blur-md`}
                  style={{ animationDelay: `${i * 0.8}s` }}
                >
                  <span aria-hidden="true">{t.icon}</span>
                  <span className="text-sm font-medium">{t.label}</span>
                </div>
              );
            })}

          </div>
        </div>

        {/* Бегущая строка — приём первой конференции. Теперь в ней едут
            дата и площадка, формулы работают фоном между ними */}
        <div className="relative border-y border-glass-border bg-bg-deep/50 py-3 backdrop-blur-sm">
          <div className="animate-marquee flex w-max items-center whitespace-nowrap">
            {[...tickerHalf, ...tickerHalf].map((item, i) => (
              <span key={i} className="flex items-center">
                <span className="flex items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-1.5 text-sm font-medium">
                  <span className={item.kind === 'place' ? 'text-cyan' : 'text-accent'}>
                    {item.kind === 'date' ? (
                      <IconCalendar />
                    ) : item.kind === 'place' ? (
                      <IconPin />
                    ) : (
                      <IconFlask />
                    )}
                  </span>
                  {item.text}
                </span>
                {/* Разделитель между пилюлями */}
                <span className="mx-6 h-1 w-1 rounded-full bg-cyan/40" />
              </span>
            ))}
          </div>
        </div>
        </section>

        {/* ТЗ 4.3 — «Для кого конференция» */}
        <AudienceTable />
      </main>

      <ConceptSwitcher current="a" />
    </>
  );
}

/* --- Иконки бегущей строки --- */

function IconCalendar() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 14.5s5-4.6 5-8a5 5 0 0 0-10 0c0 3.4 5 8 5 8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.4" r="1.7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function IconFlask() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6.5 1.5v4.2L3 12.2A1.4 1.4 0 0 0 4.2 14.5h7.6A1.4 1.4 0 0 0 13 12.2L9.5 5.7V1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M5.5 1.5h5M4.6 9.8h6.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
