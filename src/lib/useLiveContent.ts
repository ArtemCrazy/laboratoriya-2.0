'use client';

import { useEffect, useState } from 'react';
import { asset } from '@/lib/paths';

/** Один запрос на страницу: блоков много, дёргать API из каждого незачем */
let cache: Promise<Record<string, unknown> | null> | null = null;

function fetchContent() {
  if (!cache) {
    cache = fetch(`${asset('/api/content.php')}?t=${Date.now()}`, { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => (data?.ok ? (data.content ?? {}) : null))
      .catch(() => null);
  }
  return cache;
}

/**
 * Подтягивает раздел контента, сохранённый в админке.
 *
 * Сайт собирается статикой, поэтому вшитые данные рендерятся сразу — это
 * и первый экран, и то, что видит поисковик. Данные из админки приезжают
 * следом и заменяют их. Если API недоступно или раздел ещё не трогали,
 * на странице остаётся то, что вшито в сборку.
 */
export function useLiveContent<T>(key: string, fallback: T): T {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    let cancelled = false;

    fetchContent().then((content) => {
      if (cancelled || !content) return;
      const next = content[key];
      if (next === undefined || next === null) return;

      // Пустой раздел не подменяет вшитые данные: иначе случайно
      // очищенный список стёр бы блок со страницы
      if (Array.isArray(next)) {
        if (next.length) setValue(next as T);
        return;
      }
      if (typeof next === 'object') setValue(next as T);
    });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return value;
}
