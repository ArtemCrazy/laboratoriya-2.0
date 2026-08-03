'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import LeadModal, { type LeadType } from '@/components/LeadModal';

/**
 * Формы заявок открываются из разных мест: шапка, первый экран, тарифы,
 * финальный блок, партнёры. Держим одно окно на всю страницу и открываем
 * его через контекст, чтобы каждая кнопка не тащила своё состояние.
 */

type OpenLead = (type: LeadType, tariff?: string) => void;

const LeadContext = createContext<OpenLead>(() => {});

export const useLead = () => useContext(LeadContext);

export default function LeadProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ type: LeadType | null; tariff?: string }>({ type: null });

  const open = useCallback<OpenLead>((type, tariff) => setState({ type, tariff }), []);
  const close = useCallback(() => setState({ type: null }), []);

  // Значение стабильное, иначе перерисовывалась бы вся страница
  const value = useMemo(() => open, [open]);

  return (
    <LeadContext.Provider value={value}>
      {children}
      <LeadModal type={state.type} tariff={state.tariff} onClose={close} />
    </LeadContext.Provider>
  );
}
