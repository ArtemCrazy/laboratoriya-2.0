import { keyThemes, keyThemesQuote } from '@/content/hero';

/**
 * Блок «Ключевые темы конференции» (правки 24.07) — молекулярная схема,
 * каждая тема отдельным элементом.
 *
 * Правки 29.07: тем шесть, буквы внутри атомов убраны, атомы одинаковые
 * бледно-голубые. Раз акцентных цветов больше нет, связи и электроны тоже
 * однотонные — схема читается как одна структура, а не набор разных узлов.
 */

/** Единый цвет схемы — бледно-голубой */
const TINT = '#00E5FF';

/** Сцена молекулы: по этим координатам считаются атомы и связи */
const W = 1400;
const H = 520;

/** Шесть атомов зигзагом, соединены цепочкой */
const NODES = [
  { x: 9, y: 38, label: 'above' as const },
  { x: 25.4, y: 70, label: 'below' as const },
  { x: 41.8, y: 38, label: 'above' as const },
  { x: 58.2, y: 70, label: 'below' as const },
  { x: 74.6, y: 38, label: 'above' as const },
  { x: 91, y: 70, label: 'below' as const },
];
const BONDS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
];
const ATOM = 104;

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

        {/* Правки 29.07: плашка с фразой вернулась под заголовок */}
        <p
          className="mt-6 inline-block rounded-full border border-cyan/35 bg-cyan/[0.07] px-6 py-3 text-[clamp(15px,1.4vw,19px)] font-medium text-cyan"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          {keyThemesQuote}
        </p>

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
            {BONDS.map(([a, b], i) => {
              const p1 = pt(a);
              const p2 = pt(b);
              return (
                <g key={i}>
                  {/* Тёмная подложка отделяет связь от фонового свечения */}
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="rgba(6,11,25,0.85)" strokeWidth="16" strokeLinecap="round" />
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={TINT} strokeWidth="12" strokeLinecap="round" opacity="0.28" />
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.3"
                    style={{ transform: 'translateY(-3px)' }}
                  />
                  {/* Импульс по связи — схема остаётся живой */}
                  <circle r="3" fill={TINT} opacity="0.85">
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

          {keyThemes.map((title, i) => {
            const node = NODES[i];
            return (
              <div
                key={title}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${node.x}%`, top: `${node.y}%`, width: ATOM, height: ATOM, zIndex: 10 }}
              >
                {/* Атом пустой: буквы убраны, остаётся бледно-голубая заливка */}
                <div
                  className="animate-float h-full w-full rounded-full border"
                  style={{
                    background:
                      'radial-gradient(circle at 34% 30%, rgba(255,255,255,0.16), rgba(0,229,255,0.16) 60%, rgba(0,229,255,0.09))',
                    borderColor: 'rgba(0,229,255,0.45)',
                    boxShadow: '0 0 26px rgba(0,229,255,0.16), inset 0 3px 16px rgba(255,255,255,0.10)',
                    animationDelay: `${i * 0.6}s`,
                  }}
                />

                {/* Название темы — подписью у атома, со стороны без связи */}
                <span
                  className={`absolute left-1/2 w-[215px] -translate-x-1/2 text-center text-[15px] font-medium leading-snug ${
                    node.label === 'above' ? 'bottom-full mb-4' : 'top-full mt-4'
                  }`}
                >
                  {title}
                </span>
              </div>
            );
          })}
        </div>

        {/* --- Мобильная версия: список элементов --- */}
        <div className="mt-10 flex flex-col gap-3 lg:hidden">
          {keyThemes.map((title) => (
            <article
              key={title}
              className="flex items-center gap-4 rounded-2xl border border-glass-border bg-glass p-4"
            >
              <span
                className="h-11 w-11 shrink-0 rounded-full border"
                style={{
                  background:
                    'radial-gradient(circle at 34% 30%, rgba(255,255,255,0.16), rgba(0,229,255,0.16) 60%, rgba(0,229,255,0.09))',
                  borderColor: 'rgba(0,229,255,0.45)',
                  boxShadow: '0 0 16px rgba(0,229,255,0.18)',
                }}
              />
              <span className="text-base font-medium leading-snug">{title}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
