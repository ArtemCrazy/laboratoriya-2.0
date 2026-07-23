'use client';

import { useEffect } from 'react';
import { speakers, speakerThemes } from '@/content/hero';
import { asset } from '@/lib/paths';

/** Русское название темы для чипа под именем */
const themeLabel: Record<string, string> = {
  analytics: 'Аналитика',
  motivation: 'Мотивация',
  wellbeing: 'Wellbeing',
  rewards: 'Вознаграждение',
  culture: 'Культура',
};

/**
 * Карточка спикера — открывается по клику на атом молекулы.
 * Горизонтальный формат по макету владельца: крупный круглый портрет
 * с меткой символа слева; имя, чип темы, должность, компания и короткое
 * описание справа; внизу два блока — тема выступления и опыт.
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

  // «12 лет в C&B и HR» → крупное «12 лет» и приглушённый остаток
  const expMatch = s.experience.match(/^(\d+\s+\S+)\s+(.*)$/);
  const expValue = expMatch ? expMatch[1] : s.experience;
  const expTail = expMatch ? expMatch[2] : '';
  const years = (s.experience.match(/\d+/) || ['10'])[0];

  const bio = `Эксперт с ${years}-летним опытом в области C&B и HR. Строит системы мотивации и вознаграждения, разрабатывает грейды и KPI для крупных компаний.`;

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
        className="relative max-h-[92vh] w-full max-w-[720px] overflow-y-auto rounded-[28px] border border-glass-border bg-bg-main"
        style={{ boxShadow: '0 30px 90px rgba(0,0,0,0.6)' }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-44"
          style={{ background: `linear-gradient(to bottom, ${color}16, transparent)` }}
        />

        <div className="relative flex items-center justify-between px-8 pt-7">
          <span className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.24em] text-text-muted">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
            Спикер / {s.num}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-glass-border text-text-muted transition-colors hover:bg-glass hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3.5 3.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Шапка: портрет слева, имя и описание справа */}
        <div className="relative flex flex-col gap-6 px-8 pt-6 sm:flex-row sm:items-start">
          <span className="relative shrink-0 self-center sm:self-start">
            <span
              className="block h-[152px] w-[152px] overflow-hidden rounded-full border-2"
              style={{ borderColor: color, boxShadow: `0 0 30px ${color}44` }}
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
              className="absolute bottom-0 right-0 flex h-[46px] w-[46px] items-center justify-center rounded-full border-2 text-[16px] font-extrabold"
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

          <div className="min-w-0">
            <div
              className="text-[30px] font-extrabold leading-[1.05]"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {s.name}
            </div>
            <span
              className="mt-2.5 inline-block rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
              style={{ borderColor: `${color}66`, color }}
            >
              {themeLabel[s.theme]}
            </span>
            <div className="mt-3 text-[15px] text-text-muted">{s.role}</div>
            <div className="mt-1.5 flex items-center gap-2 text-[15px] text-text-muted">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
              {s.company}
            </div>
            <p className="mt-4 text-[14px] leading-relaxed text-text-muted/80">{bio}</p>
          </div>
        </div>

        {/* Два блока: тема выступления и опыт */}
        <div className="grid grid-cols-1 gap-4 px-8 pb-8 pt-6 sm:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-glass-border bg-glass p-5">
            <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.18em] text-text-muted">
              <IconBox color={color}>
                <FlaskGlyph />
              </IconBox>
              Тема выступления
            </div>
            <p
              className="mt-3 text-[17px] font-bold leading-[1.3]"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {s.topic}
            </p>
          </div>

          <div className="rounded-2xl border border-glass-border bg-glass p-5">
            <div className="flex items-center gap-2.5 text-[10px] uppercase tracking-[0.18em] text-text-muted">
              <IconBox color={color}>
                <CaseGlyph />
              </IconBox>
              Опыт
            </div>
            <div
              className="mt-3 text-[26px] font-extrabold leading-none"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {expValue}
            </div>
            {expTail && <div className="mt-1.5 text-sm text-text-muted">{expTail}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Иконка в скруглённом квадрате с цветом темы */
function IconBox({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="flex h-8 w-8 items-center justify-center rounded-lg border"
      style={{ borderColor: `${color}40`, background: `${color}12`, color }}
    >
      {children}
    </span>
  );
}

function FlaskGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

function CaseGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="12" height="8.5" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M6 5V4a1.2 1.2 0 0 1 1.2-1.2h1.6A1.2 1.2 0 0 1 10 4v1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
