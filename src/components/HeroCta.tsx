'use client';

import { hero } from '@/content/hero';
import LiquidButton from '@/components/LiquidButton';
import { useLead } from '@/components/LeadProvider';

/**
 * Кнопки первого экрана. Вынесены отдельно, потому что открывают формы
 * заявок, а сама страница остаётся серверным компонентом.
 */
export default function HeroCta() {
  const openLead = useLead();

  return (
    <>
      <LiquidButton onClick={() => openLead('ticket')}>{hero.ctaPrimary}</LiquidButton>
      <LiquidButton onClick={() => openLead('program')} variant="ghost">
        {hero.ctaSecondary}
      </LiquidButton>
    </>
  );
}
