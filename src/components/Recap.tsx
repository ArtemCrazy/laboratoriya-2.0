'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { recap } from '@/content/hero';
import { asset } from '@/lib/paths';
import FlaskMark from '@/components/FlaskMark';

/**
 * Блок «Как это было в прошлый раз» (ТЗ 4.6). Слева видео, справа фотоколлаж,
 * под блоком факты и CTA «Смотреть фото».
 *
 * По ТЗ: постер обязателен, звук сам не включается. Поэтому ролик грузится
 * только по клику — до этого показываем постер (preload="none"), иначе
 * 15 МБ тянулись бы у каждого посетителя. Фото открываются в lightbox.
 */
export default function Recap() {
  const [playing, setPlaying] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startVideo = () => {
    setPlaying(true);
    // Ролик появляется в DOM в этом же рендере, играть просим следующим кадром
    requestAnimationFrame(() => videoRef.current?.play());
  };

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((i) =>
        i === null ? i : (i + dir + recap.photos.length) % recap.photos.length,
      ),
    [],
  );

  // Клавиатура в лайтбоксе: Esc закрывает, стрелки листают
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    // Фон не должен прокручиваться под открытым окном
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox, close, step]);

  // В коллаже 4 кадра, остальные — только в лайтбоксе
  const collage = recap.photos.slice(1, 5);

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
          Итоги первой C&B Лаборатории
        </h2>

        {/* Видео слева, коллаж справа. На мобильном видео идёт первым */}
        <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-glass-border bg-glass">
            {playing ? (
              <video
                ref={videoRef}
                src={asset(recap.video)}
                poster={asset(recap.poster)}
                controls
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <button
                type="button"
                onClick={startVideo}
                aria-label="Смотреть видео с первой конференции"
                className="group h-full w-full cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(recap.poster)}
                  alt="Зал первой C&B-лаборатории"
                  width={1600}
                  height={900}
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 bg-bg-main/35 transition-colors group-hover:bg-bg-main/20" />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan/60 bg-bg-deep/80 pl-1 text-cyan backdrop-blur-sm transition-transform group-hover:scale-105">
                    <IconPlay />
                  </span>
                  <span className="text-[13px] font-medium text-white/90">
                    Видео с конференции · 1:24
                  </span>
                </span>
              </button>
            )}
          </div>

          {/* Фотоколлаж 2×2, клик открывает lightbox */}
          <div className="grid aspect-video grid-cols-2 grid-rows-2 gap-3">
            {collage.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setLightbox(i + 1)}
                aria-label={`Открыть фото ${i + 1}`}
                className="group cursor-pointer overflow-hidden rounded-xl border border-glass-border"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(src)}
                  alt=""
                  width={1600}
                  height={1067}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>

        <p className="mt-10 max-w-[900px] text-[17px] leading-relaxed text-text-muted">
          {recap.text}
        </p>

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

          <button
            type="button"
            onClick={() => setLightbox(0)}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2.5 self-start rounded-full border border-glass-border bg-glass px-5 py-3 text-sm font-semibold transition-colors hover:border-cyan/50 hover:text-cyan lg:self-auto"
          >
            Смотреть фото
            <IconArrow />
          </button>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Фотографии с конференции"
          onClick={close}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-bg-main/95 p-4 backdrop-blur-sm sm:p-8"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(recap.photos[lightbox])}
            alt={`Фото с конференции ${lightbox + 1} из ${recap.photos.length}`}
            width={1600}
            height={1067}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full rounded-xl object-contain"
          />

          <button
            type="button"
            onClick={close}
            aria-label="Закрыть"
            className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-glass-border bg-bg-deep/80 text-text-muted transition-colors hover:border-cyan/50 hover:text-white sm:right-8 sm:top-8"
          >
            <IconClose />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Предыдущее фото"
            className="absolute left-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-glass-border bg-bg-deep/80 text-text-muted transition-colors hover:border-cyan/50 hover:text-white sm:left-6"
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Следующее фото"
            className="absolute right-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-glass-border bg-bg-deep/80 text-text-muted transition-colors hover:border-cyan/50 hover:text-white sm:right-6"
          >
            <Chevron dir="right" />
          </button>

          <span className="absolute bottom-5 text-[13px] text-text-muted">
            {lightbox + 1} / {recap.photos.length}
          </span>
        </div>
      )}
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

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M4 4l10 10M14 4L4 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
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
