'use client';

import { useState } from 'react';
import { speakers, speakerCore, speakerBonds, speakerThemes } from '@/content/hero';
import { asset } from '@/lib/paths';
import FlaskMark from '@/components/FlaskMark';

/**
 * Блок «Спикеры» (ТЗ 4.4) — плотная молекулярная структура из девяти
 * спикеров и элемента C&B LAB.
 *
 * Раскладка задана вручную (см. speakers в content/hero): три сцепленных
 * кольца, каждый атом связан минимум с двумя соседями, C&B LAB замыкает
 * правое кольцо наравне с остальными и центром не является.
 *
 * ⚠️ Портреты тестовые: стоковые снимки, приведённые к единой монохромной
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
      className="relative border-t border-glass-border bg-bg-main py-16 lg:py-20"
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
          className="relative mx-auto mt-16 hidden w-full lg:block"
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
                onClick={() => setActive(active === i ? null : i)}
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
                  {/* Тёмное стекло поверх портрета */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-full"
                    style={{
                      background: `linear-gradient(165deg, ${color}1f, rgba(6,11,25,0.5))`,
                    }}
                  />
                  {/* Внутренний блик */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.32), rgba(255,255,255,0) 46%)',
                    }}
                  />
                </span>

                {/* Подпись у атома */}
                <span
                  /* 172px — ширина промежутка между соседними атомами:
                     шире подпись начинает наезжать на чужие портреты */
                  className={`absolute w-[172px] leading-tight ${
                    s.label === 'above'
                      ? 'bottom-full left-1/2 mb-4 -translate-x-1/2'
                      : s.label === 'left'
                        ? 'right-full top-1/2 mr-4 -translate-y-1/2 text-right'
                        : 'left-1/2 top-full mt-4 -translate-x-1/2'
                  }`}
                >
                  <span className="block text-[17px] font-bold text-white">{s.name}</span>
                  <span className="mt-1 block text-[14px] text-text-muted">{s.role}</span>
                  <span className="block text-[14px] text-text-muted">{s.company}</span>
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
    </section>
  );
}
