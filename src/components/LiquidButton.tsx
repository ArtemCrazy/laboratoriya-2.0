'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Кнопка liquid — поведение как на crazy.studio/brief.
 *
 * Контур кнопки набран точками. Каждая точка притягивается к курсору с силой
 * mouseForce / dist² (ограниченной forceLimit), пружиной возвращается на место
 * и гасится вязкостью. Два слоя с разными параметрами дают эффект тягучей
 * жидкости: задний отстаёт от переднего.
 *
 * Параметры взяты с живой страницы брифа:
 *   viscosity 0.5 / 0.4, mouseForce 400 / 500, forceLimit 1 / 2, forceFactor 0.1
 *
 * На устройствах без hover жидкость не рисуется вовсе — как в оригинале
 * (@media (hover: none) { .liquid-btn svg { display: none } }).
 */

const PAD = 56; // запас вокруг кнопки: жидкости есть куда выплёскиваться
const POINTS = 36;

// Параметры притяжения подобраны расчётом: при forceLimit 1 и 2 передний слой
// уходит к курсору примерно на 15px, задний — на 39px. Отсюда и липкость.
const INFLUENCE = 200; // радиус, дальше которого курсор не действует
const GAIN = 1.0;
const SPRING = 0.05;
const MAX_OFFSET = 44; // дальше точка не улетает

type Layer = {
  viscosity: number;
  mouseForce: number;
  forceLimit: number;
  points: { ox: number; oy: number; x: number; y: number; vx: number; vy: number }[];
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  icon?: React.ReactNode;
  className?: string;
};

export default function LiquidButton({
  href,
  children,
  variant = 'primary',
  icon,
  className = '',
}: Props) {
  const rootRef = useRef<HTMLAnchorElement>(null);
  const backRef = useRef<SVGPathElement>(null);
  const frontRef = useRef<SVGPathElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  // Определяем поддержку hover в JS, а не медиа-вариантом в классе:
  // так гарантированно видно, какой слой показан
  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    setHasHover(window.matchMedia('(hover: hover)').matches);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const measure = () => {
      const r = root.getBoundingClientRect();
      if (r.width && r.height) {
        setSize((prev) =>
          prev.w === Math.round(r.width) && prev.h === Math.round(r.height)
            ? prev
            : { w: Math.round(r.width), h: Math.round(r.height) }
        );
      }
    };

    measure(); // сразу, не дожидаясь первого срабатывания наблюдателя
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const back = backRef.current;
    const front = frontRef.current;
    if (!root || !back || !front || !size.w || !size.h) return;

    // Ни физики, ни слушателей там, где нет курсора или отключено движение
    if (!window.matchMedia('(hover: hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const still = buildLayer(size.w, size.h, 0, 0, 0);
      back.setAttribute('d', pathFrom(still.points));
      front.setAttribute('d', pathFrom(still.points));
      return;
    }

    const layers: Layer[] = [
      buildLayer(size.w, size.h, 0.5, 400, 1),
      buildLayer(size.w, size.h, 0.4, 500, 2),
    ];

    let mx = -9999;
    let my = -9999;

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      // Координаты внутри SVG, у которого начало сдвинуто на PAD
      mx = e.clientX - r.left + PAD;
      my = e.clientY - r.top + PAD;
    };
    const onLeave = () => {
      mx = -9999;
      my = -9999;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);

      for (const layer of layers) {
        for (const p of layer.points) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          // Притяжение к курсору: спадает к нулю на границе радиуса влияния.
          // Квадрат расстояния здесь не годится — при forceLimit 1–2 и шаге 0.1
          // смещение выходило меньше пикселя, и липкости не было видно.
          const t = dist < INFLUENCE ? 1 - dist / INFLUENCE : 0;
          const pull = layer.forceLimit * GAIN * t * t;
          p.vx += (dx / dist) * pull;
          p.vy += (dy / dist) * pull;

          // Пружина обратно на контур
          p.vx += (p.ox - p.x) * SPRING;
          p.vy += (p.oy - p.y) * SPRING;

          // Вязкость: чем ниже, тем «гуще» слой и тем сильнее он отстаёт
          p.vx *= layer.viscosity;
          p.vy *= layer.viscosity;

          p.x += p.vx;
          p.y += p.vy;

          // Не даём каплям улетать за пределы svg
          const ox = p.x - p.ox;
          const oy = p.y - p.oy;
          const off = Math.sqrt(ox * ox + oy * oy);
          if (off > MAX_OFFSET) {
            p.x = p.ox + (ox / off) * MAX_OFFSET;
            p.y = p.oy + (oy / off) * MAX_OFFSET;
          }
        }
      }

      back.setAttribute('d', pathFrom(layers[1].points));
      front.setAttribute('d', pathFrom(layers[0].points));
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
    };
  }, [size.w, size.h]);

  const primary = variant === 'primary';

  return (
    <a
      ref={rootRef}
      href={href}
      className={`liquid-btn group relative inline-flex items-center justify-center px-8 py-4 text-center font-semibold transition-transform duration-200 active:scale-[0.97] ${
        primary ? 'text-text-dark' : 'text-white'
      } ${className}`}
    >
      {/* Подложка для устройств без hover — там жидкость не рисуется */}
      {!hasHover && (
        <span
          aria-hidden="true"
          className={`absolute inset-0 rounded-full ${
            primary ? 'bg-accent' : 'border border-glass-border bg-white/[0.06]'
          }`}
        />
      )}

      {hasHover && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute block overflow-visible"
          style={{
            left: -PAD,
            top: -PAD,
            // Размеры через CSS: не ждём, пока измерение долетит до стейта
            width: `calc(100% + ${PAD * 2}px)`,
            height: `calc(100% + ${PAD * 2}px)`,
          }}
        >
          <path
            ref={backRef}
            fill={primary ? 'rgba(255, 213, 79, 0.45)' : 'rgba(0, 229, 255, 0.18)'}
          />
          <path
            ref={frontRef}
            fill={primary ? '#FFD54F' : 'rgba(255, 255, 255, 0.07)'}
            stroke={primary ? 'none' : 'rgba(0, 229, 255, 0.45)'}
            strokeWidth={primary ? 0 : 1}
          />
        </svg>
      )}

      <span className="relative z-10 flex items-center gap-2.5">
        {children}
        {icon}
      </span>
    </a>
  );
}

