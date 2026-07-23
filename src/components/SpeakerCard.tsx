'use client';

import { useEffect } from 'react';
import { speakers, speakerThemes } from '@/content/hero';
import { asset } from '@/lib/paths';

/**
 * Карточка спикера — открывается по клику на атом молекулы.
 * Собрана по макету владельца: шапка с номером элемента, портрет
 * и символ, тема выступления, «формула экспертизы» из тегов,
 * блоки опыта и статуса, кнопка перехода к выступлению.
 */
export default function SpeakerCard({
  index,
  onClose,
}: {
  index: number | null;
  onClose: () => void;
}) {
  // Esc закрывает карточку, фон под ней не прокручивается
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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${s.name}, ${s.role}`}
    >
      {/* Подложка: клик по ней закрывает */}
      <button
        type="button"
        aria-label="Закрыть карточку"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-bg-deep/80 backdrop-blur-sm"
      />

      <div
        className="relative w-full max-w-[380px] overflow-hidden rounded-3xl border bg-bg-main"
        style={{
          borderColor: `${color}40`,
          boxShadow: `0 30px 90px rgba(0,0,0,0.6), 0 0 60px ${color}1f`,
        }}
      >
        {/* Полоса цвета темы сверху */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: color }}
        />

        <div className="flex items-center justify-between px-6 pt-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
            Элемент / {s.num}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-glass hover:text-white"
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

        {/* Символ элемента, портрет и имя */}
        <div className="flex items-start gap-4 px-6 pt-4">
          <span
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-xl border text-xl font-extrabold"
            style={{
              borderColor: `${color}55`,
              color,
              background: `${color}12`,
              fontFamily: 'var(--font-outfit)',
            }}
          >
            {s.symbol}
          </span>

          <span
            className="relative block h-[92px] w-[78px] shrink-0 overflow-hidden rounded-xl border"
            style={{ borderColor: `${color}40` }}
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

          <span className="min-w-0 pt-0.5">
            <span
              className="block text-[22px] font-extrabold leading-[1.15]"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {s.name}
            </span>
            <span className="mt-2 block text-sm text-text-muted">{s.role}</span>
            <span className="mt-1 flex items-center gap-1.5 text-sm text-text-muted">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: color }}
              />
              {s.company}
            </span>
          </span>
        </div>

        <div className="mx-6 mt-5 border-t border-glass-border" />

        {/* Тема выступления */}
        <div className="px-6 pt-5">
          <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color }}>
            Тема выступления
          </div>
          <p
            className="mt-2 text-[17px] font-bold leading-snug"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            {s.topic}
          </p>
        </div>

        {/* Формула экспертизы: теги складываются в результат */}
        <div className="px-6 pt-5">
          <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted">
            Формула экспертизы
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {s.formula.map((tag, i) => (
              <span key={tag} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-text-muted">+</span>}
                <span
                  className="rounded-lg border px-2.5 py-1 text-[13px]"
                  style={{ borderColor: `${color}40`, color }}
                >
                  {tag}
                </span>
              </span>
            ))}
          </div>
          <div className="mt-2.5 flex items-center gap-2 text-[13px] text-text-muted">
            <span>=</span>
            <span className="text-white">{s.formulaResult}</span>
          </div>
        </div>

        {/* Опыт и статус */}
        <div className="mt-5 grid grid-cols-2 gap-px border-y border-glass-border bg-glass-border">
          <div className="bg-bg-main px-6 py-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Опыт</div>
            <div className="mt-1.5 flex items-start gap-2 text-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset('/img/flask-icon.webp')}
                alt=""
                aria-hidden="true"
                width={226}
                height={320}
                className="mt-0.5 h-5 w-auto"
              />
              {s.experience}
            </div>
          </div>
          <div className="bg-bg-main px-6 py-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted">Статус</div>
            <div className="mt-1.5 flex items-start gap-2 text-sm">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                aria-hidden="true"
                className="mt-0.5 shrink-0"
                style={{ color }}
              >
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
              {s.status}
            </div>
          </div>
        </div>

        <div className="p-6">
          <a
            href="#program"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-full border py-3 text-sm font-semibold transition-colors"
            style={{ borderColor: `${color}55`, color }}
          >
            Подробнее о выступлении
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
