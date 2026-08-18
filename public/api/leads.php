<?php
/**
 * Заявки с сайта.
 *
 * POST — принять заявку (открыт всем), GET — список для админки (только
 * после входа), PATCH — отметить обработанной, DELETE — удалить.
 *
 * Заявка сохраняется на сервере и дублируется письмом: заказчик рассказал,
 * что письма иногда уходят в спам, поэтому список в админке — основной
 * канал, а почта — уведомление.
 */

declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';
require __DIR__ . '/_mailer.php';

const LEADS_FILE = DATA_DIR . '/leads.json';
const SETTINGS_FILE = DATA_DIR . '/settings.json';
/** Результат последней отправки по каналам — показываем в админке */
const CHANNELS_FILE = DATA_DIR . '/channels.json';

/** Человеческие названия сценариев — они же уходят в письмо */
const LEAD_TYPES = [
    'ticket' => 'Покупка билета',
    'quote' => 'Запрос расчёта для команды',
    'program' => 'Запрос программы',
    'partner' => 'Заявка на партнёрство',
];

/**
 * Стадии работы с заявкой. Раньше их было две — новая и обработанная,
 * поэтому старое значение done приводим к «won» при чтении.
 */
const LEAD_STATUSES = ['new', 'work', 'won', 'lost'];

/** Поля, которые вообще принимаем. Всё остальное отбрасываем */
const LEAD_FIELDS = [
    'name' => 'Имя и фамилия',
    'company' => 'Компания',
    'role' => 'Должность',
    'email' => 'Email',
    'phone' => 'Телефон',
    'promo' => 'Промокод',
    'tariff' => 'Пакет участия',
    'people' => 'Количество участников',
    'format' => 'Интересующий формат',
    'comment' => 'Комментарий',
];

function read_leads(): array
{
    if (!is_file(LEADS_FILE)) {
        return [];
    }
    $raw = file_get_contents(LEADS_FILE);
    $data = $raw === false ? null : json_decode($raw, true);
    if (!is_array($data)) {
        return [];
    }

    // Заявки, сохранённые до появления стадий
    foreach ($data as &$lead) {
        $status = (string) ($lead['status'] ?? 'new');
        if ($status === 'done') {
            $status = 'won';
        }
        $lead['status'] = in_array($status, LEAD_STATUSES, true) ? $status : 'new';
        $lead['note'] = (string) ($lead['note'] ?? '');
    }
    unset($lead);

    return $data;
}

function write_leads(array $leads): void
{
    if (!is_dir(DATA_DIR) && !mkdir(DATA_DIR, 0775, true) && !is_dir(DATA_DIR)) {
        fail('Не удалось создать папку данных', 500);
    }
    protect_dir(DATA_DIR);

    $json = json_encode($leads, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    $tmp = LEADS_FILE . '.tmp';
    if ($json === false || file_put_contents($tmp, $json, LOCK_EX) === false || !rename($tmp, LEADS_FILE)) {
        @unlink($tmp);
        fail('Не удалось сохранить заявку', 500);
    }
}

/**
 * Настройки уведомлений.
 *
 * smtp* — отправка через ящик домена. Без неё письмо уходит с сервера
 * хостинга и почти гарантированно попадает в спам: домен обслуживается
 * Яндексом, и письмо «от себя» с чужого сервера фильтр не пропускает.
 * sheetUrl — веб-приложение Apps Script, дубль заявки в Google-таблицу.
 */
function settings(): array
{
    $defaults = [
        'notifyEmail' => 'info@cblabconference.ru',
        'notify' => true,
        'smtpEnabled' => false,
        'smtpHost' => 'smtp.yandex.ru',
        'smtpPort' => 465,
        'smtpUser' => '',
        'smtpPassword' => '',
        'smtpFrom' => '',
        'sheetEnabled' => false,
        'sheetUrl' => '',
    ];
    if (!is_file(SETTINGS_FILE)) {
        return $defaults;
    }
    $data = json_decode((string) file_get_contents(SETTINGS_FILE), true);
    return is_array($data) ? array_merge($defaults, $data) : $defaults;
}

/** Наружу пароль не отдаём — только признак, что он задан */
function settings_public(array $cfg): array
{
    $out = $cfg;
    $out['smtpPasswordSet'] = trim((string) $cfg['smtpPassword']) !== '';
    unset($out['smtpPassword']);
    return $out;
}

function write_settings(array $cfg): void
{
    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0775, true);
    }
    protect_dir(DATA_DIR);
    file_put_contents(
        SETTINGS_FILE,
        json_encode($cfg, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT),
        LOCK_EX
    );
}

