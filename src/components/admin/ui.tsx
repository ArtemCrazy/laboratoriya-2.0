'use client';

import { IconChevron, IconTrash, IconPlus } from '@/components/admin/icons';

/** Одиночное текстовое поле */
export function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-adm-text2">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-adm-border bg-adm-bg px-3 py-2 text-[14px] text-adm-text outline-none transition-colors placeholder:text-adm-muted2 focus:border-adm-accent"
      />
    </label>
  );
}

/** Многострочное поле — для отзывов и описаний */
export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-adm-text2">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="resize-y rounded-lg border border-adm-border bg-adm-bg px-3 py-2 text-[14px] leading-relaxed text-adm-text outline-none transition-colors focus:border-adm-accent"
      />
      {hint && <span className="text-[12px] text-adm-muted">{hint}</span>}
    </label>
  );
}

export function IconBtn({
  label,
  onClick,
  disabled,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-adm-muted transition-colors hover:bg-adm-surface2 hover:text-adm-text disabled:cursor-not-allowed disabled:opacity-30 ${
        danger ? 'hover:bg-adm-danger-soft hover:text-adm-danger' : ''
      }`}
    >
      {children}
    </button>
  );
}

/** Стрелки «выше/ниже» и удаление — одинаковые во всех списках */
export function RowControls({
  index,
  total,
  onMove,
  onRemove,
}: {
  index: number;
  total: number;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
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
    </div>
  );
}

export function AddButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-adm-border px-3.5 py-2 text-[13px] font-medium text-adm-text2 transition-colors hover:border-adm-accent hover:text-adm-accent disabled:cursor-not-allowed disabled:opacity-50"
    >
      <IconPlus size={15} />
      {children}
    </button>
  );
}

/** Список простых строк: состав тарифа, телефоны, реквизиты */
export function StringList({
  label,
  items,
  onChange,
  addLabel,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (next: string[]) => void;
  addLabel: string;
  placeholder?: string;
}) {
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-medium text-adm-text2">{label}</span>
      {items.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            type="text"
            value={v}
            placeholder={placeholder}
            onChange={(e) => onChange(items.map((x, idx) => (idx === i ? e.target.value : x)))}
            className="flex-1 rounded-lg border border-adm-border bg-adm-bg px-3 py-2 text-[14px] text-adm-text outline-none transition-colors placeholder:text-adm-muted2 focus:border-adm-accent"
          />
          <RowControls
            index={i}
            total={items.length}
            onMove={(dir) => move(i, dir)}
            onRemove={() => onChange(items.filter((_, idx) => idx !== i))}
          />
        </div>
      ))}
      <AddButton onClick={() => onChange([...items, ''])}>{addLabel}</AddButton>
    </div>
  );
}

/**
 * Заголовок раздела и сноска к блоку.
 *
 * Сноска выводится на сайте под заголовком блока. Пустая — не показывается,
 * поэтому её можно снять, когда стала неактуальной (просьба заказчика:
 * например, пометить, что спикеры пока с прошлой конференции).
 */
export function SectionHead({
  title,
  hint,
  note,
  onNote,
  notePlaceholder,
  children,
}: {
  title: string;
  hint?: string;
  note: string;
  onNote: (v: string) => void;
  notePlaceholder?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[19px] font-semibold tracking-tight">{title}</h2>
          {hint && <p className="mt-1 text-[13px] text-adm-muted">{hint}</p>}
        </div>
        {children}
      </div>

      <div className="mt-4 rounded-xl border border-adm-border bg-adm-surface p-4">
        <Field
          label="Сноска к блоку на сайте"
          value={note}
          onChange={onNote}
          placeholder={notePlaceholder ?? 'Необязательно. Пусто — сноска не показывается'}
        />
        <p className="mt-2 text-[12px] text-adm-muted">
          Появится под заголовком блока на сайте. Очистите поле, когда сноска больше не нужна.
        </p>
      </div>
    </div>
  );
}
