import { audience, audienceTitle } from '@/content/hero';

/** Цвета групп — как категории элементов в периодической таблице */
const accentColors: Record<string, string> = {
  cyan: '#00E5FF',
  yellow: '#FFD54F',
  violet: '#A78BFA',
  green: '#34D399',
};
import FlaskMark from '@/components/FlaskMark';
import { asset } from '@/lib/paths';

/**
 * Блок «Для кого конференция» (ТЗ 4.3).
 * Каждая аудитория — ячейка периодической таблицы: порядковый номер,
 * символ, роль и задачи, с которыми человек приходит на конференцию.
 *
 * Слева — квадратный портрет Менделеева, справа — сама таблица,
 * колонка уже, поэтому ячейки идут сеткой 2×2.
 */
export default function AudienceTable() {
  return (
    <section
      id="audience"
      className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-cyan/[0.06] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="max-w-[880px]">
          <div className="mb-4 flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-cyan">
            <FlaskMark />
            Для кого конференция
          </div>
          <h2
            className="text-[clamp(26px,3.4vw,44px)] font-extrabold leading-[1.15] tracking-tight"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            {audienceTitle}
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(320px,0.85fr)_1.15fr] lg:gap-8">
          {/* --- Портрет: фон вырезан, бюст стоит прямо на странице --- */}
          <figure className="relative">
            <div className="relative aspect-square">
              {/* Свечение под бюстом — чтобы вырезанная фигура не висела в пустоте */}
              <div className="pointer-events-none absolute inset-x-[8%] bottom-[6%] top-[18%] rounded-full bg-cyan/[0.07] blur-[70px]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset('/img/mendeleev.webp')}
                alt="Мраморный бюст Дмитрия Менделеева в тёмных очках"
                width={1000}
                height={936}
                className="relative h-full w-full object-contain object-bottom"
              />
            </div>
            {/* Фраза-манифест под портретом. Намеренно без подписи автора:
                рядом с Менделеевым любая атрибуция читалась бы как его слова */}
            <figcaption className="relative mt-4 border-l-2 border-cyan/40 pl-5">
              <span
                aria-hidden="true"
                className="absolute -left-1.5 -top-7 select-none text-[72px] leading-none text-cyan/15"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                «
              </span>
              <p
                className="relative text-[19px] font-semibold leading-snug text-white"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                Когда каждый элемент на своём месте, система работает
              </p>
            </figcaption>
          </figure>

          {/* --- Таблица аудиторий ---
              Ячейки разделены линиями в один пиксель и сидят в общей рамке,
              как вырезка из настоящей периодической таблицы */}
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-glass-border bg-glass-border sm:grid-cols-2">
            {audience.map((a, i) => {
              const color = accentColors[a.accent];
              return (
                <article
                  key={a.symbol}
                  className="animate-rise group relative flex flex-col bg-bg-main px-5 py-4 transition-colors duration-300 hover:bg-glass-hover"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Полоса категории сверху — как цвет группы в таблице */}
                  <span
                    className="absolute inset-x-0 top-0 h-[3px] opacity-70 transition-opacity group-hover:opacity-100"
                    style={{ background: color }}
                  />

                  <div className="font-mono text-[12px] text-text-muted">{a.num}</div>

                  {/* Символ по центру — главный элемент ячейки */}
                  <div
                    className="mt-1 text-center text-[clamp(38px,3.2vw,50px)] font-extrabold leading-none transition-colors"
                    style={{ fontFamily: 'var(--font-outfit)', color }}
                  >
                    {a.symbol}
                  </div>

                  <h3
                    className="mt-2.5 text-center text-[16px] font-bold leading-tight"
                    style={{ fontFamily: 'var(--font-outfit)' }}
                  >
                    {a.role}
                  </h3>
                  <div className="mt-1 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted">
                    {a.group}
                  </div>

                  {/* 16px — нижняя граница по ТЗ 5.2 для основного текста */}
                  <p className="mt-3.5 border-t border-glass-border pt-3.5 text-base leading-snug text-text-muted">
                    {a.task}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
