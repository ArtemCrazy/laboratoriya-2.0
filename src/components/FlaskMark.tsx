import { asset } from '@/lib/paths';

/**
 * Колба — маркер перед надзаголовками секций, вместо длинного тире.
 * Вырезана по зелёному экрану: фон определялся по перевесу зелёного
 * канала, поэтому стекло и голубой раствор остались нетронутыми.
 */
export default function FlaskMark({ className = '' }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset('/img/flask-icon.webp')}
      alt=""
      aria-hidden="true"
      width={226}
      height={320}
      className={`-my-1 h-6 w-auto shrink-0 ${className}`}
    />
  );
}
