'use client';

import { useState } from 'react';
import { program as builtinProgram, speakers as builtinSpeakers } from '@/content/hero';
import { mediaSrc } from '@/lib/paths';
import { useLiveContent } from '@/lib/useLiveContent';
import FlaskMark from '@/components/FlaskMark';
import BlockNote from '@/components/BlockNote';

/**
 * Блок «Программа на два дня» (ТЗ 4.5). Переключатель День 1 / День 2,
 * на десктопе timeline: кружок слева, карточка сессии справа.
 *
 * Правки 29.07: организационные строки и колонка с таймингом убраны,
 * в табах дата стоит под названием дня, кнопка PDF выделена цветом.
 * Цвет плашки задаёт формат: доклады голубые, практические форматы жёлтые.
 *
 * ⚠️ Расписание — плейсхолдер (см. program в content/hero). Сессии собраны
 * из реальных спикеров первой конференции, реальную программу заменим.
 */

const CYAN = '#00E5FF';
const ACCENT = '#FFD54F';

/** Доклад — голубой, всё остальное практика — жёлтый (правки 29.07) */
const formatColor = (format: string) => (format === 'Доклад' ? CYAN : ACCENT);

type ProgramSpeaker = { name: string; role: string; company: string; photo: string; topic: string };
type ProgramDay = {
  day: string;
  date: string;
  sessions: { format: string; speaker: number; topic?: string }[];
};

export default function Program() {
  const [day, setDay] = useState(0);
  // Данные из админки, пока их нет — вшитые в сборку
  const program = useLiveContent<ProgramDay[]>('program', builtinProgram as never);
  const speakers = useLiveContent<ProgramSpeaker[]>('speakers', builtinSpeakers as never);

  // День мог исчезнуть после правки в админке — не падаем на пустоте
  const current = program[day] ?? program[0];
  if (!current) return null;

  return (
    <section id="program" className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28">
      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="mb-3 flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-cyan">
          <FlaskMark />
          Программа
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2
            className="max-w-[760px] text-[clamp(26px,3.4vw,44px)] font-extrabold leading-[1.15] tracking-tight"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            Два дня практики, реальных кейсов и совместной работы над C&B-задачами
          </h2>

          {/* Правки 29.07: кнопка выделена цветом */}
          <a
            href="#"
            className="inline-flex shrink-0 items-center gap-2.5 self-start rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-text-dark transition-colors hover:bg-accent-hover lg:self-auto"
          >
            <IconDownload />
            Скачать программу PDF
          </a>
        </div>

        <BlockNote section="program" />

        {/* Переключатель дней: название, под ним дата */}
        <div className="mt-8 inline-flex rounded-2xl border border-glass-border bg-glass p-1.5">
          {program.map((d, i) => {
            const active = i === day;
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => setDay(i)}
                aria-pressed={active}
                className={`cursor-pointer rounded-xl px-7 py-3 text-center transition-colors ${
                  active ? 'bg-accent text-text-dark' : 'text-text-muted hover:text-white'
                }`}
              >
                <span
                  className="block text-[17px] font-bold leading-tight"
                  style={{ fontFamily: 'var(--font-outfit)' }}
                >
                  {d.day}
                </span>
                <span className="mt-0.5 block text-[13px] font-medium opacity-75">{d.date}</span>
              </button>
            );
          })}
        </div>

        {/* Timeline: слева кружок с линией, справа карточка сессии */}
        <div className="mt-10 flex flex-col">
          {current.sessions.map((s, i) => {
            const sp = speakers[s.speaker];
            // Спикера могли удалить в админке — такую сессию просто не выводим
            if (!sp) return null;
            const color = formatColor(s.format);
            return (
              <div key={i} className="flex gap-4 sm:gap-6">
                {/* Колонка таймлайна: тайминг убран, остались кружки */}
                <div className="flex w-4 shrink-0 flex-col items-center sm:w-5">
                  <span
                    className="mt-5 h-3 w-3 shrink-0 rounded-full"
                    style={{ background: color }}
                  />
                  {i < current.sessions.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-glass-border" />
                  )}
                </div>

                {/* Карточка сессии */}
                <div className="flex-1 pb-6">
                  <div className="rounded-2xl border border-glass-border bg-glass p-5 transition-colors hover:border-cyan/40">
                    <span
                      className="inline-block rounded-full border px-3 pb-[3px] pt-[5px] text-[11px] font-semibold uppercase tracking-wider"
                      style={{ borderColor: `${color}55`, color }}
                    >
                      {s.format}
                    </span>

                    <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
                      {/* Фото спикера слева */}
                      <span
                        className="block h-16 w-16 shrink-0 overflow-hidden rounded-full border"
                        style={{ borderColor: `${color}66` }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={mediaSrc(sp.photo)}
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
                          {/* Тема сессии перекрывает тему из карточки спикера:
                              один спикер может выступать дважды по-разному */}
                          {s.topic?.trim() || sp.topic}
                        </p>
                        <p className="mt-1.5 text-sm text-text-muted">
                          {sp.name} · {sp.role}, {sp.company}
                        </p>
                      </div>
                    </div>
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
