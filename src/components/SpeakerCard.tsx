'use client';

import { useEffect } from 'react';
import { speakers, speakerThemes } from '@/content/hero';
import { asset } from '@/lib/paths';

/**
 * Карточка спикера — открывается по клику на атом молекулы.
 * Горизонтальный формат по макету владельца: круглый портрет с меткой
 * символа слева, имя и должность справа; ниже в две колонки тема
 * и опыт, затем формула экспертизы и строка-подвал.
 */
export default function SpeakerCard({
  index,
  onClose,
}: {
  index: number | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [index, onClose]);

  if (index === null) return null;

  const s = speakers[index];
  const color = speakerThemes[s.theme];

  // «8 лет в Total Rewards» → крупное «8 лет» и приглушённый остаток
  const expMatch = s.experience.match(/^(\d+\s+\S+)\s+(.*)$/);
  const expValue = expMatch ? expMatch[1] : s.experience;
  const expTail = expMatch ? expMatch[2] : '';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${s.name}, ${s.role}`}
    >
      <button
        type="button"
        aria-label="Закрыть карточку"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-bg-deep/80 backdrop-blur-sm"
      />

      <div
        className="relative w-full max-w-[600px] overflow-hidden rounded-[28px] border border-glass-border bg-bg-main"
        style={{ boxShadow: '0 30px 90px rgba(0,0,0,0.6)' }}
      >
        {/* Свечение цвета темы в верхней части */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40"
          style={{ background: `linear-gradient(to bottom, ${color}18, transparent)` }}
        />

        <div className="relative flex items-center justify-between px-8 pt-7">
          <span className="font-mono text-[12px] uppercase tracking-[0.24em] text-text-muted">
            Элемент / {s.num}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-glass-border text-text-muted transition-colors hover:bg-glass hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3.5 3.5l9 9m0-9l-9 9"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Шапка: круглый портрет с меткой символа + имя */}
        <div className="relative flex items-center gap-6 px-8 pt-5">
          <span className="relative shrink-0">
            <span
              className="block h-[118px] w-[118px] overflow-hidden rounded-full border-2"
              style={{ borderColor: color, boxShadow: `0 0 26px ${color}44` }}
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
            <span
              className="absolute -bottom-1 -right-1 flex h-[42px] w-[42px] items-center justify-center rounded-full border-2 text-[15px] font-extrabold"
              style={{
                borderColor: color,
                color,
                background: 'var(--color-bg-main)',
                fontFamily: 'var(--font-outfit)',
              }}
            >
              {s.symbol}
            </span>
          </span>

          <span className="min-w-0">
            <span
              className="block text-[28px] font-extrabold leading-[1.08]"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {s.name}
            </span>
            <span className="mt-2 block text-[15px] text-text-muted">{s.role}</span>
            <span className="mt-1.5 flex items-center gap-2 text-[15px] text-text-muted">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: color }}
              />
              {s.company}
            </span>
          </span>
        </div>

        <div className="mx-8 mt-6 border-t border-glass-border" />

        {/* Тема и опыт в две колонки */}
        <div className="grid grid-cols-[1.5fr_1fr] gap-6 px-8 pt-6">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
              <FlaskGlyph color={color} />
              Тема выступления
            </div>
            <p
              className="mt-2.5 text-[19px] font-bold leading-[1.28]"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {s.topic}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
              <ShieldGlyph color={color} />
              Опыт
            </div>
            <div
              className="mt-2.5 text-[26px] font-extrabold leading-none"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {expValue}
            </div>
            {expTail && <div className="mt-1.5 text-sm text-text-muted">{expTail}</div>}
          </div>
        </div>

        {/* Формула экспертизы */}
        <div className="px-8 pt-6">
          <div className="text-[11px] uppercase tracking-[0.18em] text-text-muted">
            Формула экспертизы
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {s.formula.map((tag, i) => (
              <span key={tag} className="flex items-center gap-2">
                {i > 0 && <span className="text-text-muted">+</span>}
                <span
                  className="rounded-full border px-3.5 py-1.5 text-[14px]"
                  style={{ borderColor: `${color}55`, color }}
                >
                  {tag}
                </span>
              </span>
            ))}
            <span className="text-text-muted">=</span>
            <span
              className="rounded-full border px-4 py-1.5 text-[14px] font-semibold"
              style={{ borderColor: color, color, background: `${color}1f` }}
            >
              {s.formulaResult}
            </span>
          </div>
        </div>

        {/* Подвал: статус и опыт */}
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-glass-border px-8 py-5 text-sm text-text-muted">
          <span className="flex items-center gap-2">
            <ShieldGlyph color={color} />
            {s.status}
          </span>
          <span className="flex items-center gap-2">
            <FlaskGlyph color={color} />
            {s.experience}
          </span>
        </div>
      </div>
    </div>
  );
}

function FlaskGlyph({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ color }}>
      <path
        d="M6.5 1.5v4.2L3 12.2A1.4 1.4 0 0 0 4.2 14.5h7.6A1.4 1.4 0 0 0 13 12.2L9.5 5.7V1.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M5.5 1.5h5M4.6 9.8h6.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ShieldGlyph({ color }: { color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true" style={{ color }}>
      <path
        d="M9 1.8 15 4v5c0 3.6-2.5 6.4-6 7.2C5.5 15.4 3 12.6 3 9V4l6-2.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="m6.4 9 1.9 1.9L11.8 7.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
