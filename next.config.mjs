/**
 * Стенд живёт в подпапке: http://korovai.crazytest.ru/laboratoriya-2.0/
 * Поэтому нужен basePath — иначе ассеты будут искаться в корне домена.
 * Для боевого домена достаточно собрать с BASE_PATH=''.
 */
const basePath = process.env.BASE_PATH ?? '/laboratoriya-2.0';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Статический экспорт: стенд — обычный шаред-хостинг без Node.js
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    // Доступно в клиентском коде — нужно для путей к картинкам в <img>
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
