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

export default function LeadsEditor() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState({ notifyEmail: '', notify: true });
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
      setSettings({
        notifyEmail: data.settings?.notifyEmail ?? '',
        notify: data.settings?.notify ?? true,
      });
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
      setTimeout(() => setSavedHint(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить');
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

      <div className="mb-5 rounded-xl border border-adm-border bg-adm-surface p-4">
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
          <button
            type="button"
            onClick={saveSettings}
            className="mb-1 cursor-pointer rounded-lg bg-linear-to-br from-adm-accent to-adm-accent2 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Сохранить
          </button>
          {savedHint && (
            <span className="mb-2.5 flex items-center gap-1.5 text-[13px] text-adm-success">
              <IconCheck size={14} />
              Сохранено
            </span>
          )}
        </div>
        <p className="mt-2 text-[12px] text-adm-muted">
          Письма иногда попадают в спам, поэтому заявки всегда остаются здесь.
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
