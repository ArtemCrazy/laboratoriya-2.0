'use client';

import { useCallback, useEffect, useState } from 'react';
import { asset } from '@/lib/paths';
import { Field, IconBtn } from '@/components/admin/ui';
import { IconTrash, IconCheck, IconAlert } from '@/components/admin/icons';

/**
 * Заявки с сайта.
 *
 * Заказчик рассказал, что письма иногда уходили в спам и заявки сверяли
 * по панели — поэтому список здесь основной, а почта дублирует.
 *
 * Раздел живёт отдельно от контента: заявки приходят от посетителей, их
 * не «сохраняют» кнопкой, а помечают обработанными по мере разбора.
 */

type Lead = {
  id: string;
  type: string;
  typeLabel: string;
  createdAt: string;
  status: 'new' | 'done';
  fields: Record<string, string>;
};

const FIELD_LABEL: Record<string, string> = {
  name: 'Имя',
  company: 'Компания',
  role: 'Должность',
  email: 'Email',
  phone: 'Телефон',
  promo: 'Промокод',
  tariff: 'Пакет',
  people: 'Участников',
  format: 'Формат',
  comment: 'Комментарий',
};

const api = asset('/api/leads.php');

/**
 * Почта домена живёт на Яндексе, а сайт стоит на хостинге. Письмо,
 * отправленное сервером хостинга от адреса домена, спам-фильтр считает
 * подделкой. Поэтому есть отправка через SMTP самого ящика: тогда письмо
 * подписано и проходит проверки. Таблица — независимый третий канал.
 */
type Settings = {
  notifyEmail: string;
  notify: boolean;
  smtpEnabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpFrom: string;
  sheetEnabled: boolean;
  sheetUrl: string;
};

type ChannelResult = { ok: boolean; error?: string; via?: string };
type Channels = { at?: string; mail?: ChannelResult; sheet?: ChannelResult };

const EMPTY_SETTINGS: Settings = {
  notifyEmail: '',
  notify: true,
  smtpEnabled: false,
  smtpHost: 'smtp.yandex.ru',
  smtpPort: 465,
  smtpUser: '',
  smtpPassword: '',
  smtpFrom: '',
  sheetEnabled: false,
  sheetUrl: '',
};

