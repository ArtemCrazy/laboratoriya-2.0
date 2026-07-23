'use client';

import { useState } from 'react';
import { speakers, speakerCore, speakerBonds, speakerThemes } from '@/content/hero';
import { asset } from '@/lib/paths';
import FlaskMark from '@/components/FlaskMark';
import SpeakerCard from '@/components/SpeakerCard';

/**
 * Блок «Спикеры» (ТЗ 4.4) — плотная молекулярная структура из девяти
 * спикеров и элемента C&B LAB.
 *
 * Раскладка задана вручную (см. speakers в content/hero): три сцепленных
 * кольца, каждый атом связан минимум с двумя соседями, C&B LAB замыкает
 * правое кольцо наравне с остальными и центром не является.
 *
 * ⚠️ Портреты тестовые: стоковые снимки, приведённые к единой цветовой
 * обработке. Имена, компании и темы — плейсхолдеры.
 */

/** Сцена: в этих координатах считаются и связи, и позиции атомов */
const W = 1400;
const H = 620;

const pointOf = (x: number, y: number) => ({ x: (x / 100) * W, y: (y / 100) * H });

export default function SpeakersMolecule() {
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const lit = hovered ?? active;

  const nodeAt = (i: number) =>
    i === -1
      ? { ...pointOf(speakerCore.x, speakerCore.y), color: '#00E5FF' }
      : {
          ...pointOf(speakers[i].x, speakers[i].y),
          color: speakerThemes[speakers[i].theme],
        };

  return (
    <section
      id="speakers"
      className="relative border-t border-glass-border bg-bg-main py-20 lg:py-32"
    >
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

        {/* --- Молекула: десктоп. Занимает всю ширину блока --- */}
        <div
          className="relative mx-auto mt-20 hidden w-full lg:mb-10 lg:block"
          style={{ aspectRatio: `${W} / ${H}` }}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <defs>
              {speakerBonds.map(([a, b], i) => {
                const p1 = nodeAt(a);
                const p2 = nodeAt(b);
                return (
                  <linearGradient
                    key={i}
                    id={`bond-${i}`}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor={p1.color} stopOpacity="0.55" />
                    <stop offset="100%" stopColor={p2.color} stopOpacity="0.55" />
                  </linearGradient>
                );
              })}
            </defs>

            {speakerBonds.map(([a, b], i) => {
              const p1 = nodeAt(a);
              const p2 = nodeAt(b);
              const on = lit !== null && (lit === a || lit === b);
              return (
                <g key={i}>
                  {/* Стеклянная трубка: тело, светлая грань сверху и тень снизу */}
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="rgba(6,11,25,0.85)"
                    strokeWidth={on ? 18 : 16}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={`url(#bond-${i})`}
                    strokeWidth={on ? 14 : 12}
                    strokeLinecap="round"
                    opacity={on ? 0.85 : 0.5}
                    className="transition-all duration-300"
                  />
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="rgba(255,255,255,0.55)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity={on ? 0.7 : 0.35}
                    className="transition-opacity duration-300"
                    style={{ transform: 'translateY(-3px)' }}
                  />
                  <circle r="3.2" fill={p2.color} opacity="0.9">
                    <animateMotion
                      dur={`${3.4 + (i % 4) * 0.8}s`}
                      repeatCount="indefinite"
                      begin={`${i * -0.6}s`}
                      path={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`}
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* C&B LAB — такой же атом структуры, замыкает правое кольцо.
              Без анимации парения: она перезаписывает transform целиком
              и сбивает центрирование атома по его координате */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${speakerCore.x}%`,
              top: `${speakerCore.y}%`,
              width: speakerCore.size,
              height: speakerCore.size,
            }}
          >
            <div
              className="relative flex h-full w-full flex-col items-center justify-center rounded-full border border-cyan/45 bg-bg-deep/90"
              style={{
                boxShadow: '0 0 34px rgba(0,229,255,0.25), inset 0 3px 18px rgba(255,255,255,0.12)',
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 32% 24%, rgba(255,255,255,0.28), rgba(255,255,255,0) 52%)',
                }}
              />
              <span
                className="relative text-2xl font-extrabold text-white"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                C&amp;B
              </span>
              <span className="relative text-[11px] uppercase tracking-[0.3em] text-cyan">lab</span>
            </div>
          </div>

          {/* Атомы-спикеры */}
          {speakers.map((s, i) => {
            const color = speakerThemes[s.theme];
            const isHot = hovered === i;
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                aria-label={`${s.name}, ${s.role}, ${s.company}`}
                /* Курсор-указатель: по клику будет открываться карточка
                   спикера — её оформление ещё не согласовано */
                className="absolute cursor-pointer rounded-full transition-transform duration-300"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.size,
                  height: s.size,
                  transform: isHot
                    ? 'translate(-50%, -50%) scale(1.08)'
                    : 'translate(-50%, -50%)',
                  zIndex: isHot ? 20 : 10,
                }}
              >
                <span
                  className="relative block h-full w-full overflow-hidden rounded-full border transition-all duration-300"
                  style={{
                    borderColor: isHot ? color : `${color}80`,
                    boxShadow: isHot
                      ? `0 0 48px ${color}55, inset 0 3px 20px rgba(255,255,255,0.20)`
                      : `0 0 24px ${color}2e, inset 0 3px 16px rgba(255,255,255,0.12)`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(s.photo)}
                    alt=""
                    aria-hidden="true"
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                  {/* Имя и должность живут внутри атома: затемнение снизу
                      только под текстом, само фото остаётся чистым */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] rounded-b-full"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(3,6,16,0.92) 38%, rgba(3,6,16,0) 100%)',
                    }}
                  />
                  <span className="absolute inset-x-[14%] bottom-[13%] block text-center leading-tight">
                    <span className="block text-[13px] font-bold text-white">{s.name}</span>
                    <span className="mt-0.5 block text-[11px] text-text-muted">{s.role}</span>
                  </span>
                </span>

                {/* Компания — единственное, что осталось снаружи атома */}
                <span
                  className={`absolute left-1/2 w-[172px] -translate-x-1/2 text-center text-[13px] ${
                    s.label === 'above' ? 'bottom-full mb-2.5' : 'top-full mt-2.5'
                  }`}
                  style={{ color }}
                >
                  {s.company}
                </span>
              </button>
            );
          })}
        </div>

        {/* --- Мобильная версия --- */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
          {speakers.map((s) => {
            const color = speakerThemes[s.theme];
            return (
              <article
                key={s.name}
                className="flex items-center gap-4 rounded-2xl border border-glass-border bg-glass p-4"
              >
                <span
                  className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-full border"
                  style={{ borderColor: `${color}88`, boxShadow: `0 0 18px ${color}33` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(s.photo)}
                    alt=""
                    aria-hidden="true"
                    width={400}
                    height={400}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="leading-tight">
                  <span className="block font-bold">{s.name}</span>
                  <span className="mt-0.5 block text-base text-text-muted">{s.role}</span>
                  <span className="block text-base" style={{ color }}>
                    {s.company}
                  </span>
                </span>
              </article>
            );
          })}
        </div>
      </div>

      {/* Карточка спикера — открывается по клику на атом */}
      <SpeakerCard index={active} onClose={() => setActive(null)} />
    </section>
  );
}
