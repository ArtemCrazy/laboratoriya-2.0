/**
 * Префикс для статических файлов (картинки, favicon).
 * next/link и next/image подставляют basePath сами, а обычный <img src>
 * и <link href> — нет, поэтому им путь собираем через asset().
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const asset = (path: string) => `${basePath}${path}`;

/**
 * Путь к медиафайлу, который мог прийти из админки. Загруженные фото уже
 * содержат basePath (его подставляет upload.php), а вшитые в сборку — нет,
 * поэтому префикс добавляем только тем, у кого его ещё нет.
 */
export const mediaSrc = (path: string) => {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path;
  if (basePath && path.startsWith(`${basePath}/`)) return path;
  return asset(path);
};
