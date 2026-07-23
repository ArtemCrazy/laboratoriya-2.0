'use client';

import Link from 'next/link';

/**
 * Служебный переключатель концепций для показа заказчику.
 * ⚠️ Удалить перед сдачей боевого сайта — это витрина этапа согласования.
 */
// Скрытые концепции лежат в src/app/hero/_b и src/app/hero/_c: папка
// с подчёркиванием не создаёт маршрут. Вернуть — переименовать без него
// и добавить строку сюда.
const concepts = [{ key: 'a', href: '/hero/a/', title: 'Живая формула' }];

export default function ConceptSwitcher({ current }: { current: 'a' }) {
  // Пока концепция одна, переключать нечего — панель не показываем
  if (concepts.length < 2) return null;
  return (
    <div className="fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 lg:bottom-6">
      <div className="flex items-center gap-1 rounded-full border border-glass-border bg-bg-deep/90 p-1.5 backdrop-blur-xl">
        <span className="hidden pl-3 pr-1 text-xs uppercase tracking-widest text-text-muted lg:inline">
          Концепция
        </span>
        {concepts.map((c) => {
          const active = c.key === current;
          return (
            <Link
              key={c.key}
              href={c.href}
              title={c.title}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                active
                  ? 'bg-cyan text-text-dark'
                  : 'text-text-muted hover:bg-glass-hover hover:text-white'
              }`}
            >
              <span className="uppercase">{c.key}</span>
              <span className="ml-1.5 hidden lg:inline">· {c.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
