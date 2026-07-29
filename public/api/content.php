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

// Сохраняем только известные разделы: лишние ключи в файл не пускаем
$allowed = ['speakers', 'program'];
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
