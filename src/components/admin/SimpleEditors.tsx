'use client';

import { useRef, useState } from 'react';
import type { AdminHero, AdminParticipant, AdminReview } from '@/lib/adminApi';
import { uploadPhoto } from '@/lib/adminApi';
import { mediaSrc } from '@/lib/paths';
import {
  Field,
  TextArea,
  RowControls,
  AddButton,
  SectionHead,
  IconBtn,
} from '@/components/admin/ui';
import { IconImage, IconAlert, IconTrash } from '@/components/admin/icons';

/** Общая часть: сдвиг элемента списка */
function moved<T>(items: T[], i: number, dir: -1 | 1): T[] | null {
  const j = i + dir;
  if (j < 0 || j >= items.length) return null;
  const next = [...items];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/** Даты и место — их правят чаще всего (ТЗ §6) */
export function HeroEditor({
  hero,
  note,
  onNote,
  onChange,
}: {
  hero: AdminHero;
  note: string;
  onNote: (v: string) => void;
  onChange: (next: AdminHero) => void;
}) {
  const patch = (p: Partial<AdminHero>) => onChange({ ...hero, ...p });

  return (
    <div>
      <SectionHead
        title="Даты и место"
        hint="Выводятся на первом экране, в подвале и в мобильной кнопке."
        note={note}
        onNote={onNote}
      />

      <div className="grid gap-4 rounded-xl border border-adm-border bg-adm-surface p-4 sm:grid-cols-2">
        <Field
          label="Даты"
          value={hero.dates}
          onChange={(v) => patch({ dates: v })}
          placeholder="22–23 октября 2026"
        />
        <Field label="Город" value={hero.location} onChange={(v) => patch({ location: v })} />
        <Field
          label="Площадка"
          value={hero.locationNote}
          onChange={(v) => patch({ locationNote: v })}
          placeholder="кластер «Ломоносов»"
        />
        <Field
          label="Зал"
          value={hero.hall}
          onChange={(v) => patch({ hall: v })}
          placeholder="зал «Архангельск»"
        />
      </div>
    </div>
  );
}

/** Отзывы участников */
export function ReviewsEditor({
  reviews,
  note,
  onNote,
  onChange,
}: {
  reviews: AdminReview[];
  note: string;
  onNote: (v: string) => void;
  onChange: (next: AdminReview[]) => void;
}) {
  const patch = (i: number, p: Partial<AdminReview>) =>
    onChange(reviews.map((r, idx) => (idx === i ? { ...r, ...p } : r)));

  return (
    <div>
      <SectionHead
        title="Отзывы"
        hint="Цитата, имя, должность и компания."
        note={note}
        onNote={onNote}
      >
        <AddButton
          onClick={() => onChange([...reviews, { text: '', name: '', role: '', company: '' }])}
        >
          Добавить отзыв
        </AddButton>
      </SectionHead>

      {reviews.length === 0 && (
        <p className="rounded-xl border border-dashed border-adm-border bg-adm-surface p-8 text-center text-sm text-adm-muted">
          Отзывов пока нет. Блок на сайте не показывается, пока не добавите хотя бы один.
        </p>
      )}

      <div className="space-y-4">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-xl border border-adm-border bg-adm-surface p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-[13px] font-medium text-adm-muted">Отзыв {i + 1}</span>
              <RowControls
                index={i}
                total={reviews.length}
                onMove={(dir) => {
                  const next = moved(reviews, i, dir);
                  if (next) onChange(next);
                }}
                onRemove={() => onChange(reviews.filter((_, idx) => idx !== i))}
              />
            </div>

            <TextArea label="Текст отзыва" value={r.text} onChange={(v) => patch(i, { text: v })} />

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Field label="Имя" value={r.name} onChange={(v) => patch(i, { name: v })} />
              <Field label="Должность" value={r.role} onChange={(v) => patch(i, { role: v })} />
              <Field label="Компания" value={r.company} onChange={(v) => patch(i, { company: v })} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Логотипы компаний-участников */
export function ParticipantsEditor({
  participants,
  note,
  onNote,
  onChange,
}: {
  participants: AdminParticipant[];
  note: string;
  onNote: (v: string) => void;
  onChange: (next: AdminParticipant[]) => void;
}) {
  return (
    <div>
      <SectionHead
        title="Участники"
        hint="Логотипы компаний, представители которых были на конференции."
        note={note}
        onNote={onNote}
      >
        <AddButton onClick={() => onChange([...participants, { name: '', logo: '' }])}>
          Добавить компанию
        </AddButton>
      </SectionHead>

      <div className="space-y-2.5">
        {participants.map((p, i) => (
          <ParticipantRow
            key={i}
            participant={p}
            index={i}
            total={participants.length}
            onUpdate={(patch) =>
              onChange(participants.map((x, idx) => (idx === i ? { ...x, ...patch } : x)))
            }
            onMove={(dir) => {
              const next = moved(participants, i, dir);
              if (next) onChange(next);
            }}
            onRemove={() => onChange(participants.filter((_, idx) => idx !== i))}
          />
        ))}
      </div>
    </div>
  );
}

function ParticipantRow({
  participant,
  index,
  total,
  onUpdate,
  onMove,
  onRemove,
}: {
  participant: AdminParticipant;
  index: number;
  total: number;
  onUpdate: (p: Partial<AdminParticipant>) => void;
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
    <div className="rounded-lg border border-adm-border bg-adm-surface p-3">
      <div className="flex flex-wrap items-end gap-3">
        {/* Логотипы белые, поэтому подложка тёмная — иначе их не видно */}
        <span className="flex h-11 w-20 shrink-0 items-center justify-center overflow-hidden rounded border border-adm-border bg-[#0f172a]">
          {participant.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaSrc(participant.logo)}
              alt=""
              className="max-h-7 max-w-full object-contain"
            />
          ) : (
            <span className="text-adm-muted2">
              <IconImage size={16} />
            </span>
          )}
        </span>

        <div className="min-w-[200px] flex-1">
          <Field label="Компания" value={participant.name} onChange={(v) => onUpdate({ name: v })} />
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => pick(e.target.files?.[0])}
        />
        <div className="flex items-center gap-1 pb-1">
          <IconBtn
            label={busy ? 'Загружаем' : 'Загрузить логотип'}
            onClick={() => fileRef.current?.click()}
          >
            <IconImage size={15} />
          </IconBtn>
          {participant.logo && (
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
