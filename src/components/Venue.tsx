'use client';

import { useRef } from 'react';
import { location } from '@/content/hero';
import { asset } from '@/lib/paths';
import FlaskMark from '@/components/FlaskMark';

/**
 * Блок «Локация» (ТЗ 4.11 + дополнения 27.07). Название, адрес, транспорт,
 * описание пространства и карта. Фото — каруселью, как просил заказчик.
 *
 * Фото реальные: кадры кластера «Ломоносов» из переписки. Карта — ссылкой
 * на Яндекс.Карты: iframe-встройку добавим после подключения согласий,
 * внешняя карта тянет куки.
 */
export default function Venue() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('figure');
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const atStart = el.scrollLeft <= 4;

    // Зацикливаем, как в карусели спикеров
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir === -1 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    else el.scrollBy({ left: step * dir, behavior: 'smooth' });
  };

  return (
    <section id="venue" className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28">
      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="mb-3 flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-cyan">
          <FlaskMark />
          Место проведения
        </div>

        <div className="flex items-end justify-between gap-6">
          <h2
            className="text-[clamp(26px,3.4vw,44px)] font-extrabold leading-[1.15] tracking-tight"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            {location.name}
          </h2>

          {/* Стрелки карусели фото — десктоп */}
          <div className="hidden shrink-0 gap-2 lg:flex">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              aria-label="Предыдущее фото"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-glass-border text-text-muted transition-colors hover:border-cyan/50 hover:text-white"
            >
              <Arrow dir="left" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              aria-label="Следующее фото"
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-glass-border text-text-muted transition-colors hover:border-cyan/50 hover:text-white"
            >
              <Arrow dir="right" />
            </button>
          </div>
        </div>

        {/* Карусель фото площадки */}
        <div
          ref={trackRef}
          className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {location.photos.map((src, i) => (
            <figure
              key={src}
              className="w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl border border-glass-border sm:w-[380px] lg:w-[calc((100%-2*16px)/3)]"
            >
              <span className="block aspect-[3/2] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(src)}
                  alt={`${location.name}, фото ${i + 1}`}
                  width={1500}
                  height={1000}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </span>
            </figure>
          ))}
        </div>

        {/* Адрес, транспорт, описание — слева; карта — справа */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
          <div>
            <dl className="flex flex-col gap-6">
              <div className="flex gap-4">
                <span className="mt-0.5 shrink-0 text-accent">
                  <IconPin />
                </span>
                <span>
                  <dt className="text-xs uppercase tracking-[0.18em] text-text-muted">Адрес</dt>
                  <dd className="mt-1.5 text-[17px] leading-snug">
                    {location.address}
                    <span className="block text-text-muted">
                      {location.name}, {location.hall}
                    </span>
                  </dd>
                </span>
              </div>

              <div className="flex gap-4">
                <span className="mt-0.5 shrink-0 text-cyan">
                  <IconMetro />
                </span>
                <span>
                  <dt className="text-xs uppercase tracking-[0.18em] text-text-muted">
                    Как добраться
                  </dt>
                  <dd className="mt-1.5 flex flex-col gap-1 text-[17px] leading-snug">
                    {location.transport.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </dd>
                </span>
              </div>
            </dl>

            <p className="mt-8 max-w-[560px] text-[16px] leading-relaxed text-text-muted">
              {location.about}
            </p>

            <a
              href={location.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-glass-border bg-glass px-5 py-3 text-sm font-semibold transition-colors hover:border-cyan/50 hover:text-cyan"
            >
              Открыть на Яндекс.Картах
              <IconArrow />
            </a>
          </div>

          {/* Карта: пока превью-плитка со ссылкой, встроим после согласий на куки */}
          <a
            href={location.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-glass-border bg-glass transition-colors hover:border-cyan/40"
          >
            {/* Абстрактная сетка кварталов — интерфейсная графика вместо скриншота */}
            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px)',
                backgroundSize: '44px 44px',
              }}
            />
            <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,229,255,0.16),transparent_62%)]" />

            <span className="relative flex flex-col items-center gap-3 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/50 bg-bg-deep/70 text-accent transition-transform group-hover:scale-105">
                <IconPin />
              </span>
              <span className="text-[15px] font-semibold">Раменский бульвар, 1</span>
              <span className="text-[13px] text-text-muted">Посмотреть на карте</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d={dir === 'right' ? 'M6 3l6 6-6 6' : 'M12 3L6 9l6 6'}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 14.5s5-4.6 5-8a5 5 0 0 0-10 0c0 3.4 5 8 5 8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.4" r="1.7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function IconMetro() {
  return (
    <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2 12h12M3.2 12 5 4l3 5 3-5 1.8 8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
