import { asset } from '@/lib/paths';

/**
 * Пробирка — маркер перед надзаголовками секций, вместо длинного тире.
 * Вырезана строго по силуэту: ширину задаёт крышка, ореол свечения
 * вокруг отсечён — это служебный элемент, подсвечивать его нечему.
 */
export default function FlaskMark({ className = '' }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset('/img/flask.webp')}
      alt=""
      aria-hidden="true"
      width={75}
      height={320}
      className={`-my-0.5 h-5 w-auto shrink-0 ${className}`}
    />
  );
}
