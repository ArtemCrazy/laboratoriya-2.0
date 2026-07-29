import Header from '@/components/Header';
import DotField from '@/components/DotField';
import AboutSection from '@/components/AboutSection';
import KeyThemes from '@/components/KeyThemes';
import SpeakersCarousel from '@/components/SpeakersCarousel';
import Program from '@/components/Program';
import Formats from '@/components/Formats';
import Benefits from '@/components/Benefits';
import Recap from '@/components/Recap';
import Participants from '@/components/Participants';
import Reviews from '@/components/Reviews';
import Pricing from '@/components/Pricing';
import Partners from '@/components/Partners';
import Venue from '@/components/Venue';
import FinalCta from '@/components/FinalCta';
import Footer from '@/components/Footer';
import LiquidButton from '@/components/LiquidButton';
import { hero, terms } from '@/content/hero';
import { asset } from '@/lib/paths';

export const metadata = {
  title: 'C&B-лаборатория: химия цифр и людей 2.0 — HR-конференция',
};

/**
 * Правки 24.07: бегущая строка — динамический тематический элемент.
 * Дата, адрес и цифры убраны, вместо них слова из тематики мероприятия.
 */
const ticker = [
  'Вознаграждение',
  'Мотивация',
  'Благополучие',
  'Льготы',
  'eNPS',
  'Премирование',
  'Поощрение',
  'Total Rewards',
  'ФОТ',
  'KPI',
  'Удержание',
  'Вовлечённость',
  'Аналитика',
  'Автоматизация',
  'Персонализация',
  'Эффективность',
  'HR Tech',
];

// Половина ленты должна быть шире экрана, иначе при сдвиге на -50%
// в строке появятся пустоты — набор повторяется дважды в каждой половине
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
  { tilt: 60, ry: 17, speed: 18, stroke: 'rgba(0, 229, 255, 0.35)', electron: '#FFD54F' },
  { tilt: 120, ry: 21, speed: 22, stroke: 'rgba(0, 229, 255, 0.28)', electron: '#00E5FF' },
];

/** Эллипс как path — по нему и рисуется орбита, и бежит электрон */
function ellipsePath(cx: number, cy: number, rx: number, ry: number) {
  return `M ${cx - rx} ${cy} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`;
}

export default function Home() {
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
              className="text-[clamp(32px,4.1vw,58px)] font-extrabold leading-[1.08] tracking-tight"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {hero.titleMain}
              <br />
              <span className="xl:whitespace-nowrap">
                <span className="text-gradient">{hero.titleAccent}</span>{' '}
                <span className="text-accent">{hero.version}</span>
              </span>
            </h1>

            <p className="mt-6 max-w-[560px] text-[17px] leading-relaxed text-text-muted">
              {hero.subtitle}
            </p>

            {/* Правки 29.07: дата и место крупнее и жирнее, прямо над кнопками */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[clamp(16px,1.35vw,20px)] font-semibold">
              <span className="flex items-center gap-2.5">
                <span className="text-cyan">
                  <IconCalendar />
                </span>
                {hero.dates}
              </span>
              <span className="text-cyan-dim">|</span>
              <span className="flex items-center gap-2.5">
                <span className="text-accent">
                  <IconPin />
                </span>
                {hero.location}, {hero.locationNote}, зал «Архангельск»
              </span>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
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
        {/* overflow-hidden обязателен: без него браузер держит слой во всю
            ширину трека (около 5000px) и анимация начинает подёргиваться.
            Размытие с полосы снято по той же причине */}
        <div className="relative overflow-hidden border-y border-glass-border bg-bg-deep/70 py-3">
          <div className="animate-marquee flex w-max items-center whitespace-nowrap">
            {[...tickerHalf, ...tickerHalf].map((word, i) => (
              <span key={i} className="flex items-center">
                <span className="text-sm font-medium text-text-muted">{word}</span>
                {/* Разделитель-точка в акцентном цвете */}
                <span className="mx-5 h-1 w-1 rounded-full bg-cyan/50" />
              </span>
            ))}
          </div>
        </div>
        </section>

        {/* Правки 24.07 — «О конференции» + цифры + для кого конференция */}
        <AboutSection />

        {/* Правки 24.07 — «Ключевые темы» (молекула переехала сюда) */}
        <KeyThemes />

        {/* Правки 24.07 — «Спикеры» каруселью (было: молекула) */}
        <SpeakersCarousel />

        {/* ТЗ 4.5 — «Программа на два дня» */}
        <Program />

        {/* Дальше — порядок блоков по ТЗ §3 */}
        <Formats />
        <Benefits />
        <Recap />
        <Participants />
        <Reviews />
        <Pricing />
        <Partners />
        <Venue />
        <FinalCta />
      </main>

      <Footer />
    </>
  );
}




function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

