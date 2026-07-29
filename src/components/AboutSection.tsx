import { about, audience, audienceTitle } from '@/content/hero';
import FlaskMark from '@/components/FlaskMark';

/**
 * Блок «О конференции» (правки 24.07) — объединяет концепцию, показатели
 * и аудиторию в одном блоке, как на сайте первой конференции.
 *
 * Подраздел «Место для C&B-экспериментов»: слева описание, справа цифры.
 * Подраздел «Для кого конференция»: маленькие карточки без иконок,
 * иллюстрация Менделеева убрана по правкам.
 */
export default function AboutSection() {
  return (
    <section id="about" className="relative border-t border-glass-border bg-bg-main py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 top-0 h-[360px] w-[620px] -translate-x-1/2 rounded-full bg-cyan/[0.05] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 lg:px-10">
        <div className="mb-3 flex items-center gap-2.5 text-xs uppercase tracking-[0.22em] text-cyan">
          <FlaskMark />
          О конференции
        </div>

        {/* --- Место для C&B-экспериментов: описание + цифры --- */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <h2
              className="text-[clamp(26px,3.4vw,44px)] font-extrabold leading-[1.15] tracking-tight"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              {about.title}
            </h2>
            {about.paragraphs.map((p, i) => (
              <p
                key={i}
                className="mt-5 max-w-[600px] text-[17px] leading-relaxed text-text-muted"
              >
                {p}
              </p>
            ))}
          </div>

          {/* Правки 29.07: рамка заметная и жёлтая, на наведении плашка
              подсвечивается — цифра и фон уходят в акцентный цвет */}
          <div className="grid grid-cols-2 gap-4">
            {about.stats.map((s) => (
              <div
                key={s.label}
                className="group rounded-2xl border-2 border-accent/55 bg-glass p-6 transition-colors duration-300 hover:border-accent hover:bg-accent/10"
              >
                <div
                  className="text-[clamp(30px,3.4vw,44px)] font-extrabold leading-none text-cyan transition-colors duration-300 group-hover:text-accent"
                  style={{ fontFamily: 'var(--font-outfit)' }}
                >
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-text-muted transition-colors duration-300 group-hover:text-white">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Для кого конференция: маленькие карточки без иконок --- */}
        <div className="mt-16 lg:mt-24">
          <h3
            className="max-w-[860px] text-[clamp(22px,2.6vw,32px)] font-bold leading-[1.2]"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            {audienceTitle}
          </h3>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Правки 29.07: рамки ярче. Держим их голубыми — жёлтый занят
                цифрами выше, а разноцветные рамки заказчик просил убрать */}
            {audience.map((a) => (
              <article
                key={a.role}
                className="rounded-2xl border-2 border-cyan/45 bg-glass p-5 transition-colors duration-300 hover:border-cyan hover:bg-cyan/[0.07]"
              >
                <h4
                  className="text-[16px] font-bold leading-tight"
                  style={{ fontFamily: 'var(--font-outfit)' }}
                >
                  {a.role}
                </h4>
                <p className="mt-2.5 text-base leading-relaxed text-text-muted">{a.task}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
