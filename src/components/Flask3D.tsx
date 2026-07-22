'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Трёхмерная стеклянная колба — концепция B.
 * Геометрия и схема света унаследованы от js/app3d.js первой конференции:
 * профиль колбы Флоренса через LatheGeometry, циановый и жёлтый point-light.
 *
 * Производительность (ПТЗ §3): three.js грузится динамически ПОСЛЕ первой
 * отрисовки, поэтому LCP остаётся на заголовке. На мобильных, при отсутствии
 * WebGL и при prefers-reduced-motion показывается статичный SVG-фолбэк.
 */
export default function Flask3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(true);

  useEffect(() => {
    let disposed = false;
    let started = false;
    let raf = 0;
    let cleanup: (() => void) | null = null;

    const canRender = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
      if (window.innerWidth < 1024) return false;
      // Проверяем поддержку WebGL до загрузки библиотеки
      try {
        const test = document.createElement('canvas');
        return !!(test.getContext('webgl2') || test.getContext('webgl'));
      } catch {
        return false;
      }
    };

    const start = async () => {
      const THREE = await import('three');
      const mount = mountRef.current;
      if (!mount || disposed) return;

      const width = mount.clientWidth;
      const height = mount.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 1, 15);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mount.appendChild(renderer.domElement);

      // --- Свет: схема первой конференции ---
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const lightBlue = new THREE.PointLight(0x00e5ff, 60, 40);
      lightBlue.position.set(5, 5, 5);
      scene.add(lightBlue);
      const lightYellow = new THREE.PointLight(0xffd54f, 30, 40);
      lightYellow.position.set(-5, -2, 2);
      scene.add(lightYellow);
      const lightBack = new THREE.PointLight(0x008dcc, 40, 40);
      lightBack.position.set(0, 0, -5);
      scene.add(lightBack);

      // --- Колба: профиль из первой версии ---
      const curvePoints = [
        new THREE.Vector2(0.001, -2.5),
        new THREE.Vector2(1.0, -2.42),
        new THREE.Vector2(1.8, -1.8),
        new THREE.Vector2(2.0, -0.8),
        new THREE.Vector2(1.6, 0.3),
        new THREE.Vector2(0.8, 1.2),
        new THREE.Vector2(0.6, 2.0),
        new THREE.Vector2(0.6, 3.4),
        new THREE.Vector2(0.8, 3.5),
        new THREE.Vector2(0.8, 3.7),
      ];
      const spline = new THREE.SplineCurve(curvePoints);
      const flaskGeometry = new THREE.LatheGeometry(spline.getPoints(80), 128);

      const glassParams = {
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.08,
        transmission: 0.95,
        ior: 1.45,
        thickness: 0.6,
        transparent: true,
      };

      const flaskGroup = new THREE.Group();
      flaskGroup.add(
        new THREE.Mesh(
          flaskGeometry,
          new THREE.MeshPhysicalMaterial({ ...glassParams, side: THREE.BackSide })
        )
      );
      const flaskFront = new THREE.Mesh(
        flaskGeometry,
        new THREE.MeshPhysicalMaterial({ ...glassParams, side: THREE.FrontSide })
      );
      flaskFront.renderOrder = 2;
      flaskGroup.add(flaskFront);
      scene.add(flaskGroup);

      // --- Понятия C&B пузырьками внутри колбы ---
      const makeLabel = (text: string) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#060B19';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `900 ${text.length > 6 ? 68 : 96}px Inter, sans-serif`;
        ctx.fillText(text, 256, 132);
        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const sprite = new THREE.Sprite(
          new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false })
        );
        sprite.scale.set(0.72, 0.36, 1);
        return sprite;
      };

      const terms = ['KPI', 'бонус', 'льготы', 'данные', 'ДМС', 'грейды', 'eNPS'];
      const orbGeo = new THREE.SphereGeometry(0.42, 48, 48);
      const orbMat = new THREE.MeshStandardMaterial({
        color: 0xffd54f,
        emissive: 0xffd54f,
        emissiveIntensity: 0.55,
        roughness: 0.1,
        metalness: 0.5,
      });

      const orbs = terms.map((term, i) => {
        const orb = new THREE.Mesh(orbGeo, orbMat);
        orb.position.set(
          (Math.sin(i * 2.4) * 1.1),
          -2.0 + (i / terms.length) * 3.2,
          (Math.cos(i * 1.7) * 1.1)
        );
        orb.add(makeLabel(term));
        orb.renderOrder = 1;
        // Скорость всплытия слегка различается — движение не выглядит машинным
        return { mesh: orb, speed: 0.006 + (i % 3) * 0.0022, phase: i * 1.3 };
      });
      orbs.forEach((o) => flaskGroup.add(o.mesh));

      // --- Светящаяся «жидкость» на дне ---
      const liquid = new THREE.Mesh(
        new THREE.SphereGeometry(1.55, 48, 48),
        new THREE.MeshStandardMaterial({
          color: 0x00e5ff,
          emissive: 0x00e5ff,
          emissiveIntensity: 0.35,
          transparent: true,
          opacity: 0.35,
          roughness: 0.2,
        })
      );
      liquid.position.y = -1.4;
      liquid.scale.y = 0.55;
      flaskGroup.add(liquid);

      const onResize = () => {
        if (!mountRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      let t = 0;
      const animate = () => {
        raf = requestAnimationFrame(animate);
        t += 0.01;
        flaskGroup.rotation.y += 0.0035;
        // Лёгкое покачивание, чтобы композиция не была статичной
        flaskGroup.position.y = Math.sin(t) * 0.12;

        for (const o of orbs) {
          o.mesh.position.y += o.speed;
          o.mesh.position.x += Math.sin(t + o.phase) * 0.0035;
          // Долетел до горлышка — возвращаем вниз, цикл замкнут
          if (o.mesh.position.y > 3.0) o.mesh.position.y = -2.0;
        }
        renderer.render(scene, camera);
      };
      animate();

      setUseFallback(false);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        flaskGeometry.dispose();
        orbGeo.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    };

    const tryStart = () => {
      if (started || disposed || !canRender()) return;
      started = true;
      void start();
    };

    tryStart();

    // Окно могло быть узким на момент загрузки — тогда пробуем ещё раз,
    // когда пользователь его расширит, иначе колба навсегда осталась бы постером.
    window.addEventListener('resize', tryStart);

    return () => {
      disposed = true;
      window.removeEventListener('resize', tryStart);
      cleanup?.();
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />
      {useFallback && <FlaskFallback />}
    </div>
  );
}

