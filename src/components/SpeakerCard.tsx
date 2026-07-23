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

      {/* Рамка нейтральная: цвет темы живёт в полосе и свечении сверху,
          по периметру он превращал карточку в игровое окно */}
      <div
        className="relative w-full max-w-[400px] overflow-hidden rounded-3xl border border-glass-border bg-bg-main"
        style={{ boxShadow: '0 30px 90px rgba(0,0,0,0.6)' }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: color }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-32"
          style={{ background: `linear-gradient(to bottom, ${color}1c, transparent)` }}
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

        {/* Портрет — главный элемент шапки, символ стоит меткой в его углу */}
        <div className="relative flex items-center gap-4 px-6 pt-4">
          <span className="relative block h-[140px] w-[118px] shrink-0 overflow-hidden rounded-2xl border border-glass-border">
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
              className="absolute left-2 top-2 rounded-lg px-2 py-0.5 text-[15px] font-extrabold backdrop-blur-sm"
              style={{
                color,
                background: 'rgba(3,6,16,0.72)',
                fontFamily: 'var(--font-outfit)',
              }}
            >
              {s.symbol}
            </span>
          </span>

          <span className="min-w-0">
            <span
              className="block text-[24px] font-extrabold leading-[1.12]"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {s.name}
            </span>
            <span className="mt-2.5 block text-sm text-text-muted">{s.role}</span>
            <span className="mt-1.5 flex items-center gap-1.5 text-sm text-text-muted">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: color }}
              />
              {s.company}
            </span>
          </span>
        </div>

        <div className="mx-6 mt-6 border-t border-glass-border" />

        {/* Тема выступления */}
        <div className="px-6 pt-5">
          <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color }}>
            Тема выступления
          </div>
          {/* Тема — главный повод открыть карточку, поэтому крупнее имени по весу */}
          <p
            className="mt-2.5 text-[20px] font-bold leading-[1.28]"
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

        {/* Опыт и статус — одной строкой, без сетки: так карточка короче */}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 px-6 text-sm text-text-muted">
          <span className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset('/img/flask-icon.webp')}
              alt=""
              aria-hidden="true"
              width={226}
              height={320}
              className="h-[18px] w-auto"
            />
            {s.experience}
          </span>
          <span className="flex items-center gap-2">
            <svg
              width="17"
              height="17"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
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
          </span>
        </div>

        {/* Текстовая ссылка вместо крупной капсулы — низ карточки легче */}
        <div className="mt-6 border-t border-glass-border px-6 py-4">
          <a
            href="#program"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ color }}
          >
            Подробнее о выступлении
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
