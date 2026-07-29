'use client';

import { useEffect, useState } from 'react';
import { asset } from '@/lib/paths';
import {
  IconUsers,
  IconCalendar,
  IconCollapse,
  IconSun,
  IconMoon,
  IconLogout,
  IconExternal,
} from '@/components/admin/icons';

export type AdminSection = 'speakers' | 'program';

const ITEMS: { id: AdminSection; label: string; Icon: typeof IconUsers }[] = [
  { id: 'speakers', label: 'Спикеры', Icon: IconUsers },
  { id: 'program', label: 'Программа', Icon: IconCalendar },
];

const COLLAPSE_KEY = 'lab2:adminSidebarCollapsed';

/**
 * Левая панель админки. Свёрнутое состояние запоминается, чтобы после
 * перезагрузки осталось как было.
 */
export default function AdminSidebar({
  section,
  onSelect,
  dark,
  onToggleTheme,
  onLogout,
  collapsible = true,
}: {
  section: AdminSection;
  onSelect: (s: AdminSection) => void;
  dark: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  collapsible?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);

  // Читаем сохранённое состояние после монтирования: на сервере
  // localStorage нет, а разметка должна совпасть с серверной
  useEffect(() => {
    if (!collapsible) return;
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === '1');
    } catch {
      /* приватный режим — остаёмся развёрнутыми */
    }
  }, [collapsible]);

  const toggle = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const isCollapsed = collapsible && collapsed;

  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } flex h-full shrink-0 flex-col border-r border-adm-border bg-adm-elev/80 backdrop-blur transition-[width] duration-200`}
    >
      <div
        className={`${
          isCollapsed ? 'justify-center px-0' : 'gap-3 px-5'
        } flex items-center border-b border-adm-border py-4`}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-adm-accent to-adm-accent2 text-[13px] font-bold text-white">
          C&B
        </span>
        {!isCollapsed && (
          <span className="leading-tight">
            <span className="block font-semibold tracking-tight">Лаборатория 2.0</span>
            <span className="block text-[11px] text-adm-muted">панель управления</span>
          </span>
        )}
      </div>

      <nav className="mt-2 flex-1 space-y-1 p-3">
        {!isCollapsed && (
          <div className="mb-1 px-3 text-[10px] uppercase tracking-wider text-adm-muted2">
            Разделы
          </div>
        )}
        {ITEMS.map(({ id, label, Icon }) => {
          const active = id === section;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              title={isCollapsed ? label : undefined}
              className={`group relative flex w-full cursor-pointer items-center ${
                isCollapsed ? 'justify-center' : 'gap-3'
              } rounded-lg px-3 py-2 text-sm transition-all ${
                active
                  ? 'bg-adm-accent-soft font-medium text-adm-accent'
                  : 'text-adm-text2 hover:bg-adm-surface2 hover:text-adm-text'
              }`}
            >
              {active && (
                <span className="absolute inset-y-1.5 left-0 w-1 rounded-r-full bg-adm-accent" />
              )}
              <Icon size={16} strokeWidth={active ? 2.5 : 2} />
              {!isCollapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-adm-border p-3">
        <a
          href={asset('/')}
          target="_blank"
          rel="noopener noreferrer"
          title={isCollapsed ? 'Открыть сайт' : undefined}
          className={`flex items-center ${
            isCollapsed ? 'justify-center' : 'gap-2'
          } w-full rounded-lg py-2 text-sm text-adm-muted transition-colors hover:bg-adm-surface2 hover:text-adm-text`}
        >
          <IconExternal size={16} />
          {!isCollapsed && <span>Открыть сайт</span>}
        </a>

        <button
          type="button"
          onClick={onToggleTheme}
          title={isCollapsed ? 'Сменить тему' : undefined}
          className={`flex cursor-pointer items-center ${
            isCollapsed ? 'justify-center' : 'gap-2'
          } w-full rounded-lg py-2 text-sm text-adm-muted transition-colors hover:bg-adm-surface2 hover:text-adm-text`}
        >
          {dark ? <IconSun size={16} /> : <IconMoon size={16} />}
          {!isCollapsed && <span>{dark ? 'Светлая тема' : 'Тёмная тема'}</span>}
        </button>

        <button
          type="button"
          onClick={onLogout}
          title={isCollapsed ? 'Выйти' : undefined}
          className={`flex cursor-pointer items-center ${
            isCollapsed ? 'justify-center' : 'gap-2'
          } w-full rounded-lg py-2 text-sm text-adm-muted transition-colors hover:bg-adm-surface2 hover:text-adm-text`}
        >
          <IconLogout size={16} />
          {!isCollapsed && <span>Выйти</span>}
        </button>

        {collapsible && (
          <button
            type="button"
            onClick={toggle}
            title={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
            className={`flex cursor-pointer items-center ${
              isCollapsed ? 'justify-center' : 'gap-2'
            } w-full rounded-lg py-2 text-sm text-adm-muted transition-colors hover:bg-adm-surface2 hover:text-adm-text`}
          >
            <IconCollapse dir={isCollapsed ? 'right' : 'left'} size={16} />
            {!isCollapsed && <span>Свернуть меню</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
