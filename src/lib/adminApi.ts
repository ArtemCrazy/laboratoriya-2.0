/**
 * Обращения к PHP-API админки (public/api/*.php).
 *
 * Все запросы идут с credentials: сессия админа живёт в куке, без неё
 * сохранение вернёт 401.
 */

import { asset } from '@/lib/paths';
import {
  speakers as builtinSpeakers,
  program as builtinProgram,
  pricing as builtinPricing,
  reviews as builtinReviews,
  participants as builtinParticipants,
  partnerCategories as builtinPartners,
  footer as builtinFooter,
  hero as builtinHero,
} from '@/content/hero';

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

export type AdminTariff = {
  name: string;
  audience: string;
  price: string;
  earlyPrice: string;
  recommended: boolean;
  features: string[];
};
export type AdminPricing = {
  note: string;
  earlyDeadline: string;
  tariffs: AdminTariff[];
};

export type AdminReview = { text: string; name: string; role: string; company: string };

export type AdminParticipant = { name: string; logo: string };

/** Партнёр внутри категории. Логотип и ссылка необязательны */
export type AdminPartner = { name: string; logo: string; url: string };
export type AdminPartnerCategory = {
  level: string;
  /** Снят — статус не показывается на сайте (пакет ещё не продан) */
  hidden: boolean;
  /** Сколько пустых мест показать, пока логотипов нет */
  slots: number;
  partners: AdminPartner[];
};

export type AdminDocument = { label: string; href: string };
export type AdminFooter = {
  description: string;
  email: string;
  phones: string[];
  documents: AdminDocument[];
  organizerLines: string[];
  copyright: string;
};

export type AdminHero = {
  dates: string;
  location: string;
  locationNote: string;
  hall: string;
};

/** Сноски к блокам: пустая строка — сноска не показывается */
export type AdminNotes = Record<string, string>;

export type AdminContent = {
  hero: AdminHero;
  speakers: AdminSpeaker[];
  program: AdminDay[];
  pricing: AdminPricing;
  reviews: AdminReview[];
  participants: AdminParticipant[];
  partners: AdminPartnerCategory[];
  footer: AdminFooter;
  notes: AdminNotes;
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
    hero: {
      dates: builtinHero.dates,
      location: builtinHero.location,
      locationNote: builtinHero.locationNote,
      hall: 'зал «Архангельск»',
    },
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
    pricing: {
      note: builtinPricing.note,
      earlyDeadline: builtinPricing.earlyDeadline,
      tariffs: builtinPricing.tariffs.map((t) => ({
        name: t.name,
        audience: t.audience,
        price: t.price,
        earlyPrice: t.earlyPrice,
        recommended: t.recommended,
        features: [...t.features],
      })),
    },
    reviews: builtinReviews.map((r) => ({
      text: r.text,
      name: r.name,
      role: r.role,
      company: r.company,
    })),
    participants: builtinParticipants.map((p) => ({ name: p.name, logo: p.logo })),
    partners: builtinPartners.map((c) => ({
      level: c.level,
      hidden: false,
      slots: c.slots,
      partners: [],
    })),
    footer: {
      description: builtinFooter.description,
      email: builtinFooter.email,
      phones: [...builtinFooter.phones],
      documents: builtinFooter.documents.map((d) => ({ label: d.label, href: d.href })),
      organizerLines: [...builtinFooter.organizer.lines],
      copyright: builtinFooter.copyright,
    },
    notes: {},
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

    // Раздел, которого в файле ещё нет, берём из сборки — админка
    // открывается заполненной, а не пустой
    const list = <T>(v: unknown, f: T[]): T[] => (Array.isArray(v) && v.length ? (v as T[]) : f);

    return {
      hero: { ...fallback.hero, ...(c.hero ?? {}) },
      speakers: list(c.speakers, fallback.speakers),
      program: list(c.program, fallback.program),
      pricing: c.pricing?.tariffs?.length ? { ...fallback.pricing, ...c.pricing } : fallback.pricing,
      reviews: list(c.reviews, fallback.reviews),
      participants: list(c.participants, fallback.participants),
      partners: list(c.partners, fallback.partners),
      footer: { ...fallback.footer, ...(c.footer ?? {}) },
      notes: typeof c.notes === 'object' && c.notes ? c.notes : {},
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
