import { recap } from '@/content/hero';
import FlaskMark from '@/components/FlaskMark';

/**
 * Блок «Как это было в прошлый раз» (ТЗ 4.6). Слева видео, справа фотоколлаж
 * 4–6 кадров, под блоком факты и CTA «Смотреть фото».
 *
 * ⚠️ МАТЕРИАЛЫ НЕ ПЕРЕДАНЫ: смонтированный ролик, постер и отобранные фото
 * лежат на Яндекс.Диске заказчика (ссылки в content/hero → recap). Здесь
 * слоты-заглушки: как только придут файлы, видео и коллаж встанут на место
 * без правки вёрстки. Пока обе плитки ведут на диск во внешней вкладке.
 */
export default function Recap() {
  return (
    <section id="recap" className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28">
      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="mb-3 flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-cyan">
          <FlaskMark />
          Как это было
        </div>

        <h2
          className="max-w-[820px] text-[clamp(26px,3.4vw,44px)] font-extrabold leading-[1.15] tracking-tight"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Первая C&B-лаборатория: 100 руководителей и четыре новых формата
        </h2>

        {/* Видео слева, фотоколлаж справа. На мобильном видео идёт первым */}
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          {/* Слот видео: до получения ролика и постера — ссылка на диск */}
          <a
            href={recap.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-glass-border bg-glass transition-colors hover:border-cyan/40"
          >
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,229,255,0.13),transparent_65%)]" />
            <span className="relative flex flex-col items-center gap-4 px-6 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan/50 bg-bg-deep/70 text-cyan transition-transform group-hover:scale-105">
                <IconPlay />
              </span>
              <span className="text-[15px] font-semibold">Видео с первой конференции</span>
              <span className="text-[13px] text-text-muted">
                Ролик 60–120 секунд · откроется на Яндекс.Диске
              </span>
            </span>
          </a>

          {/* Фотоколлаж: 4 кадра. Пока сетка-заглушка со ссылкой на альбом */}
          <a
            href={recap.photosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid aspect-video grid-cols-2 grid-rows-2 gap-3 rounded-2xl border border-glass-border bg-glass p-3 transition-colors hover:border-cyan/40"
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="flex items-center justify-center rounded-xl border border-dashed border-glass-border bg-bg-deep/40 text-[12px] text-text-muted"
              >
                Фото {i + 1}
              </span>
            ))}
          </a>
        </div>

        {/* Текст о первой конференции */}
        <p className="mt-10 max-w-[900px] text-[17px] leading-relaxed text-text-muted">
          {recap.text}
        </p>

        {/* Факты + CTA «Смотреть фото» */}
        <div className="mt-10 flex flex-col gap-8 border-t border-glass-border pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-4 lg:gap-x-14">
            {recap.facts.map((f) => (
              <div key={f.label}>
                <div
                  className="text-[clamp(28px,3vw,40px)] font-extrabold leading-none text-cyan"
                  style={{ fontFamily: 'var(--font-outfit)' }}
                >
                  {f.value}
                </div>
                <div className="mt-2 text-[13px] leading-snug text-text-muted">{f.label}</div>
              </div>
            ))}
          </div>

          <a
            href={recap.photosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2.5 self-start rounded-full border border-glass-border bg-glass px-5 py-3 text-sm font-semibold transition-colors hover:border-cyan/50 hover:text-cyan lg:self-auto"
          >
            Смотреть фото
            <IconArrow />
          </a>
        </div>
      </div>
    </section>
  );
}

function IconPlay() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M8 5.5l9 5.5-9 5.5V5.5Z" fill="currentColor" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10m0 0-4-4m4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
