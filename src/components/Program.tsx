'use client';

import { useState } from 'react';
import { program, speakers, speakerThemes } from '@/content/hero';
import { asset } from '@/lib/paths';
import FlaskMark from '@/components/FlaskMark';

/**
 * Блок «Программа на два дня» (ТЗ 4.5). Переключатель День 1 / День 2,
 * на десктопе timeline: время слева, карточка сессии справа. Формат, тема,
 * фото и данные спикера. Кнопка скачивания PDF.
 *
 * ⚠️ Расписание — плейсхолдер (см. program в content/hero). Сессии собраны
 * из реальных спикеров первой конференции, реальную программу заменим.
 */
export default function Program() {
  const [day, setDay] = useState(0);
  const current = program[day];

  return (
    <section id="program" className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28">
      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="mb-3 flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-cyan">
          <FlaskMark />
          Программа
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2
            className="text-[clamp(26px,3.4vw,44px)] font-extrabold leading-[1.15] tracking-tight"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            Два дня практики и разбора реальных кейсов
          </h2>

          {/* Скачать программу PDF */}
          <a
            href="#"
            className="inline-flex shrink-0 items-center gap-2.5 self-start rounded-full border border-glass-border bg-glass px-5 py-3 text-sm font-semibold transition-colors hover:border-cyan/50 hover:text-cyan lg:self-auto"
          >
            <IconDownload />
            Скачать программу PDF
          </a>
        </div>

        {/* Переключатель дней */}
        <div className="mt-8 inline-flex rounded-full border border-glass-border bg-glass p-1.5">
          {program.map((d, i) => {
            const active = i === day;
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => setDay(i)}
                aria-pressed={active}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  active ? 'bg-accent text-text-dark' : 'text-text-muted hover:text-white'
                }`}
              >
                {d.day}
                <span className="ml-2 font-normal opacity-70">{d.date}</span>
              </button>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="mt-10 flex flex-col">
          {current.sessions.map((s, i) => {
            const sp = s.speaker !== undefined ? speakers[s.speaker] : null;
            const color = sp ? speakerThemes[sp.theme] : '#00E5FF';
            const service = !sp;
            return (
              <div key={i} className="group flex gap-4 sm:gap-6">
                {/* Время + линия таймлайна */}
                <div className="flex w-[54px] shrink-0 flex-col items-center sm:w-[68px]">
                  <span
                    className="pt-0.5 font-mono text-[13px] font-semibold text-text-muted"
                    style={{ fontFamily: 'var(--font-outfit)' }}
                  >
                    {s.time}
                  </span>
                  <span className="mt-2 h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                  {i < current.sessions.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-glass-border" />
                  )}
                </div>

                {/* Карточка сессии */}
                <div className="flex-1 pb-6">
                  <div
                    className={`rounded-2xl border p-5 transition-colors ${
                      service
                        ? 'border-glass-border/60 bg-transparent'
                        : 'border-glass-border bg-glass hover:border-cyan/40'
                    }`}
                  >
                    <span
                      className="inline-block rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
                      style={{ borderColor: `${color}55`, color }}
                    >
                      {s.format}
                    </span>

                    {sp ? (
                      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                        {/* Фото спикера слева */}
                        <span
                          className="block h-16 w-16 shrink-0 overflow-hidden rounded-full border"
                          style={{ borderColor: `${color}66` }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={asset(sp.photo)}
                            alt=""
                            aria-hidden="true"
                            width={400}
                            height={400}
                            className="h-full w-full object-cover"
                          />
                        </span>
                        <div className="min-w-0">
                          <p
                            className="text-[17px] font-bold leading-snug"
                            style={{ fontFamily: 'var(--font-outfit)' }}
                          >
                            {sp.topic}
                          </p>
                          <p className="mt-1.5 text-sm text-text-muted">
                            {sp.name} · {sp.role}, {sp.company}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p
                        className="mt-3 text-[17px] font-bold leading-snug"
                        style={{ fontFamily: 'var(--font-outfit)' }}
                      >
                        {s.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function IconDownload() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2.5v8m0 0 3-3m-3 3-3-3M3 13h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
