<?php
/**
 * Контент сайта: GET — отдать, POST — сохранить (только для админа).
 *
 * GET открыт всем: этот же файл читает лендинг, чтобы показать спикеров
 * и программу, отредактированных в админке. Отдаём только контент — ничего
 * служебного тут не лежит.
 */

declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Список резервных копий — только для админки
if ($method === 'GET' && isset($_GET['backups'])) {
    require_auth();
    respond(['ok' => true, 'backups' => list_backups()]);
}

// Восстановление из копии. Текущее состояние тоже уходит в копию,
// поэтому откат можно отменить
if ($method === 'POST' && isset($_GET['restore'])) {
    require_auth();

    $body = read_json_body();
    $name = (string) ($body['name'] ?? '');
    // Имя приходит от клиента: пускаем только наш формат, без путей
    if (!preg_match('/^content-\d{8}-\d{6}\.json$/', $name)) {
        fail('Некорректное имя копии');
    }

    $path = BACKUP_DIR . '/' . $name;
    if (!is_file($path)) {
        fail('Копия не найдена', 404);
    }

    $data = json_decode((string) file_get_contents($path), true);
    if (!is_array($data)) {
        fail('Копия повреждена', 500);
    }

    write_content($data);
    respond(['ok' => true, 'restored' => $name]);
}

if ($method === 'GET') {
    $data = read_content();
    header('Content-Type: application/json; charset=utf-8');
    // Лендинг не должен показывать вчерашний кэш после правки в админке
    header('Cache-Control: no-cache, must-revalidate');
    echo json_encode(
        ['ok' => true, 'content' => (object) $data],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    exit;
}

if ($method !== 'POST') {
    fail('Метод не поддерживается', 405);
}

require_auth();

$body = read_json_body();
$content = $body['content'] ?? null;
if (!is_array($content)) {
    fail('Нет данных для сохранения');
}

// Сохраняем только известные разделы: лишние ключи в файл не пускаем.
// notes — сноски к блокам, которые заказчик показывает и убирает сам.
$allowed = [
    'hero',
    'speakers',
    'program',
    'pricing',
    'reviews',
    'participants',
    'partners',
    'footer',
    'notes',
];
$clean = [];
foreach ($allowed as $key) {
    if (array_key_exists($key, $content)) {
        $clean[$key] = $content[$key];
    }
}
if (!$clean) {
    fail('Нет ни одного известного раздела');
}

$clean['updatedAt'] = date('c');

write_content($clean);

respond(['ok' => true, 'updatedAt' => $clean['updatedAt']]);
