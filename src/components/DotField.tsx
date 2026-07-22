'use client';

import { useEffect, useRef } from 'react';

/**
 * «Тёмный фон в мелкую точку» из ТЗ 4.2.
 * Порт js/particles.js первой конференции: сетка циановых точек с шагом 40px,
 * которые расталкиваются от курсора и на пружине возвращаются на место.
 *
 * Параметры физики сохранены как в оригинале: радиус влияния 180,
 * жёсткость пружины 0.04, трение 0.82.
 */
export default function DotField({ opacity = 0.4 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Уважаем системную настройку «меньше движения» — рисуем статичную сетку
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    type Particle = { ox: number; oy: number; x: number; y: number; vx: number; vy: number };
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    const spacing = 40;

    const init = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      particles = [];
      const cols = Math.floor(width / spacing) + 2;
      const rows = Math.floor(height / spacing) + 2;
      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          particles.push({ ox: x, oy: y, x, y, vx: 0, vy: 0 });
        }
      }
    };

    init();

    // ResizeObserver, а не window.resize: при первом рендере элемент ещё может
    // не иметь ширины, и разовый init() оставил бы canvas нулевого размера.
    const ro = new ResizeObserver(() => init());
    ro.observe(canvas);

    let mouseX = -1000;
    let mouseY = -1000;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    if (!reduced) {
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseleave', onLeave);
    }

    let raf = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `rgba(0, 229, 255, ${opacity})`;
      for (const p of particles) {
        if (!reduced) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 180;
          if (dist < maxDist && dist > 0) {
            const force = (maxDist - dist) / maxDist;
            p.vx -= (dx / dist) * force * 2.0;
            p.vy -= (dy / dist) * force * 2.0;
          }
          // Пружина возврата в исходную точку
          p.vx += (p.ox - p.x) * 0.04;
          p.vy += (p.oy - p.y) * 0.04;
          p.vx *= 0.82;
          p.vy *= 0.82;
          p.x += p.vx;
          p.y += p.vy;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
