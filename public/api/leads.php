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

const LEADS_FILE = DATA_DIR . '/leads.json';
const SETTINGS_FILE = DATA_DIR . '/settings.json';

/** Человеческие названия сценариев — они же уходят в письмо */
const LEAD_TYPES = [
    'ticket' => 'Покупка билета',
    'quote' => 'Запрос расчёта для команды',
    'program' => 'Запрос программы',
    'partner' => 'Заявка на партнёрство',
];

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
    return is_array($data) ? $data : [];
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

function settings(): array
{
    $defaults = ['notifyEmail' => 'info@cblabconference.ru', 'notify' => true];
    if (!is_file(SETTINGS_FILE)) {
        return $defaults;
    }
    $data = json_decode((string) file_get_contents(SETTINGS_FILE), true);
    return is_array($data) ? array_merge($defaults, $data) : $defaults;
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

    // Письмо — вторым каналом. Если почта не ушла, заявка всё равно сохранена
    $cfg = settings();
    if (!empty($cfg['notify']) && !empty($cfg['notifyEmail'])) {
        $lines = ["Новая заявка с сайта: {$lead['typeLabel']}", ''];
        foreach ($clean as $key => $value) {
            $lines[] = LEAD_FIELDS[$key] . ': ' . $value;
        }
        $lines[] = '';
        $lines[] = 'Дата: ' . date('d.m.Y H:i');
        $lines[] = 'Заявка также сохранена в панели управления сайта.';

        $subject = '=?UTF-8?B?' . base64_encode('Заявка с сайта: ' . $lead['typeLabel']) . '?=';
        $headers = "MIME-Version: 1.0\r\n"
            . "Content-Type: text/plain; charset=UTF-8\r\n"
            . 'From: site@' . preg_replace('/^www\./', '', (string) ($_SERVER['HTTP_HOST'] ?? 'localhost')) . "\r\n";
        if (!empty($clean['email'])) {
            $headers .= 'Reply-To: ' . $clean['email'] . "\r\n";
        }

        @mail((string) $cfg['notifyEmail'], $subject, implode("\n", $lines), $headers);
    }

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

    respond(['ok' => true, 'leads' => $leads, 'settings' => settings()]);
}

if ($method === 'PATCH') {
    $body = read_json_body();

    // Настройки уведомлений меняются здесь же
    if (isset($body['settings']) && is_array($body['settings'])) {
        $next = [
            'notifyEmail' => trim((string) ($body['settings']['notifyEmail'] ?? '')),
            'notify' => !empty($body['settings']['notify']),
        ];
        if ($next['notifyEmail'] !== '' && !filter_var($next['notifyEmail'], FILTER_VALIDATE_EMAIL)) {
            fail('Проверьте адрес для уведомлений');
        }
        if (!is_dir(DATA_DIR)) {
            mkdir(DATA_DIR, 0775, true);
        }
        protect_dir(DATA_DIR);
        file_put_contents(
            SETTINGS_FILE,
            json_encode($next, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT),
            LOCK_EX
        );
        respond(['ok' => true, 'settings' => $next]);
    }

    $id = (string) ($body['id'] ?? '');
    $status = (string) ($body['status'] ?? '');
    if ($id === '' || !in_array($status, ['new', 'done'], true)) {
        fail('Нужен id заявки и статус');
    }

    $leads = read_leads();
    $found = false;
    foreach ($leads as &$l) {
        if (($l['id'] ?? '') === $id) {
            $l['status'] = $status;
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
