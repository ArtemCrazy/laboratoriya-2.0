'use client';

import { useState } from 'react';
import { program as builtinProgram, speakers as builtinSpeakers } from '@/content/hero';
import { mediaSrc } from '@/lib/paths';
import { useLiveContent } from '@/lib/useLiveContent';
import { sessionSpeakers } from '@/lib/adminApi';
import FlaskMark from '@/components/FlaskMark';
import BlockNote from '@/components/BlockNote';
import { useLead } from '@/components/LeadProvider';

/**
 * Блок «Программа на два дня» (ТЗ 4.5). Переключатель День 1 / День 2,
 * на десктопе timeline: кружок слева, карточка сессии справа.
 *
 * Правки 29.07: организационные строки и колонка с таймингом убраны,
 * в табах дата стоит под названием дня, кнопка PDF выделена цветом.
 * Цвет плашки задаёт формат: доклады голубые, практические форматы жёлтые.
 *
 * Правки 12.08: тематический блок вынесен заголовком над группой активностей
 * и больше не повторяется в каждой карточке; внутри карточки порядок
 * тип → тема → тезисы → спикер, время выводится, если задано в админке.
 */

const CYAN = '#00E5FF';
const ACCENT = '#FFD54F';

/** Форматы, которые считаем докладными: они голубые, практика — жёлтая */
const REPORT_FORMATS = ['доклад', 'кейс', 'аналитический обзор'];

const formatColor = (format: string) =>
  REPORT_FORMATS.includes(format.trim().toLowerCase()) ? CYAN : ACCENT;

type ProgramSpeaker = { name: string; role: string; company: string; photo: string; topic: string };
type ProgramSession = {
  format: string;
  speaker?: number;
  speakers?: number[];
  topic?: string;
  track?: string;
  theses?: string[];
  time?: string;
};
type ProgramDay = { day: string; date: string; sessions: ProgramSession[] };

/**
 * Соседние активности с одинаковым тематическим блоком идут одной группой:
 * название блока показываем один раз, заголовком над ними.
 */
function groupByTrack(sessions: ProgramSession[]) {
  const groups: { track: string; sessions: ProgramSession[] }[] = [];
  for (const s of sessions) {
    const track = s.track?.trim() ?? '';
    const last = groups[groups.length - 1];
    if (last && last.track === track) last.sessions.push(s);
    else groups.push({ track, sessions: [s] });
  }
  return groups;
}

/** «Блок 1. Рынок труда…» → номер отдельной плашкой, название рядом */
function splitTrack(track: string) {
  const m = track.match(/^(Блок\s*\d+)\s*[.:]?\s*(.+)$/i);
  return m ? { badge: m[1], title: m[2] } : { badge: '', title: track };
}

export default function Program() {
  const openLead = useLead();
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

          {/* Правки 04.08: программу присылаем по заявке, а не файлом */}
          <button
            type="button"
            onClick={() => openLead('program')}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2.5 self-start rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-text-dark transition-colors hover:bg-accent-hover lg:self-auto"
          >
            <IconDownload />
            Запросить программу
          </button>
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

        {/* Тематические блоки: заголовок и под ним активности блока */}
        <div className="mt-10 flex flex-col gap-2">
          {groupByTrack(current.sessions).map((group, gi) => {
            const { badge, title: trackTitle } = splitTrack(group.track);
            return (
              <div key={gi}>
                {group.track && (
                  <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-cyan/25 bg-cyan/[0.07] px-5 py-4">
                    {badge && (
                      <span className="rounded-full bg-cyan/15 px-3 pb-[3px] pt-[5px] text-[11px] font-bold uppercase tracking-wider text-cyan">
                        {badge}
                      </span>
                    )}
                    <h3
                      className="text-[clamp(17px,1.7vw,22px)] font-bold leading-snug"
                      style={{ fontFamily: 'var(--font-outfit)' }}
                    >
                      {trackTitle}
                    </h3>
                  </div>
                )}

                {/* Timeline: слева кружок с линией, справа карточка активности */}
                <div className="flex flex-col">
                  {group.sessions.map((s, i) => {
                    // Выступающих может быть несколько, а может не быть вовсе:
                    // тема известна, спикера объявят позже
                    const people = sessionSpeakers(s)
                      .map((idx) => speakers[idx])
                      .filter(Boolean);
                    const title = s.topic?.trim() || people[0]?.topic;
                    const theses = (s.theses ?? []).map((t) => t.trim()).filter(Boolean);
                    // Совсем пустую карточку не рисуем: ни спикера, ни темы
                    if (!people.length && !title) return null;
                    const color = formatColor(s.format);
                    const time = s.time?.trim();
                    return (
                      <div key={i} className="flex gap-4 sm:gap-6">
                        {/* Колонка таймлайна: тайминг убран, остались кружки */}
                        <div className="flex w-4 shrink-0 flex-col items-center sm:w-5">
                          <span
                            className="mt-5 h-3 w-3 shrink-0 rounded-full"
                            style={{ background: color }}
                          />
                          {i < group.sessions.length - 1 && (
                            <span className="mt-1 w-px flex-1 bg-glass-border" />
                          )}
                        </div>

                        {/* Карточка активности: тип → тема → тезисы → спикер */}
                        <div className="flex-1 pb-6">
                          <div className="rounded-2xl border border-glass-border bg-glass p-5 transition-colors hover:border-cyan/40">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                              {time && (
                                <span className="text-[13px] font-bold tabular-nums text-white/80">
                                  {time}
                                </span>
                              )}
                              <span
                                className="inline-block rounded-full border px-3 pb-[3px] pt-[5px] text-[11px] font-semibold uppercase tracking-wider"
                                style={{ borderColor: `${color}55`, color }}
                              >
                                {s.format}
                              </span>
                            </div>

                            {/* Тема сессии перекрывает тему из карточки спикера:
                                один спикер может выступать дважды по-разному */}
                            <p
                              className="mt-3 text-[17px] font-bold leading-snug"
                              style={{ fontFamily: 'var(--font-outfit)' }}
                            >
                              {title}
                            </p>

                            {/* Тезисы доклада */}
                            {theses.length > 0 && (
                              <ul className="mt-3 flex flex-col gap-1.5">
                                {theses.map((t, k) => (
                                  <li key={k} className="flex gap-2.5 text-[15px] leading-snug">
                                    <span
                                      aria-hidden="true"
                                      className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                                      style={{ background: color }}
                                    />
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            )}

                            {/* Спикеры — в самом низу карточки, жирным */}
                            {people.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-x-7 gap-y-4 border-t border-glass-border pt-4">
                                {people.map((p, k) => (
                                  <div key={k} className="flex items-center gap-3">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={mediaSrc(p.photo)}
                                      alt=""
                                      aria-hidden="true"
                                      width={400}
                                      height={400}
                                      className="h-14 w-14 shrink-0 rounded-full border-2 object-cover"
                                      style={{
                                        borderColor: `${color}66`,
                                        background: 'var(--color-bg-main)',
                                      }}
                                    />
                                    <div className="min-w-0">
                                      <p className="text-[15px] font-bold leading-snug">{p.name}</p>
                                      <p className="mt-0.5 text-[13px] font-bold leading-snug text-text-muted">
                                        {[p.role, p.company].filter(Boolean).join(', ')}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
