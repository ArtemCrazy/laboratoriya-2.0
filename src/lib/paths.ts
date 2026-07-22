/**
 * Префикс для статических файлов (картинки, favicon).
 * next/link и next/image подставляют basePath сами, а обычный <img src>
 * и <link href> — нет, поэтому им путь собираем через asset().
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const asset = (path: string) => `${basePath}${path}`;
