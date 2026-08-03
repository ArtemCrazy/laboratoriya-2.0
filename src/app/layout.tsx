import type { Metadata } from 'next';
import { asset } from '@/lib/paths';
import LeadProvider from '@/components/LeadProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'C&B-лаборатория 2.0 — концепции первого экрана',
  description:
    'Двухдневная практическая конференция для HR. 22–23 октября 2026, Москва.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        {/* Шрифты первой конференции: Outfit — заголовки, Inter — текст.
            Подключаются ссылкой, а не next/font: сборка не должна зависеть от сети. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/svg+xml" href={asset('/favicon.svg')} />
      </head>
      <body>
        {/* Одно окно заявки на всю страницу — его открывают кнопки из разных блоков */}
        <LeadProvider>{children}</LeadProvider>
      </body>
    </html>
  );
}
