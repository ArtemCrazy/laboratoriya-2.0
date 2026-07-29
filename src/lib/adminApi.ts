/**
 * Обращения к PHP-API админки (public/api/*.php).
 *
 * Все запросы идут с credentials: сессия админа живёт в куке, без неё
 * сохранение вернёт 401.
 */

import { asset } from '@/lib/paths';
import { speakers as builtinSpeakers, program as builtinProgram } from '@/content/hero';

export type AdminSpeaker = {
  name: string;
  role: string;
  company: string;
  photo: string;
  topic: string;
  theme: string;
};

export type AdminSession = { format: string; speaker: number };
export type AdminDay = { day: string; date: string; sessions: AdminSession[] };

export type AdminContent = {
  speakers: AdminSpeaker[];
  program: AdminDay[];
};

const api = (file: string) => asset(`/api/${file}`);

async function parse(res: Response) {
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || `Ошибка запроса (${res.status})`);
  }
  return data;
}

export async function checkAuth(): Promise<boolean> {
  try {
    const data = await parse(await fetch(api('auth.php'), { credentials: 'same-origin' }));
    return Boolean(data.authorized);
  } catch {
    return false;
  }
}

export async function login(password: string): Promise<void> {
  await parse(
    await fetch(api('auth.php'), {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', password }),
    }),
  );
}

export async function logout(): Promise<void> {
  await fetch(api('auth.php'), {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'logout' }),
  }).catch(() => undefined);
}

/**
 * Данные, вшитые в сборку. Ими наполняем админку при первом заходе,
 * пока в content.json ещё ничего не сохранено.
 */
export function builtinContent(): AdminContent {
  return {
    speakers: builtinSpeakers.map((s) => ({
      name: s.name,
      role: s.role,
      company: s.company,
      photo: s.photo,
      topic: s.topic,
      theme: s.theme,
    })),
    program: builtinProgram.map((d) => ({
      day: d.day,
      date: d.date,
      sessions: d.sessions.map((x) => ({ format: x.format, speaker: x.speaker })),
    })),
  };
}

/** Контент с сервера; если его ещё нет — вшитый в сборку */
export async function loadContent(): Promise<AdminContent> {
  const fallback = builtinContent();
  try {
    const res = await fetch(`${api('content.php')}?t=${Date.now()}`, {
      credentials: 'same-origin',
    });
    const data = await parse(res);
    const c = data.content ?? {};
    return {
      speakers: Array.isArray(c.speakers) && c.speakers.length ? c.speakers : fallback.speakers,
      program: Array.isArray(c.program) && c.program.length ? c.program : fallback.program,
    };
  } catch {
    return fallback;
  }
}

export async function saveContent(content: AdminContent): Promise<void> {
  await parse(
    await fetch(api('content.php'), {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    }),
  );
}

export async function uploadPhoto(file: File): Promise<string> {
  const body = new FormData();
  body.append('file', file);
  const data = await parse(
    await fetch(api('upload.php'), { method: 'POST', credentials: 'same-origin', body }),
  );
  return data.path as string;
}
