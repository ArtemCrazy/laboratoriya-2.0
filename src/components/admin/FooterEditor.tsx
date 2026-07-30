'use client';

import type { AdminFooter } from '@/lib/adminApi';
import {
  Field,
  TextArea,
  StringList,
  RowControls,
  AddButton,
  SectionHead,
} from '@/components/admin/ui';

/**
 * Подвал: описание, контакты, юридические документы и реквизиты.
 * Заказчик просил менять документы самостоятельно — ссылки правятся здесь.
 */
export default function FooterEditor({
  footer,
  note,
  onNote,
  onChange,
}: {
  footer: AdminFooter;
  note: string;
  onNote: (v: string) => void;
  onChange: (next: AdminFooter) => void;
}) {
  const patch = (p: Partial<AdminFooter>) => onChange({ ...footer, ...p });

  const moveDoc = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= footer.documents.length) return;
    const next = [...footer.documents];
    [next[i], next[j]] = [next[j], next[i]];
    patch({ documents: next });
  };

  return (
    <div>
      <SectionHead
        title="Подвал"
        hint="Контакты, документы и реквизиты организатора."
        note={note}
        onNote={onNote}
      />

      <div className="space-y-4">
        <div className="rounded-xl border border-adm-border bg-adm-surface p-4">
          <TextArea
            label="Описание под логотипом"
            value={footer.description}
            rows={2}
            onChange={(v) => patch({ description: v })}
          />
        </div>

        <div className="rounded-xl border border-adm-border bg-adm-surface p-4">
          <h3 className="mb-3 text-[15px] font-semibold">Контакты</h3>
          <div className="space-y-4">
            <Field label="Email" value={footer.email} onChange={(v) => patch({ email: v })} />
            <StringList
              label="Телефоны"
              items={footer.phones}
              onChange={(phones) => patch({ phones })}
              addLabel="Добавить телефон"
              placeholder="+7 (___) ___-__-__"
            />
          </div>
        </div>

        <div className="rounded-xl border border-adm-border bg-adm-surface p-4">
          <h3 className="mb-1 text-[15px] font-semibold">Документы</h3>
          <p className="mb-3 text-[12px] text-adm-muted">
            Название и ссылка. Документы открываются в новой вкладке.
          </p>

          <div className="space-y-2.5">
            {footer.documents.map((d, i) => (
              <div key={i} className="flex flex-wrap items-end gap-3 rounded-lg border border-adm-border bg-adm-bg p-3">
                <div className="min-w-[200px] flex-[1.4]">
                  <Field
                    label="Название"
                    value={d.label}
                    onChange={(v) =>
                      patch({
                        documents: footer.documents.map((x, idx) =>
                          idx === i ? { ...x, label: v } : x,
                        ),
                      })
                    }
                  />
                </div>
                <div className="min-w-[200px] flex-1">
                  <Field
                    label="Ссылка"
                    value={d.href}
                    placeholder="https:// или /docs/oferta.pdf"
                    onChange={(v) =>
                      patch({
                        documents: footer.documents.map((x, idx) =>
                          idx === i ? { ...x, href: v } : x,
                        ),
                      })
                    }
                  />
                </div>
                <div className="pb-1.5">
                  <RowControls
                    index={i}
                    total={footer.documents.length}
                    onMove={(dir) => moveDoc(i, dir)}
                    onRemove={() =>
                      patch({ documents: footer.documents.filter((_, idx) => idx !== i) })
                    }
                  />
                </div>
              </div>
            ))}

            <AddButton
              onClick={() => patch({ documents: [...footer.documents, { label: '', href: '' }] })}
            >
              Добавить документ
            </AddButton>
          </div>
        </div>

        <div className="rounded-xl border border-adm-border bg-adm-surface p-4">
          <h3 className="mb-3 text-[15px] font-semibold">Организатор</h3>
          <StringList
            label="Реквизиты — по строке на каждую"
            items={footer.organizerLines}
            onChange={(organizerLines) => patch({ organizerLines })}
            addLabel="Добавить строку"
            placeholder="ИНН 0000000000"
          />
        </div>

        <div className="rounded-xl border border-adm-border bg-adm-surface p-4">
          <Field
            label="Строка копирайта"
            value={footer.copyright}
            onChange={(v) => patch({ copyright: v })}
          />
        </div>
      </div>
    </div>
  );
}
