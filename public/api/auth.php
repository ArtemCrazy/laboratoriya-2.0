<?php
/**
 * Вход в админку: POST {action:"login", password} / {action:"logout"},
 * GET — проверка текущей сессии.
 *
 * Пароль сверяется с хешем из config.php. Подбор придерживаем паузой и
 * лимитом попыток на сессию — на статичном хостинге это дешевле капчи.
 */

declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

start_admin_session();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
    respond(['ok' => true, 'authorized' => is_authorized()]);
}

$body = read_json_body();
$action = (string) ($body['action'] ?? '');

if ($action === 'logout') {
    $_SESSION = [];
    session_destroy();
    respond(['ok' => true, 'authorized' => false]);
}

if ($action !== 'login') {
    fail('Неизвестное действие');
}

$attempts = (int) ($_SESSION['login_attempts'] ?? 0);
if ($attempts >= 10) {
    fail('Слишком много попыток входа. Обновите страницу и попробуйте позже.', 429);
}

$cfg = config();
$password = (string) ($body['password'] ?? '');

// Пауза одинаковая для верного и неверного пароля — чтобы по времени
// ответа нельзя было отличить «пароль не тот» от «пароля нет вообще»
usleep(400_000);

if ($password === '' || !password_verify($password, (string) $cfg['password_hash'])) {
    $_SESSION['login_attempts'] = $attempts + 1;
    fail('Неверный пароль', 401);
}

// Меняем id сессии — защита от подсунутого заранее идентификатора
session_regenerate_id(true);
$_SESSION['lab2_admin'] = true;
$_SESSION['login_attempts'] = 0;

/**
 * После regenerate в ответе оказываются два Set-Cookie: со старым id
 * (его отправил session_start) и с новым. Браузер оставляет не тот,
 * и вход «слетает» на следующем же запросе. Поэтому чистим заголовки
 * и ставим куку сами — ровно одну, с актуальным id.
 */
header_remove('Set-Cookie');
$params = session_get_cookie_params();
setcookie(session_name(), session_id(), [
    'expires' => 0,
    'path' => $params['path'],
    'httponly' => true,
    'samesite' => 'Lax',
]);

respond(['ok' => true, 'authorized' => true]);
