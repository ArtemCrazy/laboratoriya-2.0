'use client';

import { useEffect, useState } from 'react';
import { asset } from '@/lib/paths';

/**
 * Подтягивает контент, сохранённый в админке.
 *
 * Сайт собирается статикой, поэтому вшитые данные рендерятся сразу — это
 * и первый экран, и то, что видит поисковик. Данные из админки приезжают
 * следом и заменяют их. Если API недоступно или ещё ничего не сохраняли,
 * на странице просто остаётся то, что вшито в сборку.
 */
export function useLiveContent<T>(key: 'speakers' | 'program', fallback: T): T {
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    let cancelled = false;

    fetch(`${asset('/api/content.php')}?t=${Date.now()}`, { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.ok) return;
        const next = data.content?.[key];
        if (Array.isArray(next) && next.length) setValue(next as T);
      })
      .catch(() => {
        /* нет API или сети — остаёмся на вшитых данных */
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return value;
}
