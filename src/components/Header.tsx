'use client';

import { useEffect, useState } from 'react';
import { hero, nav } from '@/content/hero';
import { asset } from '@/lib/paths';

/**
 * Шапка по ТЗ 4.1: sticky после первого скролла, бургер на мобильном,
 * фиксированная нижняя кнопка CTA на мобильном.
 */
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
      {/* Фон сплошной чёрный, а не прозрачный: логотип тонкий, на пёстром
          первом экране он терялся. После скролла шапка просто уплотняется. */}
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black transition-all duration-300 ${
          scrolled ? 'py-2.5' : 'py-4'
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 lg:px-10">
          {/* Логотип без «2.0» — в первой конференции его в шапке не было,
              версия живёт в заголовке первого экрана */}
          <a href="#" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset('/img/logo.png')}
              alt="C&B Лаборатория"
              className="h-9 w-auto lg:h-11"
            />
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
              className="hidden rounded-full bg-accent px-5 py-2.5 text-[15px] font-semibold text-text-dark transition-colors hover:bg-accent-hover lg:inline-block"
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
          <nav className="border-t border-white/10 bg-black xl:hidden">
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
