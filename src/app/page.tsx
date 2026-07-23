import Link from 'next/link';

const concepts = [
  {
    key: 'A',
    href: '/hero/a/',
    title: 'Живая формула',
    desc: 'Эволюция первого экрана первой конференции: маскоты, плавающие плашки с понятиями C&B, интерактивное поле точек, бегущая строка формул.',
    note: 'Максимальная узнаваемость бренда',
  },
];

export default function Index() {
  return (
    <main className="min-h-screen bg-bg-main px-5 py-16 lg:px-10">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-3 text-sm uppercase tracking-[0.2em] text-cyan">
          C&amp;B-лаборатория 2.0 · этап согласования
        </div>
        <h1
          className="text-[clamp(30px,4vw,48px)] font-extrabold leading-tight"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Концепция первого экрана
        </h1>
        <p className="mt-4 max-w-[640px] text-text-muted">
          Развитие визуального языка первой конференции: тёмная лаборатория,
          маскоты и живое поле точек.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 md:max-w-[380px]">
          {concepts.map((c) => (
            <Link
              key={c.key}
              href={c.href}
              className="group flex flex-col rounded-2xl border border-glass-border bg-glass p-7 transition-all hover:border-cyan/50 hover:bg-glass-hover"
            >
              <div
                className="text-[52px] font-extrabold leading-none text-white transition-colors group-hover:text-cyan"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                {c.key}
              </div>
              <div className="mt-4 text-xl font-bold">{c.title}</div>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-text-muted">{c.desc}</p>
              <div className="mt-5 border-t border-glass-border pt-4 text-sm text-accent">
                {c.note}
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-sm text-text-muted">
          Контент — плейсхолдеры по ТЗ. Площадка, логотип SVG и цифры первой конференции
          подставляются, как только заказчик их передаст.
        </p>
      </div>
    </main>
  );
}
