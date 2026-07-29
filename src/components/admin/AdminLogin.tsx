'use client';

import { useState } from 'react';
import { login } from '@/lib/adminApi';
import { IconAlert } from '@/components/admin/icons';

/** Экран входа в админку: один пароль, без логина — редакторов немного */
export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти');
      setPassword('');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-adm-accent to-adm-accent2 text-lg font-bold text-white">
            C&B
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight">Панель управления</h1>
          <p className="mt-1.5 text-sm text-adm-muted">
            C&amp;B-лаборатория 2.0 — спикеры и программа
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl border border-adm-border bg-adm-surface p-6 shadow-sm"
        >
          <label className="flex flex-col gap-2">
            <span className="text-[13px] font-medium text-adm-text2">Пароль</span>
            <input
              type="password"
              value={password}
              autoFocus
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-adm-border bg-adm-bg px-3.5 py-2.5 text-[15px] text-adm-text outline-none transition-colors focus:border-adm-accent"
            />
          </label>

          {error && (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-adm-danger-soft px-3 py-2.5 text-[13px] text-adm-danger">
              <span className="mt-px shrink-0">
                <IconAlert size={15} />
              </span>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !password}
            className="mt-5 w-full cursor-pointer rounded-lg bg-linear-to-br from-adm-accent to-adm-accent2 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Проверяем…' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}
