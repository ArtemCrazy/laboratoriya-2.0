'use client';

import type { AdminPricing } from '@/lib/adminApi';
import { Field, StringList, RowControls, AddButton, SectionHead } from '@/components/admin/ui';

/**
 * Тарифы: цены, цена по ранней оплате и состав пакета.
 * ТЗ §6 требует, чтобы заказчик менял цены и дедлайны без разработчика.
 */
export default function PricingEditor({
  pricing,
  note,
  onNote,
  onChange,
}: {
  pricing: AdminPricing;
  note: string;
  onNote: (v: string) => void;
  onChange: (next: AdminPricing) => void;
}) {
  const patch = (p: Partial<AdminPricing>) => onChange({ ...pricing, ...p });

  const patchTariff = (ti: number, p: Partial<AdminPricing['tariffs'][0]>) =>
    patch({ tariffs: pricing.tariffs.map((t, i) => (i === ti ? { ...t, ...p } : t)) });

  const move = (ti: number, dir: -1 | 1) => {
    const j = ti + dir;
    if (j < 0 || j >= pricing.tariffs.length) return;
    const next = [...pricing.tariffs];
    [next[ti], next[j]] = [next[j], next[ti]];
    patch({ tariffs: next });
  };

  return (
    <div>
      <SectionHead
        title="Стоимость"
        hint="Тарифы, цены и срок ранней оплаты."
        note={note}
        onNote={onNote}
      >
        <AddButton
          onClick={() =>
            patch({
              tariffs: [
                ...pricing.tariffs,
                {
                  name: 'Новый тариф',
                  audience: '',
                  price: '',
                  earlyPrice: '',
                  recommended: false,
                  features: [],
                },
              ],
            })
          }
        >
          Добавить тариф
        </AddButton>
      </SectionHead>

      <div className="mb-4 grid gap-4 rounded-xl border border-adm-border bg-adm-surface p-4 sm:grid-cols-2">
        <Field
          label="Условие ранней цены"
          value={pricing.earlyDeadline}
          onChange={(v) => patch({ earlyDeadline: v })}
          placeholder="при оплате до 04.09.2026"
        />
        <Field
          label="Примечание под тарифами"
          value={pricing.note}
          onChange={(v) => patch({ note: v })}
          placeholder="НДС 0%"
        />
      </div>

      <div className="space-y-4">
        {pricing.tariffs.map((t, ti) => (
          <div key={ti} className="rounded-xl border border-adm-border bg-adm-surface p-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[180px] flex-1">
                <Field label="Название" value={t.name} onChange={(v) => patchTariff(ti, { name: v })} />
              </div>
              <div className="min-w-[200px] flex-[1.4]">
                <Field
                  label="Кому подходит"
                  value={t.audience}
                  onChange={(v) => patchTariff(ti, { audience: v })}
                />
              </div>
              <div className="pb-1.5">
                <RowControls
                  index={ti}
                  total={pricing.tariffs.length}
                  onMove={(dir) => move(ti, dir)}
                  onRemove={() => {
                    if (!confirm(`Удалить тариф "${t.name}"?`)) return;
                    patch({ tariffs: pricing.tariffs.filter((_, i) => i !== ti) });
                  }}
                />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field
                label="Цена"
                value={t.price}
                onChange={(v) => patchTariff(ti, { price: v })}
                placeholder="72 000 ₽"
              />
              <Field
                label="Цена при ранней оплате"
                value={t.earlyPrice}
                onChange={(v) => patchTariff(ti, { earlyPrice: v })}
                placeholder="64 800 ₽"
              />
            </div>

            <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-[13px]">
              <input
                type="checkbox"
                checked={t.recommended}
                onChange={(e) => {
                  // Рекомендованный тариф выделяется на сайте — он должен быть один
                  const on = e.target.checked;
                  patch({
                    tariffs: pricing.tariffs.map((x, i) => ({
                      ...x,
                      recommended: i === ti ? on : on ? false : x.recommended,
                    })),
                  });
                }}
                className="h-4 w-4 cursor-pointer accent-adm-accent"
              />
              Отметить как рекомендуемый
            </label>

            <div className="mt-4">
              <StringList
                label="Что входит"
                items={t.features}
                onChange={(features) => patchTariff(ti, { features })}
                addLabel="Добавить пункт"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
