'use client';

import { useState } from 'react';
import { speakers } from '@/content/hero';
import FlaskMark from '@/components/FlaskMark';

/**
 * Блок «Спикеры» (ТЗ 4.4) в виде молекулы: центральное ядро C&B LAB
 * и узлы-спикеры на связях. Клик по узлу раскрывает тему выступления.
 *
 * Геометрия общая для связей и узлов: SVG с системой 1000×625 и позиции
 * в процентах считаются из одних и тех же углов, поэтому линии всегда
 * приходят ровно в центр аватара.
 *
 * ⚠️ Фотографий спикеров нет — узлы показывают инициалы. Когда заказчик
 * передаст снимки, они встанут на то же место без правок разметки.
 */

const RX = 34; // радиус по горизонтали, % от ширины
const RY = 33.6; // радиус по вертикали, % от высоты

const pos = (angle: number) => {
  const rad = (angle * Math.PI) / 180;
  return { x: 50 + RX * Math.cos(rad), y: 50 - RY * Math.sin(rad) };
};

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

export default function SpeakersMolecule() {
  const [active, setActive] = useState<number | null>(null);
  const current = active === null ? null : speakers[active];

  return (
    <section
      id="speakers"
      className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-cyan/[0.07] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="mb-3 flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-cyan">
          <FlaskMark />
          Спикеры
        </div>
        <h2
          className="max-w-[880px] text-[clamp(26px,3.4vw,44px)] font-extrabold leading-[1.15] tracking-tight"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Практики, которые строят системы вознаграждения в крупных компаниях
        </h2>

        {/* --- Молекула: только десктоп --- */}
        <div className="relative mx-auto mt-14 hidden aspect-[16/10] w-full max-w-[1080px] lg:block">
          {/* Связи от ядра к узлам */}
          <svg
            viewBox="0 0 1000 625"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
          >
            {speakers.map((s, i) => {
              const p = pos(s.angle);
              const x = (p.x / 100) * 1000;
              const y = (p.y / 100) * 625;
              const on = active === i;
              return (
                <line
                  key={s.name}
                  x1="500"
                  y1="312"
                  x2={x}
                  y2={y}
                  stroke={on ? s.color : 'rgba(255,255,255,0.16)'}
                  strokeWidth={on ? 2 : 1.2}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* Ядро молекулы */}
          <div className="absolute left-1/2 top-1/2 flex h-[168px] w-[168px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-cyan/40 bg-bg-deep/80 backdrop-blur-md">
            <div className="absolute inset-0 rounded-full bg-cyan/10 blur-xl" />
            <span
              className="relative text-3xl font-extrabold text-white"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              C&amp;B
            </span>
            <span className="relative mt-1 text-sm uppercase tracking-[0.3em] text-cyan">
              lab
            </span>
          </div>

          {/* Узлы-спикеры */}
          {speakers.map((s, i) => {
            const p = pos(s.angle);
            const on = active === i;
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => setActive(on ? null : i)}
                aria-pressed={on}
                /* Кнопка размером ровно с аватар — тогда координата попадает
                   в центр кружка, куда и приходит связь. Подпись висит сбоку */
                className="absolute h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <span
                  className="flex h-full w-full items-center justify-center rounded-full border-2 bg-bg-deep transition-transform duration-300 hover:scale-105"
                  style={{
                    borderColor: s.color,
                    boxShadow: on ? `0 0 26px ${s.color}66` : `0 0 14px ${s.color}22`,
                  }}
                >
                  <span
                    className="text-2xl font-extrabold"
                    style={{ fontFamily: 'var(--font-outfit)', color: s.color }}
                  >
                    {initials(s.name)}
                  </span>
                </span>

                <span
                  className={`absolute top-1/2 w-[168px] -translate-y-1/2 leading-tight ${
                    s.side === 'left' ? 'right-[110px] text-right' : 'left-[110px] text-left'
                  }`}
                >
                  <span className="block text-[15px] font-bold" style={{ color: s.color }}>
                    {s.name}
                  </span>
                  <span className="mt-1 block text-[13px] text-text-muted">{s.role}</span>
                  <span className="block text-[13px] text-text-muted">{s.company}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Раскрытая тема выступления */}
        <div className="mt-8 hidden lg:block">
          {current ? (
            <div className="mx-auto flex max-w-[720px] items-start gap-4 rounded-2xl border border-glass-border bg-glass p-6">
              <span
                className="mt-0.5 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: `${current.color}22`, color: current.color }}
              >
                {current.day}
              </span>
              <span>
                <span className="block text-lg font-bold" style={{ fontFamily: 'var(--font-outfit)' }}>
                  {current.topic}
                </span>
                <span className="mt-1.5 block text-base text-text-muted">
                  {current.name} · {current.role}, {current.company}
                </span>
              </span>
            </div>
          ) : (
            <p className="flex items-center justify-center gap-2.5 text-center text-base text-text-muted">
              <FlaskMark className="!h-5" />
              Нажмите на элемент, чтобы познакомиться с экспертом и его темой
            </p>
          )}
        </div>

        {/* --- Мобильная версия: карточки вместо молекулы --- */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
          {speakers.map((s) => (
            <article
              key={s.name}
              className="flex gap-4 rounded-2xl border border-glass-border bg-glass p-5"
            >
              <span
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 bg-bg-deep"
                style={{ borderColor: s.color }}
              >
                <span
                  className="text-lg font-extrabold"
                  style={{ fontFamily: 'var(--font-outfit)', color: s.color }}
                >
                  {initials(s.name)}
                </span>
              </span>
              <span className="leading-tight">
                <span className="block font-bold">{s.name}</span>
                <span className="mt-1 block text-base text-text-muted">{s.role}</span>
                <span className="block text-base text-text-muted">{s.company}</span>
                <span className="mt-2.5 block text-base" style={{ color: s.color }}>
                  {s.topic}
                </span>
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
