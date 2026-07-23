import { hero } from '@/content/hero';

/**
 * Дата и место отдельным виджетом. Раньше стояли строкой-бейджем над
 * заголовком и читались как служебная подпись — теперь это самостоятельный
 * блок, который парит рядом с визуалом.
 *
 * Отдельный бейдж «2 дня» убран: диапазон 21–22 и подпись «два дня»
 * под датой говорят то же самое, но не спорят с заголовком за внимание.
 */
export default function DateWidget({ floating = false }: { floating?: boolean }) {
  return (
    <div
      className={`w-full max-w-[320px] rounded-2xl border border-glass-border bg-bg-deep/80 p-5 backdrop-blur-md ${
        floating ? 'animate-float shadow-[0_24px_60px_rgba(0,0,0,0.45)]' : ''
      }`}
    >
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 text-cyan">
          <IconCalendar />
        </span>
        <div>
          <div
            className="text-[26px] font-extrabold leading-none"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            21–22 октября
          </div>
          <div className="mt-2 text-sm text-text-muted">
            2026 · <span className="text-accent">два дня</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3.5 border-t border-glass-border pt-4">
        <span className="mt-0.5 text-accent">
          <IconPin />
        </span>
        <div className="text-[15px] leading-snug">
          {hero.location}
          <div className="text-text-muted">{hero.locationNote}</div>
        </div>
      </div>
    </div>
  );
}

function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2.5" y="4" width="15" height="13.5" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2.5 8.5h15M7 2v3.5M13 2v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 18s6-5.6 6-9.6a6 6 0 1 0-12 0C4 12.4 10 18 10 18Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