/** Точки по контуру «стадиона» — прямоугольника со скруглением в половину высоты */
function buildLayer(w: number, h: number, viscosity: number, mouseForce: number, forceLimit: number): Layer {
  const r = h / 2;
  const straight = Math.max(w - h, 0); // длина прямых участков сверху и снизу
  const perimeter = straight * 2 + Math.PI * h;
  const points: Layer['points'] = [];

  for (let i = 0; i < POINTS; i++) {
    const t = (i / POINTS) * perimeter;
    let x: number;
    let y: number;

    if (t < straight) {
      // верхняя прямая, слева направо
      x = r + t;
      y = 0;
    } else if (t < straight + Math.PI * r) {
      // правое полукружие
      const a = (t - straight) / r - Math.PI / 2;
      x = w - r + Math.cos(a) * r;
      y = r + Math.sin(a) * r;
    } else if (t < straight * 2 + Math.PI * r) {
      // нижняя прямая, справа налево
      x = w - r - (t - straight - Math.PI * r);
      y = h;
    } else {
      // левое полукружие
      const a = (t - straight * 2 - Math.PI * r) / r + Math.PI / 2;
      x = r + Math.cos(a) * r;
      y = r + Math.sin(a) * r;
    }

    x += PAD;
    y += PAD;
    points.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
  }

  return { viscosity, mouseForce, forceLimit, points };
}

/** Замкнутый сглаженный путь по точкам (Catmull-Rom → кубические Безье) */
function pathFrom(pts: Layer['points']): string {
  const n = pts.length;
  if (!n) return '';
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;

  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return d + ' Z';
}
