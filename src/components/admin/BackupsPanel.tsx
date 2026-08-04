'use client';

import { useCallback, useEffect, useState } from 'react';
import { loadBackups, restoreBackup, type ContentBackup } from '@/lib/adminApi';
import { IconAlert, IconChevron } from '@/components/admin/icons';

/**
 * История сохранений.
 *
 * Копия снимается автоматически перед каждой записью, поэтому любую
 * правку можно откатить: и случайную очистку, и неудачное изменение.
 * Откат тоже создаёт копию, так что вернуться назад можно и после него.
 */
export default function BackupsPanel({ onRestored }: { onRestored: () => void }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ContentBackup[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setItems(await loadBackups());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить историю');
    }
  }, []);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  const restore = async (b: ContentBackup) => {
    if (!confirm(`Вернуть содержимое сайта на ${b.date}?\n\nТекущая версия тоже сохранится, откат можно отменить.`)) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await restoreBackup(b.name);
      onRestored();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось восстановить');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-5 rounded-xl border border-adm-border bg-adm-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span>
          <span className="block text-[15px] font-semibold">История сохранений</span>
          <span className="block text-[12px] text-adm-muted">
            Копия снимается перед каждым сохранением. Любую правку можно откатить.
          </span>
        </span>
        <IconChevron dir={open ? 'up' : 'down'} size={16} />
      </button>

      {open && (
        <div className="border-t border-adm-border p-4">
          {error && (
            <p className="mb-3 flex items-start gap-2 rounded-lg bg-adm-danger-soft px-3 py-2 text-[13px] text-adm-danger">
              <IconAlert size={15} />
              {error}
            </p>
          )}

          {items.length === 0 ? (
            <p className="py-3 text-center text-[13px] text-adm-muted">
              Копий пока нет — они появятся после первого сохранения.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {items.map((b, i) => (
                <li
                  key={b.name}
                  className="flex flex-wrap items-center gap-3 rounded-lg border border-adm-border bg-adm-bg px-3 py-2"
                >
                  <span className="text-[14px]">{b.date}</span>
                  {i === 0 && (
                    <span className="rounded-full bg-adm-surface2 px-2 py-0.5 text-[11px] text-adm-muted">
                      последняя
                    </span>
                  )}
                  <span className="ml-auto text-[12px] text-adm-muted">
                    {Math.round(b.size / 1024)} КБ
                  </span>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => restore(b)}
                    className="cursor-pointer rounded-lg border border-adm-border px-3 py-1.5 text-[12px] font-medium transition-colors hover:border-adm-accent hover:text-adm-accent disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Восстановить
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