/** Статичный постер колбы: мобильные, отключённая анимация, отсутствие WebGL */
function FlaskFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <svg viewBox="0 0 200 260" className="h-full max-h-[420px] w-auto">
        <defs>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
            <stop offset="100%" stopColor="rgba(0,229,255,0.06)" />
          </linearGradient>
          <radialGradient id="liquid" cx="50%" cy="70%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.15" />
          </radialGradient>
        </defs>
        <path
          d="M88 20 L88 96 C88 104 84 110 78 116 L36 178 C24 196 32 224 56 232 C76 238 124 238 144 232 C168 224 176 196 164 178 L122 116 C116 110 112 104 112 96 L112 20 Z"
          fill="url(#glass)"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="2"
        />
        <path
          d="M52 186 C40 202 44 222 60 228 C78 234 122 234 140 228 C156 222 160 202 148 186 Z"
          fill="url(#liquid)"
        />
        <rect x="84" y="14" width="32" height="8" rx="4" fill="rgba(255,255,255,0.4)" />
        <circle cx="88" cy="200" r="5" fill="#FFD54F" opacity="0.85" />
        <circle cx="118" cy="212" r="4" fill="#FFD54F" opacity="0.7" />
        <circle cx="103" cy="176" r="3" fill="#00E5FF" opacity="0.8" />
      </svg>
    </div>
  );
}