export default function LeadsEditor() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<Settings>(EMPTY_SETTINGS);
  const [passwordSet, setPasswordSet] = useState(false);
  const [channels, setChannels] = useState<Channels>({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<Channels | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [onlyNew, setOnlyNew] = useState(false);
  const [savedHint, setSavedHint] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${api}?t=${Date.now()}`, { credentials: 'same-origin' });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Не удалось загрузить заявки');
      setLeads(data.leads ?? []);
      // Пароль сервер не отдаёт: приходит только признак, что он задан
      setSettings({ ...EMPTY_SETTINGS, ...(data.settings ?? {}), smtpPassword: '' });
      setPasswordSet(Boolean(data.settings?.smtpPasswordSet));
      setChannels(data.channels ?? {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить заявки');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (id: string, status: 'new' | 'done') => {
    setLeads((list) => list.map((l) => (l.id === id ? { ...l, status } : l)));
    await fetch(api, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    }).catch(() => undefined);
  };

  const remove = async (id: string) => {
    if (!confirm('Удалить заявку? Восстановить будет нельзя.')) return;
    setLeads((list) => list.filter((l) => l.id !== id));
    await fetch(api, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => undefined);
  };

  const saveSettings = async () => {
    setError(null);
    try {
      const res = await fetch(api, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Не удалось сохранить');
      setSavedHint(true);
      setPasswordSet(Boolean(data.settings?.smtpPasswordSet));
      setSettings((v) => ({ ...v, smtpPassword: '' }));
      setTimeout(() => setSavedHint(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить');
    }
  };

  /** Тестовая заявка уходит теми же каналами, что и настоящая */
  const runTest = async () => {
    setTesting(true);
    setTestResult(null);
    setError(null);
    try {
      const res = await fetch(api, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test' }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Проверка не прошла');
      setTestResult(data.result ?? {});
      setChannels(data.result ?? {});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Проверка не прошла');
    } finally {
      setTesting(false);
    }
  };

  const shown = onlyNew ? leads.filter((l) => l.status === 'new') : leads;
  const newCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[19px] font-semibold tracking-tight">Заявки</h2>
          <p className="mt-1 text-[13px] text-adm-muted">
            {loading
              ? 'Загружаем…'
              : `Всего ${leads.length}, новых ${newCount}. Дублируются письмом.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-2 text-[13px]">
            <input
              type="checkbox"
              checked={onlyNew}
              onChange={(e) => setOnlyNew(e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-adm-accent"
            />
            Только новые
          </label>
          <button
            type="button"
            onClick={load}
            className="cursor-pointer rounded-lg border border-adm-border px-3.5 py-2 text-[13px] font-medium transition-colors hover:border-adm-accent hover:text-adm-accent"
          >
            Обновить
          </button>
        </div>
      </div>

      <div className="mb-5 space-y-4 rounded-xl border border-adm-border bg-adm-surface p-4">
        <div>
          <h3 className="mb-3 text-[15px] font-semibold">Уведомления о заявках</h3>
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[240px] flex-1">
              <Field
                label="Куда присылать письма"
                value={settings.notifyEmail}
                onChange={(v) => setSettings((s) => ({ ...s, notifyEmail: v }))}
                placeholder="info@cblabconference.ru"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2.5 pb-2.5 text-[13px]">
              <input
                type="checkbox"
                checked={settings.notify}
                onChange={(e) => setSettings((s) => ({ ...s, notify: e.target.checked }))}
                className="h-4 w-4 cursor-pointer accent-adm-accent"
              />
              Присылать письма
            </label>
          </div>
        </div>

        {/* Отправка через ящик домена — то, что вытаскивает письма из спама */}
        <div className="border-t border-adm-border pt-4">
          <label className="flex cursor-pointer items-center gap-2.5 text-[15px] font-semibold">
            <input
              type="checkbox"
              checked={settings.smtpEnabled}
              onChange={(e) => setSettings((s) => ({ ...s, smtpEnabled: e.target.checked }))}
              className="h-4 w-4 cursor-pointer accent-adm-accent"
            />
            Отправлять письма через почтовый ящик
          </label>
          <p className="mt-1.5 text-[12px] text-adm-muted">
            Без этого письмо уходит с сервера хостинга и попадает в спам: почта домена
            обслуживается Яндексом, и письмо с чужого сервера фильтр считает подделкой.
            Нужен пароль приложения из Яндекс&nbsp;360, обычный пароль от ящика не подойдёт.
          </p>

          {settings.smtpEnabled && (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field
                label="Сервер"
                value={settings.smtpHost}
                onChange={(v) => setSettings((s) => ({ ...s, smtpHost: v }))}
                placeholder="smtp.yandex.ru"
              />
              <Field
                label="Порт"
                value={String(settings.smtpPort)}
                onChange={(v) => setSettings((s) => ({ ...s, smtpPort: Number(v) || 465 }))}
                placeholder="465"
              />
              <Field
                label="Ящик (он же логин)"
                value={settings.smtpUser}
                onChange={(v) => setSettings((s) => ({ ...s, smtpUser: v }))}
                placeholder="info@cblabconference.ru"
              />
              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-medium text-adm-text2">
                  Пароль приложения
                </span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={settings.smtpPassword}
                  onChange={(e) => setSettings((s) => ({ ...s, smtpPassword: e.target.value }))}
                  placeholder={passwordSet ? 'Пароль сохранён, менять не нужно' : 'Вставьте пароль'}
                  className="rounded-lg border border-adm-border bg-adm-bg px-3 py-2 text-[14px] text-adm-text outline-none transition-colors placeholder:text-adm-muted2 focus:border-adm-accent"
                />
              </label>
            </div>
          )}
        </div>

        {/* Таблица — третий канал, независимый от почты */}
        <div className="border-t border-adm-border pt-4">
          <label className="flex cursor-pointer items-center gap-2.5 text-[15px] font-semibold">
            <input
              type="checkbox"
              checked={settings.sheetEnabled}
              onChange={(e) => setSettings((s) => ({ ...s, sheetEnabled: e.target.checked }))}
              className="h-4 w-4 cursor-pointer accent-adm-accent"
            />
            Дублировать заявки в Google-таблицу
          </label>
          <p className="mt-1.5 text-[12px] text-adm-muted">
            Каждая заявка добавляется строкой в таблицу. Ссылку выдаёт скрипт таблицы —
            как его завести, описано в инструкции.
          </p>

          {settings.sheetEnabled && (
            <div className="mt-3">
              <Field
                label="Ссылка веб-приложения"
                value={settings.sheetUrl}
                onChange={(v) => setSettings((s) => ({ ...s, sheetUrl: v }))}
                placeholder="https://script.google.com/macros/s/…/exec"
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-adm-border pt-4">
          <button
            type="button"
            onClick={saveSettings}
            className="cursor-pointer rounded-lg bg-linear-to-br from-adm-accent to-adm-accent2 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Сохранить
          </button>
          <button
            type="button"
            onClick={runTest}
            disabled={testing}
            className="cursor-pointer rounded-lg border border-adm-border px-4 py-2 text-sm font-medium transition-colors hover:border-adm-accent hover:text-adm-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {testing ? 'Проверяем…' : 'Проверить каналы'}
          </button>
          {savedHint && (
            <span className="flex items-center gap-1.5 text-[13px] text-adm-success">
              <IconCheck size={14} />
              Сохранено
            </span>
          )}
        </div>

        <ChannelStatus data={testResult ?? channels} tested={testResult !== null} />

        <p className="text-[12px] text-adm-muted">
          Заявки всегда остаются здесь, независимо от почты и таблицы.
        </p>
      </div>

      {error && (
        <p className="mb-4 flex items-start gap-2 rounded-lg bg-adm-danger-soft px-3.5 py-2.5 text-[13px] text-adm-danger">
          <IconAlert size={15} />
          {error}
        </p>
      )}

      {!loading && shown.length === 0 && (
        <p className="rounded-xl border border-dashed border-adm-border bg-adm-surface p-8 text-center text-sm text-adm-muted">
          {leads.length === 0 ? 'Заявок пока нет.' : 'Новых заявок нет.'}
        </p>
      )}

      <div className="space-y-2.5">
        {shown.map((lead) => (
          <div
            key={lead.id}
            className={`rounded-xl border bg-adm-surface p-4 ${
              lead.status === 'new' ? 'border-adm-accent/50' : 'border-adm-border opacity-70'
            }`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                  lead.status === 'new'
                    ? 'bg-adm-accent-soft text-adm-accent'
                    : 'bg-adm-surface2 text-adm-muted'
                }`}
              >
                {lead.status === 'new' ? 'Новая' : 'Обработана'}
              </span>
              <span className="text-[15px] font-medium">{lead.typeLabel}</span>
              <span className="text-[13px] text-adm-muted">{formatDate(lead.createdAt)}</span>

              <span className="ml-auto flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setStatus(lead.id, lead.status === 'new' ? 'done' : 'new')}
                  className="cursor-pointer rounded-lg border border-adm-border px-3 py-1.5 text-[12px] font-medium transition-colors hover:border-adm-accent hover:text-adm-accent"
                >
                  {lead.status === 'new' ? 'Отметить обработанной' : 'Вернуть в новые'}
                </button>
                <IconBtn label="Удалить" danger onClick={() => remove(lead.id)}>
                  <IconTrash size={15} />
                </IconBtn>
              </span>
            </div>

            <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {Object.entries(lead.fields).map(([key, value]) => (
                <div key={key} className="flex gap-2 text-[14px]">
                  <dt className="shrink-0 text-adm-muted">{FIELD_LABEL[key] ?? key}:</dt>
                  <dd className="min-w-0 break-words">
                    {key === 'email' ? (
                      <a href={`mailto:${value}`} className="text-adm-accent hover:underline">
                        {value}
                      </a>
                    ) : key === 'phone' ? (
                      <a
                        href={`tel:${value.replace(/[^+\d]/g, '')}`}
                        className="text-adm-accent hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Дата в привычном виде; при кривом значении показываем как есть */
function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Что случилось с последней отправкой: показываем прямо в панели */
function ChannelStatus({ data, tested }: { data: Channels; tested: boolean }) {
  if (!data.at) return null;

  const rows: [string, ChannelResult | undefined][] = [
    ['Почта', data.mail],
    ['Таблица', data.sheet],
  ];
  const shown = rows.filter(([, r]) => r);
  if (!shown.length) return null;

  return (
    <div className="rounded-lg border border-adm-border bg-adm-bg p-3">
      <p className="mb-2 text-[13px] font-medium text-adm-text2">
        {tested ? 'Результат проверки' : 'Последняя отправка'}
      </p>
      <ul className="space-y-1.5">
        {shown.map(([label, r]) => (
          <li key={label} className="flex flex-wrap items-baseline gap-x-2 text-[13px]">
            <span className="font-medium">{label}:</span>
            <span className={r!.ok ? 'text-adm-success' : 'text-adm-danger'}>
              {r!.ok ? 'доставлено' : 'не ушло'}
            </span>
            {r!.via === 'mail' && r!.ok && (
              <span className="text-adm-muted">обычной отправкой, риск спама</span>
            )}
            {r!.error && <span className="text-adm-muted">{r!.error}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
