import { audience, audienceTitle } from '@/content/hero';
import FlaskMark from '@/components/FlaskMark';
import { asset } from '@/lib/paths';

/** Цвет символа ячейки — единственное, что отличает карточки по цвету */
const accentColors: Record<string, string> = {
  cyan: '#00E5FF',
  yellow: '#FFD54F',
  violet: '#A78BFA',
  green: '#34D399',
};

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

        {/* Колонки тянутся до общей высоты: портрет занимает всё, что
            остаётся над цитатой, поэтому левый блок равен правому */}
        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(320px,0.85fr)_1.15fr] lg:gap-8">
          {/* --- Портрет: фон вырезан, бюст стоит прямо на странице --- */}
          <figure className="relative flex h-full flex-col">
            <div className="relative min-h-[320px] flex-1">
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
            {/* Фраза-манифест: стеклянная плашка вместо простой строки, чтобы
                держать вес рядом с портретом. Без подписи автора намеренно —
                рядом с Менделеевым атрибуция читалась бы как его слова */}
            <figcaption className="relative mt-5 overflow-hidden rounded-2xl border border-glass-border bg-glass px-7 py-6 backdrop-blur-sm">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-3 -top-10 select-none text-[150px] leading-none text-cyan/[0.07]"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                «
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-cyan/70 via-cyan/25 to-transparent"
              />
              <p
                className="relative text-[21px] font-bold leading-[1.35] text-white"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                Когда каждый элемент на своём месте,
                <br />
                <span className="text-cyan">система работает</span>
              </p>
            </figcaption>
          </figure>

          {/* --- Таблица аудиторий --- */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {audience.map((a) => (
              <article
                key={a.symbol}
                className="group flex flex-col rounded-2xl border border-glass-border bg-glass p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/50 hover:bg-glass-hover hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[13px] text-text-muted">{a.num}</span>
                  <span className="h-2 w-2 rounded-full bg-cyan/30 transition-colors group-hover:bg-cyan" />
                </div>

                <div
                  className="mt-2 text-[clamp(36px,3vw,46px)] font-extrabold leading-none"
                  style={{ fontFamily: 'var(--font-outfit)', color: accentColors[a.accent] }}
                >
                  {a.symbol}
                </div>

                <div className="mt-4 border-t border-glass-border pt-4">
                  <h3
                    className="text-[18px] font-bold leading-tight"
                    style={{ fontFamily: 'var(--font-outfit)' }}
                  >
                    {a.role}
                  </h3>
                  {/* 16px — нижняя граница по ТЗ 5.2 для основного текста */}
                  <p className="mt-2.5 text-base leading-relaxed text-text-muted">{a.task}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
