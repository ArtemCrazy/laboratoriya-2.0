import { keyThemes } from '@/content/hero';

/** Цвета тем — акценты элементов молекулярной схемы */
const accentColors: Record<string, string> = {
  cyan: '#00E5FF',
  yellow: '#FFD54F',
  violet: '#A78BFA',
  green: '#34D399',
  pink: '#F472B6',
};

/** Сцена молекулы: по этим координатам считаются атомы и связи */
const W = 1400;
const H = 520;

/** Пять атомов зигзагом, соединены цепочкой — молекулярная схема тем */
const NODES = [
  { x: 12, y: 38, label: 'above' as const },
  { x: 31, y: 70, label: 'below' as const },
  { x: 50, y: 38, label: 'above' as const },
  { x: 69, y: 70, label: 'below' as const },
  { x: 88, y: 38, label: 'above' as const },
];
const BONDS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
];
const ATOM = 128;

const pt = (i: number) => ({ x: (NODES[i].x / 100) * W, y: (NODES[i].y / 100) * H });

export default function KeyThemes() {
  return (
    <section id="themes" className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-[380px] w-[700px] -translate-x-1/2 rounded-full bg-cyan/[0.06] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <h2
          className="text-[clamp(26px,3.4vw,44px)] font-extrabold leading-[1.15] tracking-tight"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Ключевые темы конференции
        </h2>

        {/* --- Молекулярная схема: десктоп --- */}
        <div
          className="relative mx-auto mt-14 hidden w-full lg:block"
          style={{ aspectRatio: `${W} / ${H}` }}
        >
          <svg
            viewBox={`0 0 ${W} ${H}`}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <defs>
              {BONDS.map(([a, b], i) => {
                const p1 = pt(a);
                const p2 = pt(b);
                return (
                  <linearGradient
                    key={i}
                    id={`kt-bond-${i}`}
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor={accentColors[keyThemes[a].accent]} stopOpacity="0.55" />
                    <stop offset="100%" stopColor={accentColors[keyThemes[b].accent]} stopOpacity="0.55" />
                  </linearGradient>
                );
              })}
            </defs>
            {BONDS.map(([a, b], i) => {
              const p1 = pt(a);
              const p2 = pt(b);
              return (
                <g key={i}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(6,11,25,0.85)" strokeWidth="16" strokeLinecap="round" />
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={`url(#kt-bond-${i})`} strokeWidth="12" strokeLinecap="round" opacity="0.5" />
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.35"
                    style={{ transform: 'translateY(-3px)' }}
                  />
                  <circle r="3" fill={accentColors[keyThemes[b].accent]} opacity="0.9">
                    <animateMotion
                      dur={`${3.4 + i * 0.7}s`}
                      repeatCount="indefinite"
                      begin={`${i * -0.6}s`}
                      path={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`}
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          {keyThemes.map((t, i) => {
            const node = NODES[i];
            const color = accentColors[t.accent];
            return (
              <div
                key={t.symbol}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${node.x}%`, top: `${node.y}%`, width: ATOM, height: ATOM, zIndex: 10 }}
              >
                <div
                  className="animate-float flex h-full w-full flex-col items-center justify-center rounded-full border bg-bg-deep/90"
                  style={{
                    borderColor: `${color}80`,
                    boxShadow: `0 0 26px ${color}33, inset 0 3px 16px rgba(255,255,255,0.10)`,
                    animationDelay: `${i * 0.6}s`,
                  }}
                >
                  {/* Номер убран — символ по центру атома */}
                  <span
                    className="text-3xl font-extrabold leading-none"
                    style={{ fontFamily: 'var(--font-outfit)', color }}
                  >
                    {t.symbol}
                  </span>
                </div>

                {/* Название темы — подписью у атома, со стороны без связи */}
                <span
                  className={`absolute left-1/2 w-[230px] -translate-x-1/2 text-center text-[15px] font-medium leading-snug ${
                    node.label === 'above' ? 'bottom-full mb-4' : 'top-full mt-4'
                  }`}
                >
                  {t.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* --- Мобильная версия: список элементов --- */}
        <div className="mt-10 flex flex-col gap-3 lg:hidden">
          {keyThemes.map((t) => {
            const color = accentColors[t.accent];
            return (
              <article
                key={t.symbol}
                className="flex items-center gap-4 rounded-2xl border border-glass-border bg-glass p-4"
              >
                <span
                  className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full border bg-bg-deep"
                  style={{ borderColor: `${color}80`, boxShadow: `0 0 16px ${color}2e` }}
                >
                  <span
                    className="text-lg font-extrabold leading-none"
                    style={{ fontFamily: 'var(--font-outfit)', color }}
                  >
                    {t.symbol}
                  </span>
                </span>
                <span className="text-base font-medium leading-snug">{t.title}</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
