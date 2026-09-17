import Script from 'next/script';

/**
 * Яндекс.Метрика заказчика — тот же счётчик и те же настройки, что стояли
 * на странице первой конференции.
 *
 * При переезде на боевой домен 04.08.2026 страница заменилась новой, а
 * счётчик на неё не перенесли: Метрика и Вебвизор видели только архив
 * /vers1. Подключаем только на публичной странице — работа в панели
 * управления в Вебвизор попадать не должна.
 */
export const METRIKA_ID = 108320613;

export default function YandexMetrika() {
  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}', 'ym');

          ym(${METRIKA_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
        `}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${METRIKA_ID}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}

/**
 * Цель в Метрике при отправке заявки. Сработает, только когда маркетолог
 * заведёт JavaScript-цель с таким идентификатором; до этого вызов безвреден.
 */
export function reachGoal(goal: string) {
  if (typeof window === 'undefined') return;
  const ym = (window as unknown as { ym?: (...args: unknown[]) => void }).ym;
  if (typeof ym === 'function') ym(METRIKA_ID, 'reachGoal', goal);
}
