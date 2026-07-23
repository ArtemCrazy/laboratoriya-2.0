import { asset } from '@/lib/paths';

/**
 * Декоративная пробирка, в которой периодически поднимаются пузырьки.
 * Само изображение растровое, поэтому бурление рисуется слоем поверх:
 * кружки всплывают в области жидкости и гаснут у её поверхности.
 *
 * Пузырьки идут не постоянно — в keyframes большая часть цикла отдана
 * паузе, поэтому колба «оживает» раз в несколько секунд.
 */

const bubbles = [
  { left: '44%', bottom: '14%', size: 5, delay: 0 },
  { left: '56%', bottom: '20%', size: 3.5, delay: 1.1 },
  { left: '48%', bottom: '11%', size: 4, delay: 2.4 },
  { left: '60%', bottom: '26%', size: 3, delay: 3.2 },
  { left: '40%', bottom: '30%', size: 2.5, delay: 4.6 },
];

export default function BubblingFlask({
  height = 160,
  className = '',
  opacity = 0.5,
}: {
  height?: number;
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative inline-block select-none ${className}`}
      style={{ height, opacity }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset('/img/flask.webp')}
        alt=""
        width={75}
        height={320}
        className="h-full w-auto"
      />

      <div className="absolute inset-0 overflow-hidden">
        {bubbles.map((b, i) => (
          <span
            key={i}
            className="animate-bubble absolute rounded-full bg-white/70"
            style={{
              left: b.left,
              bottom: b.bottom,
              width: b.size,
              height: b.size,
              // Насколько пузырёк успевает подняться до поверхности жидкости
              ['--rise' as string]: `${Math.round(height * 0.42)}px`,
              ['--bubble-duration' as string]: '7s',
              animationDelay: `${b.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
