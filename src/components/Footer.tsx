import { footer } from '@/content/hero';
import { asset } from '@/lib/paths';

/**
 * Подвал (ТЗ 4.12). Сохранена четырёхчастная структура первого подвала:
 * бренд/описание, контакты, документы, организатор. Телефоны через tel:,
 * почта через mailto:, документы открываются в новой вкладке.
 *
 * ⚠️ Реквизиты организатора и ссылки на юр. документы ещё не переданы —
 * стоят плейсхолдеры (папка «Реквизиты» в Drive пока пустая).
 */
export default function Footer() {
  return (
    <footer id="contacts" className="border-t border-glass-border bg-bg-deep/70 py-14 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:gap-8">
          {/* 1. Бренд и описание */}
          <div>
            <span className="flex items-center gap-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset('/img/logo-flask.png')}
                alt=""
                aria-hidden="true"
                width={100}
                height={160}
                className="h-8 w-auto"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset('/img/logo-text.png')}
                alt="C&B Лаборатория"
                width={493}
                height={160}
                className="h-8 w-auto"
              />
            </span>
            <p className="mt-5 max-w-[280px] text-[15px] leading-relaxed text-text-muted">
              {footer.description}
            </p>
          </div>

          {/* 2. Контакты */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.18em] text-cyan">Контакты</h3>
            <ul className="mt-5 flex flex-col gap-3 text-[15px]">
              <li>
                <a
                  href={`mailto:${footer.email}`}
                  className="text-text-muted transition-colors hover:text-cyan"
                >
                  {footer.email}
                </a>
              </li>
              {footer.phones.map((phone) => (
                <li key={phone}>
                  <a
                    // tel: не терпит пробелов и скобок — чистим до цифр и плюса
                    href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                    className="text-text-muted transition-colors hover:text-cyan"
                  >
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Документы */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.18em] text-cyan">Документы</h3>
            <ul className="mt-5 flex flex-col gap-3 text-[15px]">
              {footer.documents.map((d) => (
                <li key={d.label}>
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted transition-colors hover:text-cyan"
                  >
                    {d.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Организатор */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.18em] text-cyan">
              {footer.organizer.title}
            </h3>
            <ul className="mt-5 flex flex-col gap-2 text-[15px] text-text-muted">
              {footer.organizer.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-glass-border pt-6 text-[13px] text-text-muted">
          {footer.copyright}
        </div>
      </div>
    </footer>
  );
}
