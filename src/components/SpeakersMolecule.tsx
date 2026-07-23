'use client';

import { useState } from 'react';
import { speakers, speakerThemes } from '@/content/hero';
import { asset } from '@/lib/paths';
import FlaskMark from '@/components/FlaskMark';
import SpeakerCard from '@/components/SpeakerCard';

/**
 * Блок «Спикеры» (ТЗ 4.4) — регулярная ромбическая решётка.
 *
 * Узлы стоят на треугольной решётке: соседние ряды сдвинуты на полшага,
 * поэтому все связи одинаковой длины и между ними складываются ромбы.
 * Структура симметрична и достраивается вниз — добавили ряд, стало больше
 * мест. Один узел отдан C&B LAB, остальные — спикерам.
 *
 * Данные и фото — реальные спикеры первой конференции (cblabconference.ru).
 */

const W = 1400;
const H = 680;
const ATOM = 168; // одинаковый диаметр атома — решётка регулярная

/** Ряды решётки: количество узлов. Добавить ряд — структура растёт вниз */
const ROWS = [3, 4, 3];
/** Индекс узла, отданного под C&B LAB (второй в среднем ряду) */
const LAB_INDEX = 4;

/** Горизонтальный шаг и вертикальные уровни в процентах сцены */
const DX = 25.3;
const Y = [18, 50, 82];

/** Позиции всех узлов решётки, слева направо, сверху вниз */
const NODES: { x: number; y: number }[] = ROWS.flatMap((count, r) => {
  const span = (count - 1) * DX;
  return Array.from({ length: count }, (_, c) => ({
    x: 50 - span / 2 + c * DX,
    y: Y[r],
  }));
});

/** Связи: узлы соседних рядов на расстоянии ~полушага по горизонтали */
const BONDS: [number, number][] = (() => {
  const bonds: [number, number][] = [];
  let base = 0;
  for (let r = 0; r < ROWS.length - 1; r++) {
    const upStart = base;
    const downStart = base + ROWS[r];
    for (let i = 0; i < ROWS[r]; i++) {
      for (let j = 0; j < ROWS[r + 1]; j++) {
        const dx = Math.abs(NODES[upStart + i].x - NODES[downStart + j].x);
        if (dx < DX * 0.6) bonds.push([upStart + i, downStart + j]);
      }
    }
    base += ROWS[r];
  }
  return bonds;
})();

/** Соответствие узел → спикер: LAB-узел пропускаем */
const NODE_SPEAKER: (number | null)[] = (() => {
  const map: (number | null)[] = [];
  let si = 0;
  for (let i = 0; i < NODES.length; i++) {
    map.push(i === LAB_INDEX ? null : si++);
  }
  return map;
})();

const pointOf = (n: { x: number; y: number }) => ({ x: (n.x / 100) * W, y: (n.y / 100) * H });

export default function SpeakersMolecule() {
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const litSpeaker = hovered ?? active;
  const litNode = litSpeaker === null ? null : NODE_SPEAKER.indexOf(litSpeaker);

  const colorOfNode = (i: number) => {
    const sp = NODE_SPEAKER[i];
    return sp === null ? '#00E5FF' : speakerThemes[speakers[sp].theme];
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

        {/* --- Решётка: десктоп --- */}
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
              {BONDS.map(([a, b], i) => {
                const p1 = pointOf(NODES[a]);
                const p2 = pointOf(NODES[b]);
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
                    <stop offset="0%" stopColor={colorOfNode(a)} stopOpacity="0.55" />
                    <stop offset="100%" stopColor={colorOfNode(b)} stopOpacity="0.55" />
                  </linearGradient>
                );
              })}
            </defs>

            {BONDS.map(([a, b], i) => {
              const p1 = pointOf(NODES[a]);
              const p2 = pointOf(NODES[b]);
              const on = litNode !== null && (litNode === a || litNode === b);
              return (
                <g key={i}>
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
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity={on ? 0.7 : 0.35}
                    className="transition-opacity duration-300"
                    style={{ transform: 'translateY(-3px)' }}
                  />
                  <circle r="3.2" fill={colorOfNode(b)} opacity="0.9">
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

          {NODES.map((node, i) => {
            const sp = NODE_SPEAKER[i];

            // Узел C&B LAB
            if (sp === null) {
              return (
                <div
                  key="lab"
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${node.x}%`, top: `${node.y}%`, width: ATOM, height: ATOM }}
                >
                  <div
                    className="relative flex h-full w-full flex-col items-center justify-center rounded-full border border-cyan/45 bg-bg-deep/90"
                    style={{
                      boxShadow:
                        '0 0 34px rgba(0,229,255,0.25), inset 0 3px 18px rgba(255,255,255,0.12)',
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
                    <span className="relative text-[11px] uppercase tracking-[0.3em] text-cyan">
                      lab
                    </span>
                  </div>
                </div>
              );
            }

            // Узел-спикер
            const s = speakers[sp];
            const color = speakerThemes[s.theme];
            const isHot = hovered === sp;
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => setActive(sp)}
                onMouseEnter={() => setHovered(sp)}
                onMouseLeave={() => setHovered(null)}
                aria-label={`${s.name}, ${s.role}, ${s.company}`}
                className="absolute cursor-pointer rounded-full transition-transform duration-300"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  width: ATOM,
                  height: ATOM,
                  transform: isHot
                    ? 'translate(-50%, -50%) scale(1.06)'
                    : 'translate(-50%, -50%)',
                  zIndex: isHot ? 20 : 10,
                }}
              >
                <span
                  className="relative block h-full w-full overflow-hidden rounded-full transition-shadow duration-300"
                  style={{ boxShadow: isHot ? `0 0 48px ${color}55` : `0 0 24px ${color}2e` }}
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
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%]"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(3,6,16,0.94) 34%, rgba(3,6,16,0) 100%)',
                    }}
                  />
                  <span className="absolute inset-x-[12%] bottom-[11%] block text-center leading-tight">
                    <span className="block text-[14px] font-bold text-white">{s.name}</span>
                    <span className="mt-0.5 block text-[12px]" style={{ color }}>
                      {s.company}
                    </span>
                  </span>
                </span>

                {/* Обводка отдельным кольцом — край ровный, без «пунктира» */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full transition-shadow duration-300"
                  style={{
                    boxShadow: isHot
                      ? `inset 0 0 0 2px ${color}, inset 0 3px 20px rgba(255,255,255,0.20)`
                      : `inset 0 0 0 1.5px ${color}80, inset 0 3px 16px rgba(255,255,255,0.12)`,
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* --- Мобильная версия --- */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
          {speakers.map((s, i) => {
            const color = speakerThemes[s.theme];
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => setActive(i)}
                className="flex items-center gap-4 rounded-2xl border border-glass-border bg-glass p-4 text-left"
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
              </button>
            );
          })}
        </div>
      </div>

      {/* Карточка спикера — открывается по клику на атом */}
      <SpeakerCard index={active} onClose={() => setActive(null)} />
    </section>
  );
}
