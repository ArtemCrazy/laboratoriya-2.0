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
  // ⚠️ ПЛЕЙСХОЛДЕРЫ: состав спикеров и программа ещё не переданы заказчиком
  { kind: 'speakers' as const, text: '10 спикеров' },
  { kind: 'cases' as const, text: 'Разбор реальных кейсов' },
];

// Половина ленты должна быть шире экрана, иначе при сдвиге на -50%
// в строке появятся пустоты
const tickerHalf = [...ticker, ...ticker];

/**
 * Плашки на орбите: угол (0 — справа, отсчёт против часовой) и сдвиг
 * оттенка колбы. Картинка одна, бирюзовая, поэтому цвет раствора
 * задаётся поворотом тона — как разные реактивы в одной серии.
 */
const orbitPlates = [
  { angle: 145, hue: 35 }, // синий
  { angle: 35, hue: -45 }, // зелёный
  { angle: 215, hue: -125 }, // жёлтый
  { angle: 325, hue: 125 }, // розовый
  { angle: 90, hue: 80 }, // фиолетовый
];

/** Орбиты атома: наклон, сжатие эллипса, цвет линии и электрона */
const atomOrbits = [
  { tilt: 0, ry: 19, speed: 14, stroke: 'rgba(0, 229, 255, 0.42)', electron: '#00E5FF' },
  { tilt: 60, ry: 17, speed: 18, stroke: 'rgba(255, 255, 255, 0.26)', electron: '#FFD54F' },
  { tilt: 120, ry: 21, speed: 22, stroke: 'rgba(0, 229, 255, 0.28)', electron: '#00E5FF' },
];

/** Эллипс как path — по нему и рисуется орбита, и бежит электрон */
function ellipsePath(cx: number, cy: number, rx: number, ry: number) {
  return `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`;
}

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
            {/* Атомная модель: три эллиптические орбиты под углами 0/60/120°,
                по каждой бежит электрон. Орбиты — точечный пунктир, вся
                система медленно поворачивается */}
            <svg
              viewBox="0 0 100 100"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full origin-center animate-[spin_120s_linear_infinite]"
            >
              {atomOrbits.map((o, i) => (
                <g key={o.tilt} transform={`rotate(${o.tilt} 50 50)`}>
                  <ellipse
                    cx="50"
                    cy="50"
                    rx="46"
                    ry={o.ry}
                    fill="none"
                    stroke={o.stroke}
                    strokeWidth="0.6"
                    strokeLinecap="round"
                    strokeDasharray="0.1 2.6"
                  />
                  {/* Электрон бежит по той же орбите */}
                  <circle r="1.15" fill={o.electron} style={{ filter: `drop-shadow(0 0 1.5px ${o.electron})` }}>
                    <animateMotion
                      dur={`${o.speed}s`}
                      repeatCount="indefinite"
                      path={ellipsePath(50, 50, 46, o.ry)}
                      begin={`${i * -2.5}s`}
                    />
                  </circle>
                </g>
              ))}
            </svg>

            <div className="absolute inset-[14%] overflow-hidden rounded-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset('/img/mascots-lab.webp')}
                alt="Лаборанты конференции смешивают бюджет, мотивацию и заботу"
                width={1320}
                height={1191}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Плашки сидят прямо на внешней орбите: угол задаёт точку,
                координаты считаются по окружности радиуса 46% */}
            {terms.map((t, i) => {
              const { angle, hue } = orbitPlates[i];
              const rad = (angle * Math.PI) / 180;
              const left = 50 + 46 * Math.cos(rad);
              const top = 50 - 46 * Math.sin(rad);
              return (
                <div
                  key={t.label}
                  className="animate-float absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 rounded-2xl border border-glass-border bg-bg-deep/85 py-2 pl-2.5 pr-4 backdrop-blur-md"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    animationDelay: `${i * 0.8}s`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset('/img/flask.webp')}
                    alt=""
                    aria-hidden="true"
                    width={75}
                    height={320}
                    className="h-7 w-auto"
                    style={{ filter: `hue-rotate(${hue}deg) saturate(1.15)` }}
                  />
                  <span className="leading-tight">
                    <span className="block text-[11px] text-text-muted">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="block text-sm font-medium">{t.label}</span>
                  </span>
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
                  <span
                    className={
                      item.kind === 'place' || item.kind === 'cases'
                        ? 'text-cyan'
                        : 'text-accent'
                    }
                  >
                    {tickerIcons[item.kind]}
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

const tickerIcons = {
  days: <IconFlask />,
  date: <IconCalendar />,
  place: <IconPin />,
  speakers: <IconSpeakers />,
  cases: <IconCases />,
};

function IconSpeakers() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="6" cy="5.5" r="2.6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M1.8 14c0-2.4 1.9-4.1 4.2-4.1s4.2 1.7 4.2 4.1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M11 3.4a2.5 2.5 0 0 1 0 4.6M12.4 10.4c1.2.6 1.9 1.8 1.9 3.3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconCases() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.8" y="4.5" width="12.4" height="9.2" rx="1.8" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M5.8 4.5V3.4c0-.6.5-1.1 1.1-1.1h2.2c.6 0 1.1.5 1.1 1.1v1.1M1.8 8.4h12.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
