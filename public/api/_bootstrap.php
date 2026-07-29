<?php
/**
 * Общая часть API админки: сессия, пути, доступ.
 *
 * Данные и пароль лежат в _data/ и config.php — они НЕ заливаются деплоем
 * (см. исключения в scripts/deploy.mjs), иначе правки клиента затирались бы
 * при каждой выкладке сайта.
 */

declare(strict_types=1);

const DATA_DIR = __DIR__ . '/_data';
const CONTENT_FILE = DATA_DIR . '/content.json';
const UPLOAD_DIR = __DIR__ . '/uploads';

/** Ответ JSON-ом и выход */
function respond(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $message, int $status = 400): never
{
    respond(['ok' => false, 'error' => $message], $status);
}

/**
 * Сессия админки. Кука живёт на корне приложения, а не только на /api:
 * страница админки лежит в /admin, и ей тоже нужно видеть сессию.
 * На весь домен всё равно не отдаём — соседние сайты её не получат.
 */
function start_admin_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $appRoot = dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '/api/x.php'));
    if ($appRoot === '' || $appRoot === '.' || $appRoot === '\\') {
        $appRoot = '/';
    }

    session_name('lab2admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => $appRoot,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function config(): array
{
    $file = __DIR__ . '/config.php';
    if (!is_file($file)) {
        fail('Админка не настроена: нет config.php с паролем', 503);
    }
    /** @var array $cfg */
    $cfg = require $file;
    if (empty($cfg['password_hash'])) {
        fail('Админка не настроена: не задан пароль', 503);
    }
    return $cfg;
}

function is_authorized(): bool
{
    start_admin_session();
    return !empty($_SESSION['lab2_admin']);
}

function require_auth(): void
{
    if (!is_authorized()) {
        fail('Требуется вход', 401);
    }
}

/** Тело запроса как массив */
function read_json_body(): array
{
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        fail('Некорректный JSON в запросе');
    }
    return $data;
}

function read_content(): array
{
    if (!is_file(CONTENT_FILE)) {
        return [];
    }
    $raw = file_get_contents(CONTENT_FILE);
    $data = $raw === false ? null : json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/**
 * Пишем через временный файл и rename: если запись оборвётся,
 * content.json не превратится в обрезанный «полуфайл».
 */
function write_content(array $data): void
{
    if (!is_dir(DATA_DIR) && !mkdir(DATA_DIR, 0775, true) && !is_dir(DATA_DIR)) {
        fail('Не удалось создать папку данных', 500);
    }
    protect_dir(DATA_DIR);

    $json = json_encode(
        $data,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT
    );
    if ($json === false) {
        fail('Не удалось сериализовать данные', 500);
    }

    $tmp = CONTENT_FILE . '.tmp';
    if (file_put_contents($tmp, $json, LOCK_EX) === false || !rename($tmp, CONTENT_FILE)) {
        @unlink($tmp);
        fail('Не удалось сохранить данные', 500);
    }
}

/** Прямой доступ к папке по HTTP закрываем: внутри данные админки */
function protect_dir(string $dir): void
{
    $htaccess = $dir . '/.htaccess';
    if (!is_file($htaccess)) {
        @file_put_contents($htaccess, "Require all denied\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n");
    }
}
