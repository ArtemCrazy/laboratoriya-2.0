/**
 * Единый контентный слой для всех трёх концепций первого экрана.
 * Правка здесь применяется сразу ко всем вариантам — заказчик
 * сравнивает визуал, а не разные формулировки (ПТЗ §3).
 */

export const hero = {
  titleMain: 'C&B-лаборатория:',
  titleAccent: 'химия цифр и людей',
  version: '2.0',
  subtitle:
    'Двухдневная практическая конференция для HR: исследуем новые модели вознаграждения, разбираем реальные кейсы и собираем решения для мотивации сотрудников.',
  days: '2 дня',
  dates: '21–22 октября 2026',
  // Площадка на согласовании — адрес подставим, когда заказчик определится
  location: 'Москва',
  locationNote: 'площадка уточняется',
  ctaPrimary: 'Купить билет',
  ctaSecondary: 'Получить программу',
} as const;

export const nav = [
  { label: 'О конференции', href: '#about' },
  { label: 'Программа', href: '#program' },
  { label: 'Спикеры', href: '#speakers' },
  { label: 'Как это было', href: '#recap' },
  { label: 'Стоимость', href: '#price' },
  { label: 'Партнёры', href: '#partners' },
  { label: 'Место', href: '#venue' },
  { label: 'Контакты', href: '#contacts' },
] as const;

/** Понятия C&B — используются в концепциях A и B */
export const terms = [
  { icon: '💰', label: 'Budget' },
  { icon: '🌿', label: 'Wellbeing' },
  { icon: '🎯', label: 'KPI' },
  { icon: '📊', label: 'eNPS' },
  { icon: '👥', label: 'Total Rewards' },
] as const;

/**
 * Полоса фактов первой конференции — концепция C.
 * ⚠️ ЦИФРЫ-ПЛЕЙСХОЛДЕРЫ. Заменить на фактические данные от заказчика (ПТЗ §7).
 */
export const facts = [
  { value: '150+', label: 'участников' },
  { value: '20', label: 'спикеров' },
  { value: '80+', label: 'компаний' },
  { value: '9.2', label: 'средняя оценка' },
] as const;

/** «Элементы» C&B — концепция C, метафора периодической таблицы */
export const elements = [
  { symbol: 'Mo', name: 'Мотивация', num: '01' },
  { symbol: 'Bn', name: 'Бенефиты', num: '02' },
  { symbol: 'Wb', name: 'Wellbeing', num: '03' },
  { symbol: 'Rw', name: 'Вознаграждение', num: '04' },
  { symbol: 'Kp', name: 'KPI', num: '05' },
  { symbol: 'Ln', name: 'Обучение', num: '06' },
] as const;
