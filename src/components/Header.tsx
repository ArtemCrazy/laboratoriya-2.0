'use client';

import { useEffect, useState } from 'react';
import { hero, nav } from '@/content/hero';
import { asset } from '@/lib/paths';

/**
 * Шапка по ТЗ 4.1: sticky после первого скролла, бургер на мобильном,
 * фиксированная нижняя кнопка CTA на мобильном.
 */

/** Пузырьки внутри колбы логотипа: позиции в процентах от её области */
const logoBubbles = [
  { left: '34%', bottom: '16%', size: 2.5, delay: 0 },
  { left: '54%', bottom: '10%', size: 2, delay: 1.4 },
  { left: '44%', bottom: '26%', size: 1.5, delay: 2.9 },
  { left: '62%', bottom: '20%', size: 2, delay: 4.2 },
];
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Как в первой конференции: полупрозрачная подложка с размытием сразу,
          после скролла плотнее и с границей — переход остаётся незаметным */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-[20px] transition-all duration-300 ${
          scrolled
            ? 'border-glass-border bg-bg-main/85 py-2.5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
            : 'border-transparent bg-bg-main/50 py-4'
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 lg:px-10">
          {/* Логотип без «2.0» — в первой конференции его в шапке не было,
              версия живёт в заголовке первого экрана */}
          {/* logo-flask качается при наведении: точка вращения у надписи,
              поэтому ходит колба — как будто её встряхнули в руке */}
          <a href="#" className="logo-link relative flex items-center">
            <span className="logo-flask relative block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset('/img/logo.png')}
                alt="C&B Лаборатория"
                className="h-7 w-auto lg:h-9"
              />

            {/* Колба в логотипе периодически бурлит. Слой накрывает только её:
                в макете логотипа колба занимает первые 17% ширины */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-[17%] overflow-hidden"
            >
              {logoBubbles.map((b, i) => (
                <span
                  key={i}
                  className="animate-bubble absolute rounded-full bg-cyan"
                  style={{
                    left: b.left,
                    bottom: b.bottom,
                    width: b.size,
                    height: b.size,
                    ['--rise' as string]: '11px',
                    ['--bubble-duration' as string]: '6s',
                    animationDelay: `${b.delay}s`,
                  }}
                />
              ))}
              </span>
            </span>
          </a>

          {/* Десктопное меню — от 1280px, иначе 8 пунктов не помещаются рядом с CTA */}
          <nav className="hidden items-center gap-6 xl:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[15px] text-text-muted transition-colors hover:text-cyan"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#price"
              className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-text-dark transition-colors hover:bg-accent-hover lg:inline-block"
            >
              {hero.ctaPrimary}
            </a>

            {/* Бургер */}
            <button
              type="button"
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-lg border border-glass-border xl:hidden"
            >
              <span
                className={`block h-[2px] w-5 bg-white transition-transform ${
                  menuOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-[2px] w-5 bg-white transition-opacity ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-[2px] w-5 bg-white transition-transform ${
                  menuOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {menuOpen && (
          <nav className="border-t border-glass-border bg-bg-main/95 backdrop-blur-xl xl:hidden">
            <div className="mx-auto flex max-w-[1440px] flex-col px-5 py-4">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-white/5 py-3 text-text-muted last:border-0"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* ТЗ 4.1: фиксированная нижняя кнопка на мобильном — появляется после первого экрана */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-glass-border bg-bg-main/90 p-3 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
          scrolled ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <a
          href="#price"
          className="block rounded-full bg-accent py-3.5 text-center font-semibold text-text-dark"
        >
          {hero.ctaPrimary} · {hero.dates}
        </a>
      </div>
    </>
  );
}
