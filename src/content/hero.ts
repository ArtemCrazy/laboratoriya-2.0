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
  // Площадка утверждена заказчиком 23.07.2026
  address: 'Раменский бульвар, 1, кластер «Ломоносов», зал «Архангельск»',
  locationNote: 'кластер «Ломоносов»',
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
    accent: 'cyan',
    role: 'Руководителям C&B',
    task: 'которые хотят повысить эффективность системы вознаграждения, обосновывать бюджет и усиливать влияние C&B на бизнес',
  },
  {
    num: '02',
    symbol: 'Sp',
    accent: 'yellow',
    role: 'Специалистам C&B',
    task: 'которые сопровождают программы мотивации и льгот, работают с аналитикой и автоматизируют процессы',
  },
  {
    num: '03',
    symbol: 'Hr',
    accent: 'violet',
    role: 'Директорам по персоналу',
    task: 'связать вознаграждение, благополучие и HR-стратегию с целями и возможностями бизнеса',
  },
  {
    num: '04',
    symbol: 'Wb',
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
 * Данные и фото — реальные спикеры первой конференции (cblabconference.ru).
 * Формула экспертизы, опыт и статус — пока условные, до уточнения.
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
    name: 'Светлана Кирилина',
    role: 'Руководитель C&B-проектов',
    company: 'Яндекс',
    photo: '/img/speakers/1.webp',
    theme: 'culture' as const,
    x: 8.2,
    y: 50,
    size: 192,
    symbol: 'СК',
    num: '01',
    topic: 'HR-дебаты: универсальная или сегментированная система вознаграждения',
    formula: ['Стратегия', 'Культура', 'Аналитика'] as const,
    formulaResult: 'Связанная HR-система',
    experience: '15 лет в HR и C&B',
    status: 'Формула проверена',
    label: 'above' as const,
  },
  {
    name: 'Дмитрий Любо',
    role: 'Руководитель по системам премирования',
    company: 'Эрион (МТС)',
    photo: '/img/speakers/2.webp',
    theme: 'analytics' as const,
    x: 20.5,
    y: 27,
    size: 204,
    symbol: 'ДЛ',
    num: '02',
    topic: 'HR-дебаты: универсальная или сегментированная система вознаграждения',
    formula: ['Аналитика', 'Стратегия', 'Вовлечённость'] as const,
    formulaResult: 'Устойчивое вознаграждение',
    experience: '12 лет в C&B и HR',
    status: 'Формула проверена',
    label: 'above' as const,
  },
  {
    name: 'Анна Гвоздева',
    role: 'Начальник отдела планирования численности и ФОТ',
    company: 'Альфа-Банк',
    photo: '/img/speakers/3.webp',
    theme: 'rewards' as const,
    x: 21.7,
    y: 75,
    size: 186,
    symbol: 'АГ',
    num: '03',
    topic: 'HR-импровизация: защита C&B-бюджета перед бизнесом',
    formula: ['Данные', 'Автоматизация', 'Бюджет'] as const,
    formulaResult: 'Управляемые расходы',
    experience: '9 лет в C&B',
    status: 'Формула проверена',
    label: 'below' as const,
  },
  {
    name: 'Юлия Чуфистова',
    role: 'Руководитель отдела мотивации персонала',
    company: 'Четыре лапы',
    photo: '/img/speakers/4.webp',
    theme: 'wellbeing' as const,
    x: 36.8,
    y: 50,
    size: 224,
    symbol: 'ЮЧ',
    num: '04',
    topic: 'Нематериальная мотивация: от разовых инициатив к системе',
    formula: ['Бенефиты', 'Опрос', 'Wellbeing'] as const,
    formulaResult: 'Востребованный пакет',
    experience: '11 лет в C&B',
    status: 'Формула проверена',
    label: 'below' as const,
  },
  {
    name: 'Екатерина Холодкова',
    role: 'Руководитель проектов благополучия сотрудников',
    company: 'Лемана Про',
    photo: '/img/speakers/5.webp',
    theme: 'motivation' as const,
    x: 50.8,
    y: 26,
    size: 196,
    symbol: 'ЕХ',
    num: '05',
    topic: 'Нематериальная мотивация: от разовых инициатив к системе',
    formula: ['Грейды', 'Мотивация', 'Прозрачность'] as const,
    formulaResult: 'Понятная система',
    experience: '14 лет в Rewards',
    status: 'Формула проверена',
    label: 'above' as const,
  },
  {
    name: 'Евгений Кизлевич',
    role: 'Руководитель направления по вознаграждению',
    company: 'Магнит',
    photo: '/img/speakers/6.webp',
    theme: 'wellbeing' as const,
    x: 51.9,
    y: 76,
    size: 182,
    symbol: 'ЕК',
    num: '06',
    topic: 'HR-дебаты: универсальная или сегментированная система вознаграждения',
    formula: ['Wellbeing', 'Метрики', 'Забота'] as const,
    formulaResult: 'Измеримый эффект',
    experience: '10 лет в HR',
    status: 'Формула проверена',
    label: 'below' as const,
  },
  {
    name: 'Вера Богатых',
    role: 'Директор департамента компенсаций и льгот',
    company: 'Черкизово',
    photo: '/img/speakers/7.webp',
    theme: 'rewards' as const,
    x: 66.5,
    y: 50,
    size: 218,
    symbol: 'ВБ',
    num: '07',
    topic: 'HR-дебаты: универсальная или сегментированная система вознаграждения',
    formula: ['Мотивация', 'LTI', 'Удержание'] as const,
    formulaResult: 'Удержание команды',
    experience: '13 лет в мотивации',
    status: 'Формула проверена',
    label: 'above' as const,
  },
  {
    name: 'Егор Павловский',
    role: 'Директор департамента аналитики и мотивации',
    company: 'Самокат',
    photo: '/img/speakers/8.webp',
    theme: 'analytics' as const,
    x: 80.5,
    y: 28,
    size: 194,
    symbol: 'ЕП',
    num: '08',
    topic: 'Как автоматизировать C&B без ошибок: выбор, внедрение, окупаемость',
    formula: ['Аналитика', 'Бенчмарк', 'Отчётность'] as const,
    formulaResult: 'Полная картина',
    experience: '8 лет в Total Rewards',
    status: 'Формула проверена',
    label: 'above' as const,
  },
  {
    name: 'Екатерина Франк',
    role: 'C&B методолог',
    company: 'Атом',
    photo: '/img/speakers/9.webp',
    theme: 'culture' as const,
    x: 81.6,
    y: 76,
    size: 186,
    symbol: 'ЕФ',
    num: '09',
    topic: 'Лаборатория кейсов: новая формула мотивации, когда бюджеты режут',
    formula: ['Культура', 'Коммуникации', 'Вовлечённость'] as const,
    formulaResult: 'Живая система',
    experience: '7 лет в C&B',
    status: 'Формула проверена',
    label: 'below' as const,
  },
  {
    name: 'Марина Назарова',
    role: 'Руководитель группы по компенсациям и льготам',
    company: 'START',
    photo: '/img/speakers/10.webp',
    theme: 'motivation' as const,
    x: 50,
    y: 50,
    size: 190,
    symbol: 'МН',
    num: '10',
    topic: 'Как автоматизировать C&B без ошибок: выбор, внедрение, окупаемость',
    formula: ['Данные', 'Автоматизация', 'Окупаемость'] as const,
    formulaResult: 'Управляемый процесс',
    experience: '10 лет в C&B',
    status: 'Формула проверена',
    label: 'above' as const,
  },
] as const;

/** C&B LAB — небольшой элемент, встроенный в связку, а не центр молекулы */
export const speakerCore = { x: 94.5, y: 50, size: 124 };

/**
 * Связи молекулы. -1 — ядро, остальные индексы из speakers.
 * Часть атомов соединена напрямую друг с другом, минуя ядро.
 */
export const speakerBonds: [number, number][] = [
  // Левое кольцо: Мария — Анна — Наталья — Алексей
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  // Центральное кольцо: Наталья — Сергей — Михаил — Екатерина
  [3, 4],
  [3, 5],
  [4, 6],
  [5, 6],
  // Правое кольцо: Михаил — Ольга — C&B LAB — Павел
  [6, 7],
  [6, 8],
  [7, -1],
  [8, -1],
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
