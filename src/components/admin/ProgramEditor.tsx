'use client';

import type { AdminDay, AdminSpeaker } from '@/lib/adminApi';
import { keyThemes } from '@/content/hero';
import { Field, IconBtn, SectionHead } from '@/components/admin/ui';
import { IconPlus, IconTrash, IconChevron, IconAlert } from '@/components/admin/icons';

/**
 * Форматы: «Доклад» на сайте окрашивается голубым, остальные — жёлтым
 * (правки 29.07). Список открытый — можно вписать свой.
 */
const FORMATS = ['Доклад', 'Дебаты', 'Импровизация', 'Мастер-класс', 'Консилиум', 'Нетворкинг'];

export default function ProgramEditor({
  program,
  speakers,
  note,
  onNote,
  onChange,
}: {
  program: AdminDay[];
  speakers: AdminSpeaker[];
  note: string;
  onNote: (v: string) => void;
  onChange: (next: AdminDay[]) => void;
}) {
  const updateDay = (di: number, patch: Partial<AdminDay>) =>
    onChange(program.map((d, i) => (i === di ? { ...d, ...patch } : d)));

  const updateSession = (di: number, si: number, patch: Partial<AdminDay['sessions'][0]>) =>
    updateDay(di, {
      sessions: program[di].sessions.map((s, i) => (i === si ? { ...s, ...patch } : s)),
    });

  const addSession = (di: number) =>
    updateDay(di, { sessions: [...program[di].sessions, { format: 'Доклад', speaker: 0 }] });

  const removeSession = (di: number, si: number) =>
    updateDay(di, { sessions: program[di].sessions.filter((_, i) => i !== si) });

  const moveSession = (di: number, si: number, dir: -1 | 1) => {
    const list = [...program[di].sessions];
    const j = si + dir;
    if (j < 0 || j >= list.length) return;
    [list[si], list[j]] = [list[j], list[si]];
    updateDay(di, { sessions: list });
  };

  return (
    <div>
      <SectionHead
        title="Программа"
        hint="Два дня конференции. Организационные строки (регистрация, обед) на сайт не выводятся, только выступления."
        note={note}
        onNote={onNote}
      />

      {speakers.length === 0 && (
        <p className="mb-4 flex items-start gap-2 rounded-lg bg-adm-danger-soft px-3.5 py-2.5 text-[13px] text-adm-danger">
          <span className="mt-px shrink-0">
            <IconAlert size={15} />
          </span>
          Сначала добавьте спикеров — сессии ссылаются на них.
        </p>
      )}

      <div className="space-y-5">
        {program.map((day, di) => (
          <div key={di} className="rounded-xl border border-adm-border bg-adm-surface">
            <div className="grid gap-4 border-b border-adm-border p-4 sm:grid-cols-2">
              <Field
                label="Название дня"
                value={day.day}
                onChange={(v) => updateDay(di, { day: v })}
              />
              <Field
                label="Дата"
                value={day.date}
                onChange={(v) => updateDay(di, { date: v })}
              />
            </div>

            <div className="space-y-2.5 p-4">
              {day.sessions.length === 0 && (
                <p className="rounded-lg border border-dashed border-adm-border py-6 text-center text-[13px] text-adm-muted">
                  В этом дне пока нет выступлений
                </p>
              )}

              {day.sessions.map((s, si) => {
                const sp = speakers[s.speaker];
                return (
                  <div
                    key={si}
                    className="flex flex-wrap items-end gap-3 rounded-lg border border-adm-border bg-adm-bg p-3"
                  >
                    <label className="flex min-w-[150px] flex-1 flex-col gap-1.5">
                      <span className="text-[13px] font-medium text-adm-text2">Формат</span>
                      <input
                        list="admin-formats"
                        value={s.format}
                        onChange={(e) => updateSession(di, si, { format: e.target.value })}
                        className="rounded-lg border border-adm-border bg-adm-surface px-3 py-2 text-[14px] text-adm-text outline-none transition-colors focus:border-adm-accent"
                      />
                    </label>

                    <label className="flex min-w-[220px] flex-[2] flex-col gap-1.5">
                      <span className="text-[13px] font-medium text-adm-text2">Спикер</span>
                      <select
                        value={s.speaker}
                        onChange={(e) =>
                          updateSession(di, si, { speaker: Number(e.target.value) })
                        }
                        className="cursor-pointer rounded-lg border border-adm-border bg-adm-surface px-3 py-2 text-[14px] text-adm-text outline-none transition-colors focus:border-adm-accent"
                      >
                        {speakers.map((sp2, i) => (
                          <option key={i} value={i}>
                            {sp2.name || `Спикер ${i + 1}`}
                            {sp2.company ? ` — ${sp2.company}` : ''}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="flex items-center gap-1 pb-1">
                      <IconBtn label="Выше" disabled={si === 0} onClick={() => moveSession(di, si, -1)}>
                        <IconChevron dir="up" size={15} />
                      </IconBtn>
                      <IconBtn
                        label="Ниже"
                        disabled={si === day.sessions.length - 1}
                        onClick={() => moveSession(di, si, 1)}
                      >
                        <IconChevron dir="down" size={15} />
                      </IconBtn>
                      <IconBtn label="Удалить" danger onClick={() => removeSession(di, si)}>
                        <IconTrash size={15} />
                      </IconBtn>
                    </div>

                    {/* Тематический блок из «Ключевых тем». Список открытый:
                        можно выбрать из шести или вписать свой */}
                    <label className="flex w-full flex-col gap-1.5">
                      <span className="text-[13px] font-medium text-adm-text2">
                        Тематический блок
                      </span>
                      <input
                        list="admin-tracks"
                        value={s.track ?? ''}
                        placeholder="Необязательно. Например: Рынок труда и мотивации"
                        onChange={(e) => updateSession(di, si, { track: e.target.value })}
                        className="rounded-lg border border-adm-border bg-adm-surface px-3 py-2 text-[14px] text-adm-text outline-none transition-colors placeholder:text-adm-muted2 focus:border-adm-accent"
                      />
                    </label>

                    {/* Тему можно задать прямо здесь. Пусто — берётся из
                        карточки спикера, чтобы не дублировать её вручную */}
                    <label className="flex w-full flex-col gap-1.5">
                      <span className="text-[13px] font-medium text-adm-text2">
                        Тема выступления
                      </span>
                      <input
                        type="text"
                        value={s.topic ?? ''}
                        placeholder={sp?.topic || 'Тема из карточки спикера'}
                        onChange={(e) => updateSession(di, si, { topic: e.target.value })}
                        className="rounded-lg border border-adm-border bg-adm-surface px-3 py-2 text-[14px] text-adm-text outline-none transition-colors placeholder:text-adm-muted2 focus:border-adm-accent"
                      />
                      <span className="text-[12px] text-adm-muted">
                        {s.topic
                          ? 'Своя тема для этого выступления'
                          : 'Пусто — на сайте покажем тему из карточки спикера'}
                      </span>
                    </label>

                    {!sp && (
                      <p className="w-full text-[12px] text-adm-danger">
                        Спикер удалён — выберите другого
                      </p>
                    )}
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => addSession(di)}
                disabled={speakers.length === 0}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-adm-border px-3.5 py-2 text-[13px] font-medium text-adm-text2 transition-colors hover:border-adm-accent hover:text-adm-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <IconPlus size={15} />
                Добавить выступление
              </button>
            </div>
          </div>
        ))}
      </div>

      <datalist id="admin-formats">
        {FORMATS.map((f) => (
          <option key={f} value={f} />
        ))}
      </datalist>

      {/* Тематические блоки — те же, что в «Ключевых темах» на сайте.
          На странице показываем короткую часть, до двоеточия */}
      <datalist id="admin-tracks">
        {keyThemes.map((t) => (
          <option key={t} value={t.split(':')[0]} />
        ))}
      </datalist>
    </div>
  );
}