function channels_status(): array
{
    if (!is_file(CHANNELS_FILE)) {
        return [];
    }
    $data = json_decode((string) file_get_contents(CHANNELS_FILE), true);
    return is_array($data) ? $data : [];
}

function write_channels(array $status): void
{
    if (!is_dir(DATA_DIR)) {
        return;
    }
    file_put_contents(
        CHANNELS_FILE,
        json_encode($status, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT),
        LOCK_EX
    );
}

/** Текст письма и строка для таблицы собираются из одних и тех же данных */
function lead_lines(array $lead): array
{
    $lines = ["Новая заявка с сайта: {$lead['typeLabel']}", ''];
    foreach ($lead['fields'] as $key => $value) {
        $lines[] = LEAD_FIELDS[$key] . ': ' . $value;
    }
    $lines[] = '';
    $lines[] = 'Дата: ' . date('d.m.Y H:i', strtotime((string) $lead['createdAt']));
    $lines[] = 'Заявка также сохранена в панели управления сайта.';
    return $lines;
}

/**
 * Рассылка заявки по каналам: письмо и Google-таблица.
 * Заявка к этому моменту уже сохранена, поэтому любая ошибка здесь
 * ничего не теряет — только пишется в статус для админки.
 */
function deliver_lead(array $cfg, array $lead): array
{
    $result = ['at' => date('c')];

    if (!empty($cfg['notify']) && !empty($cfg['notifyEmail'])) {
        $mail = notify_mail(
            $cfg,
            (string) $cfg['notifyEmail'],
            'Заявка с сайта: ' . $lead['typeLabel'],
            implode("\n", lead_lines($lead)),
            (string) ($lead['fields']['email'] ?? '')
        );
        $result['mail'] = $mail;
    }

    if (!empty($cfg['sheetEnabled']) && !empty($cfg['sheetUrl'])) {
        $row = [
            'id' => $lead['id'],
            'createdAt' => $lead['createdAt'],
            'type' => $lead['typeLabel'],
        ];
        foreach (LEAD_FIELDS as $key => $label) {
            $row[$key] = (string) ($lead['fields'][$key] ?? '');
        }
        $result['sheet'] = push_to_sheet((string) $cfg['sheetUrl'], $row);
    }

    write_channels($result);
    return $result;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// ---------- Приём заявки ----------
if ($method === 'POST') {
    $body = read_json_body();

    // Ловушка для ботов: поле скрыто, человек его не заполнит
    if (!empty($body['website'])) {
        respond(['ok' => true]);
    }

    $type = (string) ($body['type'] ?? '');
    if (!isset(LEAD_TYPES[$type])) {
        fail('Неизвестный тип заявки');
    }

    $fields = is_array($body['fields'] ?? null) ? $body['fields'] : [];

    $clean = [];
    foreach (LEAD_FIELDS as $key => $_) {
        $value = trim((string) ($fields[$key] ?? ''));
        if ($value !== '') {
            // Обрезаем длину: в форме таких значений быть не может
            $clean[$key] = mb_substr($value, 0, 500);
        }
    }

    if (($clean['name'] ?? '') === '' || ($clean['email'] ?? '') === '') {
        fail('Заполните имя и email');
    }
    if (!filter_var($clean['email'], FILTER_VALIDATE_EMAIL)) {
        fail('Проверьте адрес электронной почты');
    }

    $leads = read_leads();

    // Простая защита от потока заявок с одного адреса
    $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
    $recent = 0;
    foreach ($leads as $l) {
        if (($l['ip'] ?? '') === $ip && strtotime((string) ($l['createdAt'] ?? '')) > time() - 600) {
            $recent++;
        }
    }
    if ($recent >= 5) {
        fail('Слишком много заявок подряд. Попробуйте позже или напишите нам на почту.', 429);
    }

    $lead = [
        'id' => bin2hex(random_bytes(6)),
        'type' => $type,
        'typeLabel' => LEAD_TYPES[$type],
        'createdAt' => date('c'),
        'status' => 'new',
        'fields' => $clean,
        'ip' => $ip,
    ];

    array_unshift($leads, $lead);
    // Больше 500 заявок не храним: файл не должен расти бесконечно
    $leads = array_slice($leads, 0, 500);
    write_leads($leads);

    // Письмо и таблица — вторым и третьим каналом. Заявка уже сохранена,
    // поэтому сбой доставки её не теряет
    deliver_lead(settings(), $lead);

    respond(['ok' => true]);
}

// ---------- Дальше только для админки ----------
require_auth();

if ($method === 'GET') {
    $leads = read_leads();
    // IP наружу не отдаём: он нужен только для лимита на приёме
    foreach ($leads as &$l) {
        unset($l['ip']);
    }
    unset($l);

    respond([
        'ok' => true,
        'leads' => $leads,
        'settings' => settings_public(settings()),
        'channels' => channels_status(),
    ]);
}

if ($method === 'PATCH') {
    $body = read_json_body();

    // Проверка каналов: отправляем себе тестовую заявку
    if (($body['action'] ?? '') === 'test') {
        $cfg = settings();
        $probe = [
            'id' => 'test',
            'typeLabel' => 'Проверка связи',
            'createdAt' => date('c'),
            'fields' => [
                'name' => 'Проверка с сайта',
                'company' => 'C&B-лаборатория',
                'email' => (string) $cfg['notifyEmail'],
                'comment' => 'Тестовая заявка из панели управления. Реагировать не нужно.',
            ],
        ];
        respond(['ok' => true, 'result' => deliver_lead($cfg, $probe)]);
    }

    // Настройки уведомлений меняются здесь же
    if (isset($body['settings']) && is_array($body['settings'])) {
        $in = $body['settings'];
        $cfg = settings();

        $next = array_merge($cfg, [
            'notifyEmail' => trim((string) ($in['notifyEmail'] ?? $cfg['notifyEmail'])),
            'notify' => !empty($in['notify']),
            'smtpEnabled' => !empty($in['smtpEnabled']),
            'smtpHost' => trim((string) ($in['smtpHost'] ?? $cfg['smtpHost'])),
            'smtpPort' => (int) ($in['smtpPort'] ?? $cfg['smtpPort']),
            'smtpUser' => trim((string) ($in['smtpUser'] ?? $cfg['smtpUser'])),
            'smtpFrom' => trim((string) ($in['smtpFrom'] ?? $cfg['smtpFrom'])),
            'sheetEnabled' => !empty($in['sheetEnabled']),
            'sheetUrl' => trim((string) ($in['sheetUrl'] ?? $cfg['sheetUrl'])),
        ]);

        // Пустой пароль означает «оставить прежний»: наружу мы его не отдаём,
        // и форма присылает его только когда пароль меняют
        $pass = (string) ($in['smtpPassword'] ?? '');
        if ($pass !== '') {
            $next['smtpPassword'] = $pass;
        }

        if ($next['notifyEmail'] !== '' && !filter_var($next['notifyEmail'], FILTER_VALIDATE_EMAIL)) {
            fail('Проверьте адрес для уведомлений');
        }
        if ($next['smtpUser'] !== '' && !filter_var($next['smtpUser'], FILTER_VALIDATE_EMAIL)) {
            fail('Логин SMTP — это адрес почтового ящика');
        }
        if ($next['sheetUrl'] !== '' && !filter_var($next['sheetUrl'], FILTER_VALIDATE_URL)) {
            fail('Проверьте ссылку на таблицу');
        }

        write_settings($next);
        respond(['ok' => true, 'settings' => settings_public($next)]);
    }

    $id = (string) ($body['id'] ?? '');
    $status = (string) ($body['status'] ?? '');
    $hasNote = array_key_exists('note', $body);

    if ($id === '' || ($status === '' && !$hasNote)) {
        fail('Нужен id заявки и что менять');
    }
    if ($status !== '' && !in_array($status, LEAD_STATUSES, true)) {
        fail('Неизвестная стадия заявки');
    }

    $leads = read_leads();
    $found = false;
    foreach ($leads as &$l) {
        if (($l['id'] ?? '') === $id) {
            if ($status !== '') {
                $l['status'] = $status;
            }
            if ($hasNote) {
                $l['note'] = mb_substr(trim((string) $body['note']), 0, 2000);
            }
            $l['updatedAt'] = date('c');
            $found = true;
            break;
        }
    }
    unset($l);

    if (!$found) {
        fail('Заявка не найдена', 404);
    }
    write_leads($leads);
    respond(['ok' => true]);
}

if ($method === 'DELETE') {
    $body = read_json_body();
    $id = (string) ($body['id'] ?? '');
    if ($id === '') {
        fail('Нужен id заявки');
    }

    $leads = read_leads();
    $rest = array_values(array_filter($leads, static fn($l) => ($l['id'] ?? '') !== $id));
    if (count($rest) === count($leads)) {
        fail('Заявка не найдена', 404);
    }
    write_leads($rest);
    respond(['ok' => true]);
}

fail('Метод не поддерживается', 405);
