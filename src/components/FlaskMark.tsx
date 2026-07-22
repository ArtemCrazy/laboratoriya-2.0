import { asset } from '@/lib/paths';

/**
 * Пробирка со светящейся жидкостью — маркер перед надзаголовками секций.
 * Заменила декоративную горизонтальную черту: тот же ритм, но элемент
 * фирменный. Фон вырезан по цветности, свечение вокруг сохранено.
 */
export default function FlaskMark({ className = '' }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset('/img/flask.webp')}
      alt=""
      aria-hidden="true"
      width={267}
      height={400}
      className={`-my-2 h-9 w-auto shrink-0 ${className}`}
    />
  );
}
