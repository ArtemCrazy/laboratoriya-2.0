'use client';

import { useState } from 'react';
import { speakers, speakerCore, speakerBonds, speakerThemes } from '@/content/hero';
import { asset } from '@/lib/paths';
import FlaskMark from '@/components/FlaskMark';

/**
 * Блок «Спикеры» (ТЗ 4.4) — асимметричная молекулярная структура.
 *
 * Раскладка задана вручную (см. speakers в content/hero): атомы разного
 * размера стоят на разных уровнях, часть перекрывает друг друга, ядро
 * смещено влево от центра. Часть связей идёт напрямую между спикерами,
 * минуя ядро — поэтому силуэт не читается как радиальная схема.
 *
 * ⚠️ Портреты — тестовые, из открытого сервиса-заглушки. Имена, компании
 * и темы тоже плейсхолдеры: заказчик состав не передавал.
 */

/** Сцена в этих координатах — по ней считаются и связи, и позиции атомов */
const W = 1000;
const H = 520;

const pointOf = (x: number, y: number) => ({ x: (x / 100) * W, y: (y / 100) * H });

export default function SpeakersMolecule() {
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  // Подсвечиваем связи и от наведения, и от выбора
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
      className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28"
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

        {/* --- Молекула: десктоп --- */}
        {/* Молекула держится в 86% ширины блока — иначе структура
            расползается и перестаёт читаться единым объектом */}
        <div
          className="relative mx-auto mt-16 hidden w-full max-w-[97%] lg:block"
          style={{ aspectRatio: `${W} / ${H}` }}
        >
          {/* Связи: объёмные стеклянные перемычки со световым импульсом */}
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
                    <stop offset="0%" stopColor={p1.color} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={p2.color} stopOpacity="0.5" />
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
                  {/* Тело связи — толстая полупрозрачная перемычка */}
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={`url(#bond-${i})`}
                    strokeWidth={on ? 13 : 10}
                    strokeLinecap="round"
                    opacity={on ? 0.5 : 0.28}
                    className="transition-all duration-300"
                  />
                  {/* Светлая сердцевина — стекло, а не плоская линия */}
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity={on ? 0.6 : 0.3}
                    className="transition-opacity duration-300"
                  />
                  {/* Импульс, бегущий внутри связи */}
                  <circle r="2.6" fill={p2.color} opacity="0.9">
                    <animateMotion
                      dur={`${3.2 + (i % 4) * 0.9}s`}
                      repeatCount="indefinite"
                      begin={`${i * -0.7}s`}
                      path={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`}
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* C&B LAB — рядовой небольшой атом в связке, не центр структуры */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 animate-float"
            style={{
              left: `${speakerCore.x}%`,
              top: `${speakerCore.y}%`,
              width: speakerCore.size,
              height: speakerCore.size,
              animationDelay: '0.4s',
            }}
          >
            <div
              className="relative flex h-full w-full flex-col items-center justify-center rounded-full border border-cyan/40 bg-bg-deep/90"
              style={{ boxShadow: '0 0 24px rgba(0,229,255,0.20), inset 0 2px 14px rgba(255,255,255,0.10)' }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 32% 24%, rgba(255,255,255,0.26), rgba(255,255,255,0) 52%)',
                }}
              />
              <span
                className="relative text-lg font-extrabold text-white"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                C&amp;B
              </span>
              <span className="relative text-[10px] uppercase tracking-[0.3em] text-cyan">
                lab
              </span>
            </div>
          </div>

          {/* Атомы-спикеры */}
          {speakers.map((s, i) => {
            const color = speakerThemes[s.theme];
            const on = active === i;
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => setActive(on ? null : i)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                aria-label={`${s.name}, ${s.role}, ${s.company}`}
                className="animate-float group absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-300 hover:z-10 hover:scale-[1.08]"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: s.size,
                  height: s.size,
                  animationDelay: `${i * 0.7}s`,
                }}
              >
                <span
                  className="relative block h-full w-full overflow-hidden rounded-full border"
                  style={{
                    borderColor: `${color}88`,
                    boxShadow: on
                      ? `0 0 42px ${color}66, inset 0 2px 16px rgba(255,255,255,0.18)`
                      : `0 0 26px ${color}33, inset 0 2px 14px rgba(255,255,255,0.12)`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(s.photo)}
                    alt=""
                    aria-hidden="true"
                    width={320}
                    height={320}
                    className="h-full w-full object-cover"
                    style={{ filter: 'saturate(0.85) contrast(1.05) brightness(0.92)' }}
                  />
                  {/* Стекло поверх фотографии: вуаль темы и блик */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-full"
                    style={{ background: `linear-gradient(160deg, ${color}22, rgba(6,11,25,0.55))` }}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle at 30% 22%, rgba(255,255,255,0.34), rgba(255,255,255,0) 48%)',
                    }}
                  />
                  {/* Индикатор показываем по состоянию, а не CSS-классом
                      наведения: так он гарантированно скрыт в покое */}
                  <span
                    className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center bg-bg-deep/85 py-1.5 text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm transition-opacity duration-200"
                    style={{ color, opacity: hovered === i ? 1 : 0 }}
                  >
                    Открыть профиль
                  </span>

                  {/* Частицы внутри — у части атомов */}
                  {i % 3 === 0 && (
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
                      {[0, 1, 2].map((b) => (
                        <span
                          key={b}
                          className="animate-bubble absolute rounded-full bg-white/70"
                          style={{
                            left: `${38 + b * 12}%`,
                            bottom: `${18 + b * 6}%`,
                            width: 3 - b * 0.5,
                            height: 3 - b * 0.5,
                            ['--rise' as string]: `${s.size * 0.3}px`,
                            ['--bubble-duration' as string]: '6s',
                            animationDelay: `${b * 1.6}s`,
                          }}
                        />
                      ))}
                    </span>
                  )}
                </span>

                {/* Подпись: имя, должность, компания */}
                <span
                  className={`absolute w-[190px] leading-tight ${
                    s.label === 'above'
                      ? 'bottom-full left-1/2 mb-3 -translate-x-1/2'
                      : s.label === 'right'
                        ? 'left-full top-1/2 ml-4 -translate-y-1/2 text-left'
                        : 'left-1/2 top-full mt-3 -translate-x-1/2'
                  }`}
                >
                  <span className="block text-[15px] font-bold text-white">{s.name}</span>
                  <span className="mt-0.5 block text-[13px] text-text-muted">{s.role}</span>
                  <span className="block text-[13px]" style={{ color }}>
                    {s.company}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-14 hidden items-center justify-center gap-2.5 text-center text-base text-text-muted lg:flex">
          <FlaskMark className="!h-5" />
          Нажмите на элемент, чтобы познакомиться с экспертом и его темой
        </p>

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
                    width={320}
                    height={320}
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
