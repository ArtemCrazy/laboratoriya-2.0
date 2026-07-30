'use client';

import { useRef, useState } from 'react';
import type { AdminPartnerCategory } from '@/lib/adminApi';
import { uploadPhoto } from '@/lib/adminApi';
import { mediaSrc } from '@/lib/paths';
import { Field, RowControls, AddButton, SectionHead, IconBtn } from '@/components/admin/ui';
import { IconImage, IconAlert, IconTrash } from '@/components/admin/icons';

/**
 * Партнёры по статусам. Статус, по которому пакет ещё не продан, можно снять
 * галочкой — на сайте он не показывается (просьба заказчика), но остаётся
 * в админке вместе с уже заполненными данными.
 */
export default function PartnersEditor({
  categories,
  note,
  onNote,
  onChange,
}: {
  categories: AdminPartnerCategory[];
  note: string;
  onNote: (v: string) => void;
  onChange: (next: AdminPartnerCategory[]) => void;
}) {
  const patch = (ci: number, p: Partial<AdminPartnerCategory>) =>
    onChange(categories.map((c, i) => (i === ci ? { ...c, ...p } : c)));

  const moveCategory = (ci: number, dir: -1 | 1) => {
    const j = ci + dir;
    if (j < 0 || j >= categories.length) return;
    const next = [...categories];
    [next[ci], next[j]] = [next[j], next[ci]];
    onChange(next);
  };

  return (
    <div>
      <SectionHead
        title="Партнёры"
        hint="Статусы и логотипы. Снятый статус на сайте не показывается."
        note={note}
        onNote={onNote}
      >
        <AddButton
          onClick={() =>
            onChange([...categories, { level: 'Новый статус', hidden: false, slots: 1, partners: [] }])
          }
        >
          Добавить статус
        </AddButton>
      </SectionHead>

      <div className="space-y-4">
        {categories.map((c, ci) => (
          <div
            key={ci}
            className={`rounded-xl border bg-adm-surface transition-opacity ${
              c.hidden ? 'border-adm-border opacity-60' : 'border-adm-border'
            }`}
          >
            <div className="flex flex-wrap items-end gap-3 border-b border-adm-border p-4">
              <div className="min-w-[220px] flex-1">
                <Field
                  label="Название статуса"
                  value={c.level}
                  onChange={(v) => patch(ci, { level: v })}
                />
              </div>

              <label className="flex min-w-[150px] flex-col gap-1.5">
                <span className="text-[13px] font-medium text-adm-text2">Пустых мест</span>
                <input
                  type="number"
                  min={0}
                  max={12}
                  value={c.slots}
                  onChange={(e) => patch(ci, { slots: Math.max(0, Number(e.target.value) || 0) })}
                  className="rounded-lg border border-adm-border bg-adm-bg px-3 py-2 text-[14px] text-adm-text outline-none transition-colors focus:border-adm-accent"
                />
              </label>

              <label className="flex cursor-pointer items-center gap-2.5 pb-2.5 text-[13px]">
                <input
                  type="checkbox"
                  checked={c.hidden}
                  onChange={(e) => patch(ci, { hidden: e.target.checked })}
                  className="h-4 w-4 cursor-pointer accent-adm-accent"
                />
                Скрыть статус на сайте
              </label>

              <div className="pb-1.5">
                <RowControls
                  index={ci}
                  total={categories.length}
                  onMove={(dir) => moveCategory(ci, dir)}
                  onRemove={() => {
                    if (!confirm(`Удалить статус "${c.level}"?`)) return;
                    onChange(categories.filter((_, i) => i !== ci));
                  }}
                />
              </div>
            </div>

            <div className="space-y-2.5 p-4">
              {c.partners.map((p, pi) => (
                <PartnerRow
                  key={pi}
                  partner={p}
                  index={pi}
                  total={c.partners.length}
                  onUpdate={(patchP) =>
                    patch(ci, {
                      partners: c.partners.map((x, i) => (i === pi ? { ...x, ...patchP } : x)),
                    })
                  }
                  onMove={(dir) => {
                    const j = pi + dir;
                    if (j < 0 || j >= c.partners.length) return;
                    const next = [...c.partners];
                    [next[pi], next[j]] = [next[j], next[pi]];
                    patch(ci, { partners: next });
                  }}
                  onRemove={() =>
                    patch(ci, { partners: c.partners.filter((_, i) => i !== pi) })
                  }
                />
              ))}

              <AddButton
                onClick={() =>
                  patch(ci, { partners: [...c.partners, { name: '', logo: '', url: '' }] })
                }
              >
                Добавить партнёра
              </AddButton>

              {c.partners.length === 0 && c.slots > 0 && (
                <p className="text-[12px] text-adm-muted">
                  Пока логотипов нет — на сайте показываются пустые места ({c.slots}).
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PartnerRow({
  partner,
  index,
  total,
  onUpdate,
  onMove,
  onRemove,
}: {
  partner: { name: string; logo: string; url: string };
  index: number;
  total: number;
  onUpdate: (p: Partial<{ name: string; logo: string; url: string }>) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onUpdate({ logo: await uploadPhoto(file) });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить логотип');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="rounded-lg border border-adm-border bg-adm-bg p-3">
      <div className="flex flex-wrap items-end gap-3">
        <span className="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded border border-adm-border bg-adm-surface2">
          {partner.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaSrc(partner.logo)} alt="" className="max-h-8 max-w-full object-contain" />
          ) : (
            <span className="text-adm-muted2">
              <IconImage size={16} />
            </span>
          )}
        </span>

        <div className="min-w-[160px] flex-1">
          <Field label="Название" value={partner.name} onChange={(v) => onUpdate({ name: v })} />
        </div>
        <div className="min-w-[200px] flex-[1.4]">
          <Field
            label="Ссылка на сайт"
            value={partner.url}
            onChange={(v) => onUpdate({ url: v })}
            placeholder="https://"
          />
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />
        <div className="flex items-center gap-1 pb-1">
          <IconBtn label={busy ? 'Загружаем' : 'Загрузить логотип'} onClick={() => fileRef.current?.click()}>
            <IconImage size={15} />
          </IconBtn>
          {partner.logo && (
            <IconBtn label="Убрать логотип" onClick={() => onUpdate({ logo: '' })}>
              <IconTrash size={15} />
            </IconBtn>
          )}
          <RowControls index={index} total={total} onMove={onMove} onRemove={onRemove} />
        </div>
      </div>

      {error && (
        <p className="mt-2 flex items-start gap-2 text-[12px] text-adm-danger">
          <IconAlert size={13} />
          {error}
        </p>
      )}
    </div>
  );
}
