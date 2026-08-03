'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  checkAuth,
  loadContent,
  logout,
  saveContent,
  type AdminContent,
} from '@/lib/adminApi';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminSidebar, {
  SECTION_TITLE,
  type AdminSection,
} from '@/components/admin/AdminSidebar';
import SpeakersEditor from '@/components/admin/SpeakersEditor';
import ProgramEditor from '@/components/admin/ProgramEditor';
import PricingEditor from '@/components/admin/PricingEditor';
import PartnersEditor from '@/components/admin/PartnersEditor';
import FooterEditor from '@/components/admin/FooterEditor';
import LeadsEditor from '@/components/admin/LeadsEditor';
import {
  HeroEditor,
  ReviewsEditor,
  ParticipantsEditor,
} from '@/components/admin/SimpleEditors';
import { IconSave, IconCheck, IconAlert, IconMenu } from '@/components/admin/icons';

const THEME_KEY = 'lab2:adminTheme';

/**
 * Оболочка админки: вход, разделы, сохранение.
 *
 * Страница живёт отдельно от лендинга и в его вёрстку не вмешивается —
 * своя палитра (токены adm-) и свой корневой класс .admin-root.
 */
export default function AdminApp() {
  const [ready, setReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [content, setContent] = useState<AdminContent | null>(null);
  const [section, setSection] = useState<AdminSection>('speakers');
  const [dark, setDark] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Тема — из localStorage, после монтирования (на сервере его нет)
  useEffect(() => {
    try {
      setDark(localStorage.getItem(THEME_KEY) === 'dark');
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = () => {
    setDark((d) => {
      try {
        localStorage.setItem(THEME_KEY, d ? 'light' : 'dark');
      } catch {
        /* ignore */
      }
      return !d;
    });
  };

  const boot = useCallback(async () => {
    const ok = await checkAuth();
    setAuthorized(ok);
    if (ok) setContent(await loadContent());
    setReady(true);
  }, []);

  useEffect(() => {
    void boot();
  }, [boot]);

  // Не даём закрыть вкладку с несохранёнными правками
  useEffect(() => {
    if (!dirty) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onLeave);
    return () => window.removeEventListener('beforeunload', onLeave);
  }, [dirty]);

  const patch = (next: Partial<AdminContent>) => {
    setContent((c) => (c ? { ...c, ...next } : c));
    setDirty(true);
    setStatus(null);
  };

  /** Сноска раздела: пустая строка означает, что на сайте её нет */
  const note = (key: string) => content?.notes?.[key] ?? '';
  const setNote = (key: string, value: string) =>
    setContent((c) => {
      if (!c) return c;
      setDirty(true);
      setStatus(null);
      return { ...c, notes: { ...c.notes, [key]: value } };
    });

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setStatus(null);
    try {
      await saveContent(content);
      setDirty(false);
      setStatus({ kind: 'ok', text: 'Сохранено — изменения уже на сайте' });
    } catch (err) {
      const text = err instanceof Error ? err.message : 'Не удалось сохранить';
      setStatus({ kind: 'err', text });
      // Сессия могла истечь, пока страница была открыта
      if (/вход/i.test(text)) setAuthorized(false);
    } finally {
      setSaving(false);
    }
  };

  const doLogout = async () => {
    if (dirty && !confirm('Есть несохранённые изменения. Выйти и потерять их?')) return;
    await logout();
    setAuthorized(false);
    setContent(null);
    setDirty(false);
  };

  const shell = (children: React.ReactNode) => (
    <div className={`admin-root min-h-screen ${dark ? 'dark' : ''}`}>{children}</div>
  );

  if (!ready) {
    return shell(
      <div className="flex min-h-screen items-center justify-center text-sm text-adm-muted">
        Загружаем…
      </div>,
    );
  }

  if (!authorized) {
    return shell(
      <AdminLogin
        onSuccess={async () => {
          setAuthorized(true);
          setContent(await loadContent());
        }}
      />,
    );
  }

  if (!content) {
    return shell(
      <div className="flex min-h-screen items-center justify-center text-sm text-adm-muted">
        Загружаем контент…
      </div>,
    );
  }

  return shell(
    <div className="flex h-screen">
      <div className="hidden md:flex">
        <AdminSidebar
          section={section}
          onSelect={setSection}
          dark={dark}
          onToggleTheme={toggleTheme}
          onLogout={doLogout}
        />
      </div>

      {/* На мобильном панель выезжает поверх */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0">
            <AdminSidebar
              section={section}
              onSelect={(s) => {
                setSection(s);
                setMenuOpen(false);
              }}
              dark={dark}
              onToggleTheme={toggleTheme}
              onLogout={doLogout}
              collapsible={false}
            />
          </div>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col overflow-auto">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-adm-border bg-adm-elev/85 px-4 py-3 backdrop-blur lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Меню"
            className="cursor-pointer rounded-lg p-1.5 text-adm-text2 hover:bg-adm-surface2 md:hidden"
          >
            <IconMenu size={20} />
          </button>

          <span className="flex-1 truncate text-[15px] font-medium">
            {SECTION_TITLE[section]}
          </span>

          {status && (
            <span
              className={`hidden items-center gap-1.5 text-[13px] sm:flex ${
                status.kind === 'ok' ? 'text-adm-success' : 'text-adm-danger'
              }`}
            >
              {status.kind === 'ok' ? <IconCheck size={15} /> : <IconAlert size={15} />}
              {status.text}
            </span>
          )}

          <button
            type="button"
            onClick={save}
            disabled={saving || !dirty}
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-linear-to-br from-adm-accent to-adm-accent2 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IconSave size={16} />
            {saving ? 'Сохраняем…' : dirty ? 'Сохранить' : 'Сохранено'}
          </button>
        </header>

        {status && (
          <p
            className={`px-4 pt-3 text-[13px] sm:hidden lg:px-8 ${
              status.kind === 'ok' ? 'text-adm-success' : 'text-adm-danger'
            }`}
          >
            {status.text}
          </p>
        )}

        <div className="mx-auto w-full max-w-[980px] flex-1 p-4 lg:p-8">
          {/* Заявки живут отдельно от контента: их не сохраняют кнопкой */}
          {section === 'leads' && <LeadsEditor />}
          {section === 'hero' && (
            <HeroEditor
              hero={content.hero}
              note={note('hero')}
              onNote={(v) => setNote('hero', v)}
              onChange={(hero) => patch({ hero })}
            />
          )}
          {section === 'speakers' && (
            <SpeakersEditor
              speakers={content.speakers}
              note={note('speakers')}
              onNote={(v) => setNote('speakers', v)}
              onChange={(speakers) => patch({ speakers })}
            />
          )}
          {section === 'program' && (
            <ProgramEditor
              program={content.program}
              speakers={content.speakers}
              note={note('program')}
              onNote={(v) => setNote('program', v)}
              onChange={(program) => patch({ program })}
            />
          )}
          {section === 'pricing' && (
            <PricingEditor
              pricing={content.pricing}
              note={note('pricing')}
              onNote={(v) => setNote('pricing', v)}
              onChange={(pricing) => patch({ pricing })}
            />
          )}
          {section === 'reviews' && (
            <ReviewsEditor
              reviews={content.reviews}
              note={note('reviews')}
              onNote={(v) => setNote('reviews', v)}
              onChange={(reviews) => patch({ reviews })}
            />
          )}
          {section === 'participants' && (
            <ParticipantsEditor
              participants={content.participants}
              note={note('participants')}
              onNote={(v) => setNote('participants', v)}
              onChange={(participants) => patch({ participants })}
            />
          )}
          {section === 'partners' && (
            <PartnersEditor
              categories={content.partners}
              note={note('partners')}
              onNote={(v) => setNote('partners', v)}
              onChange={(partners) => patch({ partners })}
            />
          )}
          {section === 'footer' && (
            <FooterEditor
              footer={content.footer}
              note={note('footer')}
              onNote={(v) => setNote('footer', v)}
              onChange={(footer) => patch({ footer })}
            />
          )}
        </div>
      </main>
    </div>,
  );
}
