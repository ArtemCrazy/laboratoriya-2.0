'use client';

import { useRef, useState } from 'react';
import type { AdminSpeaker } from '@/lib/adminApi';
import { uploadPhoto } from '@/lib/adminApi';
import { mediaSrc } from '@/lib/paths';
import { speakerThemes } from '@/content/hero';
import {
  IconPlus,
  IconTrash,
  IconChevron,
  IconImage,
  IconAlert,
} from '@/components/admin/icons';
import { Field, IconBtn, SectionHead } from '@/components/admin/ui';

const THEMES = Object.keys(speakerThemes) as (keyof typeof speakerThemes)[];

/**
 * Редактор карточек спикеров: порядок, поля и фото.
 *
 * Правки 12.08: выпадающий список «Тема выступления» из формы убран.
 * Он задавал только цвет акцента карточки — теперь цвет назначается
 * по очереди при добавлении спикера, у сохранённых карточек не меняется.
 */
export default function SpeakersEditor({
  speakers,
  note,
  onNote,
  onChange,
}: {
  speakers: AdminSpeaker[];
  note: string;
  onNote: (v: string) => void;
  onChange: (next: AdminSpeaker[]) => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const update = (i: number, patch: Partial<AdminSpeaker>) =>
    onChange(speakers.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= speakers.length) return;
    const next = [...speakers];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpenIndex(j);
  };

  const remove = (i: number) => {
    if (!confirm(`Удалить спикера «${speakers[i].name || 'без имени'}»?`)) return;
    onChange(speakers.filter((_, idx) => idx !== i));
    setOpenIndex(null);
  };

  const add = () => {
    const next: AdminSpeaker = {
      name: '',
      role: '',
      company: '',
      photo: '',
      topic: '',
      theme: THEMES[speakers.length % THEMES.length],
    };
    onChange([...speakers, next]);
    setOpenIndex(speakers.length);
  };

  return (
    <div>
      <SectionHead
        title="Спикеры"
        hint="Карточки в карусели на сайте. Порядок здесь — порядок на странице."
        note={note}
        onNote={onNote}
        notePlaceholder="Например: Спикеры прошлой конференции"
      >
        <button
          type="button"
          onClick={add}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-linear-to-br from-adm-accent to-adm-accent2 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <IconPlus size={16} strokeWidth={2.5} />
          Добавить спикера
        </button>
      </SectionHead>

      {speakers.length === 0 && (
        <p className="rounded-xl border border-dashed border-adm-border bg-adm-surface p-8 text-center text-sm text-adm-muted">
          Пока ни одного спикера. Нажмите «Добавить спикера».
        </p>
      )}

      <div className="space-y-2.5">
        {speakers.map((s, i) => (
          <SpeakerRow
            key={i}
            index={i}
            total={speakers.length}
            speaker={s}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            onUpdate={(patch) => update(i, patch)}
            onMove={(dir) => move(i, dir)}
            onRemove={() => remove(i)}
          />
        ))}
      </div>
    </div>
  );
}

function SpeakerRow({
  index,
  total,
  speaker,
  open,
  onToggle,
  onUpdate,
  onMove,
  onRemove,
}: {
  index: number;
  total: number;
  speaker: AdminSpeaker;
  open: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<AdminSpeaker>) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickPhoto = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      onUpdate({ photo: await uploadPhoto(file) });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить фото');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const color = speakerThemes[speaker.theme as keyof typeof speakerThemes] ?? '#00E5FF';

  return (
    <div className="overflow-hidden rounded-xl border border-adm-border bg-adm-surface">
      <div className="flex items-center gap-3 p-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border"
          style={{ borderColor: `${color}66` }}
        >
          {speaker.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mediaSrc(speaker.photo)}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-adm-muted2">
              <IconImage size={18} />
            </span>
          )}
        </span>

        <button
          type="button"
          onClick={onToggle}
          className="min-w-0 flex-1 cursor-pointer text-left"
        >
          <span className="block truncate text-[15px] font-medium">
            {speaker.name || 'Новый спикер'}
          </span>
          <span className="block truncate text-[13px] text-adm-muted">
            {[speaker.role, speaker.company].filter(Boolean).join(', ') || 'должность и компания'}
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <IconBtn label="Выше" disabled={index === 0} onClick={() => onMove(-1)}>
            <IconChevron dir="up" size={15} />
          </IconBtn>
          <IconBtn label="Ниже" disabled={index === total - 1} onClick={() => onMove(1)}>
            <IconChevron dir="down" size={15} />
          </IconBtn>
          <IconBtn label="Удалить" danger onClick={onRemove}>
            <IconTrash size={15} />
          </IconBtn>
          <IconBtn label={open ? 'Свернуть' : 'Развернуть'} onClick={onToggle}>
            <IconChevron dir={open ? 'up' : 'down'} size={15} />
          </IconBtn>
        </div>
      </div>

      {open && (
        <div className="border-t border-adm-border p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Имя и фамилия"
              value={speaker.name}
              onChange={(v) => onUpdate({ name: v })}
            />
            <Field
              label="Компания"
              value={speaker.company}
              onChange={(v) => onUpdate({ company: v })}
            />
            <Field
              label="Должность"
              value={speaker.role}
              onChange={(v) => onUpdate({ role: v })}
            />
          </div>

          <div className="mt-4">
            <Field
              label="Тема доклада"
              value={speaker.topic}
              onChange={(v) => onUpdate({ topic: v })}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => pickPhoto(e.target.files?.[0])}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-adm-border bg-adm-surface2 px-3.5 py-2 text-[13px] font-medium transition-colors hover:border-adm-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              <IconImage size={15} />
              {uploading ? 'Загружаем…' : speaker.photo ? 'Заменить фото' : 'Загрузить фото'}
            </button>
            <span className="text-[12px] text-adm-muted">JPG, PNG или WEBP, до 8 МБ</span>
          </div>

          {error && (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-adm-danger-soft px-3 py-2 text-[13px] text-adm-danger">
              <span className="mt-px shrink-0">
                <IconAlert size={14} />
              </span>
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

