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
  location: 'Москва',
  // ⚠️ ПЛЕЙСХОЛДЕР: площадка ещё не выбрана, адрес поставлен для примера.
  // Заменить, когда заказчик определится (ТЗ 4.2, «адрес уточним»).
  address: 'Пресненская наб., 12',
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

/**
 * Блок «Для кого конференция» (ТЗ 4.3), поданный как таблица Менделеева.
 * Формулировки — дословно из ТЗ.
 *
 * ⚠️ В ТЗ перечислено шесть ролей, но задачи расписаны только для четырёх.
 * «Руководители C&B-проектов» и «HR бизнес-партнёры» пока не добавлены —
 * нужны формулировки от заказчика. ТЗ допускает 4–5 карточек.
 */
export const audience = [
  {
    num: '01',
    symbol: 'Cb',
    group: 'Управление',
    accent: 'cyan',
    role: 'Руководителям C&B',
    task: 'которые хотят повысить эффективность системы вознаграждения, обосновывать бюджет и усиливать влияние C&B на бизнес',
  },
  {
    num: '02',
    symbol: 'Sp',
    group: 'Практика',
    accent: 'yellow',
    role: 'Специалистам C&B',
    task: 'которые сопровождают программы мотивации и льгот, работают с аналитикой и автоматизируют процессы',
  },
  {
    num: '03',
    symbol: 'Hr',
    group: 'Стратегия',
    accent: 'violet',
    role: 'Директорам по персоналу',
    task: 'связать вознаграждение, благополучие и HR-стратегию с целями и возможностями бизнеса',
  },
  {
    num: '04',
    symbol: 'Wb',
    group: 'Благополучие',
    accent: 'green',
    role: 'Директорам по социальной политике',
    task: 'которые развивают программы корпоративного благополучия и ищут способы повысить их ценность без роста затрат',
  },
] as const;

export const audienceTitle =
  'Будет полезно всем, кто отвечает за мотивацию, вознаграждение и благополучие сотрудников';

/**
 * Блок «Спикеры» (ТЗ 4.4).
 *
 * ⚠️ ВСЕ ДАННЫЕ — ПЛЕЙСХОЛДЕРЫ из макета владельца: состав спикеров,
 * компании и темы заказчиком не переданы. Фотографий тоже нет, поэтому
 * узлы пока показывают инициалы.
 *
 * angle — положение на молекуле в градусах (0 — справа, против часовой),
 * side — с какой стороны от узла стоит подпись.
 */
/** Цвет атома задаётся темой выступления */
export const speakerThemes = {
  analytics: '#00E5FF', // аналитика
  motivation: '#A78BFA', // мотивация
  wellbeing: '#A3E635', // wellbeing
  rewards: '#FFD54F', // вознаграждение
  culture: '#F472B6', // корпоративная культура
} as const;

/**
 * Раскладка молекулы задана вручную: x/y — доля ширины и высоты сцены,
 * size — диаметр атома. Композиция асимметричная и вытянутая, атомы
 * разного размера и на разных уровнях, ядро смещено влево от центра.
 */
export const speakers = [
  {
    name: 'Мария Орлова',
    role: 'HRD',
    company: 'АльфаСтрахование',
    photo: '/img/speakers/1.webp',
    theme: 'culture' as const,
    x: 7.5,
    y: 60,
    size: 118,
    label: 'below' as const,
  },
  {
    name: 'Анна Иванова',
    role: 'C&B Director',
    company: 'НоваТек',
    photo: '/img/speakers/2.webp',
    theme: 'analytics' as const,
    x: 20,
    y: 25,
    size: 138,
    label: 'above' as const,
  },
  {
    name: 'Алексей Смирнов',
    role: 'C&B Lead',
    company: 'OZON',
    photo: '/img/speakers/3.webp',
    theme: 'rewards' as const,
    x: 33,
    y: 76,
    size: 112,
    label: 'below' as const,
  },
  {
    name: 'Екатерина Волкова',
    role: 'Wellbeing Director',
    company: 'СберМаркет',
    photo: '/img/speakers/4.webp',
    theme: 'wellbeing' as const,
    x: 58,
    y: 74,
    size: 128,
    label: 'below' as const,
  },
  {
    name: 'Сергей Петров',
    role: 'Head of Rewards',
    company: 'Газпром нефть',
    photo: '/img/speakers/5.webp',
    theme: 'motivation' as const,
    x: 68,
    y: 24,
    size: 142,
    label: 'above' as const,
  },
  {
    name: 'Михаил Кузнецов',
    role: 'Директор по мотивации',
    company: 'Яндекс',
    photo: '/img/speakers/6.webp',
    theme: 'rewards' as const,
    x: 82,
    y: 62,
    size: 120,
    label: 'below' as const,
  },
  {
    name: 'Наталья Киреева',
    role: 'Руководитель C&B',
    company: 'ВкусВилл',
    photo: '/img/speakers/7.webp',
    theme: 'wellbeing' as const,
    // Намеренно вплотную к соседу: атомы частично перекрываются,
    // от этого силуэт перестаёт читаться как ровная схема
    x: 74,
    y: 16,
    size: 106,
    label: 'right' as const,
  },
] as const;

/** Ядро молекулы — намеренно не в центре сцены */
export const speakerCore = { x: 44, y: 46, size: 168 };

/**
 * Связи молекулы. -1 — ядро, остальные индексы из speakers.
 * Часть атомов соединена напрямую друг с другом, минуя ядро.
 */
export const speakerBonds: [number, number][] = [
  [-1, 1],
  [-1, 2],
  [-1, 3],
  [-1, 4],
  [0, 1],
  [0, 2],
  [3, 5],
  [4, 5],
  [4, 6],
  [5, 6],
];

/** «Элементы» C&B — концепция B, метафора периодической таблицы */
export const elements = [
  { symbol: 'Mo', name: 'Мотивация', num: '01' },
  { symbol: 'Bn', name: 'Бенефиты', num: '02' },
  { symbol: 'Wb', name: 'Wellbeing', num: '03' },
  { symbol: 'Rw', name: 'Вознаграждение', num: '04' },
  { symbol: 'Kp', name: 'KPI', num: '05' },
  { symbol: 'Ln', name: 'Обучение', num: '06' },
] as const;
