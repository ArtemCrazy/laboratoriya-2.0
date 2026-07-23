import Header from '@/components/Header';
import DotField from '@/components/DotField';
import ConceptSwitcher from '@/components/ConceptSwitcher';
import AudienceTable from '@/components/AudienceTable';
import LiquidButton from '@/components/LiquidButton';
import DateWidget from '@/components/DateWidget';
import BubblingFlask from '@/components/BubblingFlask';
import { hero, terms } from '@/content/hero';
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
      <main>
        <section className="relative flex min-h-screen flex-col overflow-hidden bg-bg-main pt-24 lg:pt-28">
        {/* Фон: точечное поле + световые пятна */}
        <div className="absolute inset-0">
          <DotField />
          <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-cyan/10 blur-[130px]" />
          <div className="absolute -right-20 bottom-0 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[130px]" />

          {/* Пробирка у верхнего края — периодически бурлит */}
          <BubblingFlask
            height={150}
            opacity={0.35}
            className="absolute left-[6%] top-[14%] hidden xl:block"
          />
        </div>

        <div className="relative mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-1 items-center gap-8 px-5 pb-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:px-10 lg:pb-16">
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

            {/* На мобильном визуальной колонки нет — виджет встаёт в поток */}
            <div className="mt-8 lg:hidden">
              <DateWidget />
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
        </section>

        {/* ТЗ 4.3 — «Для кого конференция» */}
        <AudienceTable />
      </main>

      {/* Виджет с датой и местом закреплён справа и едет вместе со страницей.
          На мобильном его нет — там он стоит в потоке под кнопками. */}
      <div className="fixed bottom-8 right-6 z-40 hidden lg:block">
        <DateWidget floating />
      </div>

      <ConceptSwitcher current="a" />
    </>
  );
}
