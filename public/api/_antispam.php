<?php
/**
 * Защита форм от ботов.
 *
 * 26.08.2026 сайт получил залп заявок: пять штук за три секунды с одного
 * адреса, должность у всех — случайный набор латинских букв. Бот не
 * заполнял форму в браузере, а бил прямо в приёмник заявок, поэтому
 * скрытое поле-ловушка его не остановило.
 *
 * Отсюда два рубежа. Первый — подписанный пропуск: форма получает его при
 * открытии, и заявка без пропуска не принимается вовсе. Второй — разбор
 * содержимого: подозрительное не выбрасывается, а откладывается в «Спам»,
 * чтобы ошибка фильтра не стоила живой заявки.
 */

declare(strict_types=1);

const SECRET_FILE = DATA_DIR . '/form-secret.txt';
const NONCE_FILE = DATA_DIR . '/form-nonces.json';

/** Пропуск живёт полчаса: форма запрашивает его при открытии окна */
const TOKEN_TTL = 1800;

/** Быстрее пяти секунд форму не заполняет ни один человек */
const TOKEN_MIN_AGE = 5;

/** Ключ подписи заводится сам при первом обращении и лежит только на сервере */
function form_secret(): string
{
    if (is_file(SECRET_FILE)) {
        $saved = trim((string) file_get_contents(SECRET_FILE));
        if ($saved !== '') {
            return $saved;
        }
    }

    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0775, true);
    }
    protect_dir(DATA_DIR);

    $secret = bin2hex(random_bytes(32));
    file_put_contents(SECRET_FILE, $secret, LOCK_EX);
    return $secret;
}

/** Пропуск: время выдачи, случайная метка и подпись обеих частей */
function issue_form_token(): string
{
    $ts = time();
    $nonce = bin2hex(random_bytes(8));
    $sig = hash_hmac('sha256', "$ts.$nonce", form_secret());
    return "$ts.$nonce.$sig";
}

/** Одноразовость: использованные метки храним, пока они не протухнут */
function nonce_used(string $nonce): bool
{
    $data = is_file(NONCE_FILE)
        ? json_decode((string) file_get_contents(NONCE_FILE), true)
        : [];
    if (!is_array($data)) {
        $data = [];
    }

    $now = time();
    $fresh = [];
    foreach ($data as $key => $ts) {
        if (is_int($ts) && $ts > $now - TOKEN_TTL) {
            $fresh[$key] = $ts;
        }
    }

    if (isset($fresh[$nonce])) {
        return true;
    }

    $fresh[$nonce] = $now;
    file_put_contents(
        NONCE_FILE,
        json_encode($fresh, JSON_UNESCAPED_SLASHES),
        LOCK_EX
    );
    return false;
}

/**
 * Проверка пропуска.
 * Возвращает ['ok' => bool, 'error' => string, 'age' => int].
 */
function check_form_token(string $token): array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return ['ok' => false, 'error' => 'Обновите страницу и заполните форму заново', 'age' => 0];
    }

    [$ts, $nonce, $sig] = $parts;
    $expected = hash_hmac('sha256', "$ts.$nonce", form_secret());
    if (!hash_equals($expected, $sig)) {
        return ['ok' => false, 'error' => 'Обновите страницу и заполните форму заново', 'age' => 0];
    }

    $age = time() - (int) $ts;
    if ($age > TOKEN_TTL) {
        return ['ok' => false, 'error' => 'Форма была открыта слишком давно. Обновите страницу', 'age' => $age];
    }
    if ($age < 0) {
        return ['ok' => false, 'error' => 'Обновите страницу и заполните форму заново', 'age' => 0];
    }
    if (nonce_used($nonce)) {
        return ['ok' => false, 'error' => 'Заявка уже отправлена', 'age' => $age];
    }

    return ['ok' => true, 'error' => '', 'age' => $age];
}

/**
 * Строка похожа на случайный набор букв.
 *
 * Признак один и намеренно узкий: слово латиницей без пробелов, в котором
 * почти нет гласных. Боты этой атаки писали в должности «ewxusrwk»,
 * «ulggijqq», «qwrtzplk» — доля гласных ровно четверть. У настоящих
 * должностей она выше: partner и analyst 0.29, marketing 0.33,
 * manager 0.43. Порог 0.26 проходит между ними. Короткие аббревиатуры
 * вроде HRBP не проверяем вовсе.
 *
 * «y» за гласную не считаем: боты любят её в мусорных строках.
 */
function looks_like_gibberish(string $value): bool
{
    $value = trim($value);
    if (mb_strlen($value) < 6 || preg_match('/\s/u', $value)) {
        return false;
    }
    if (!preg_match('/^[a-zA-Z]+$/', $value)) {
        return false;
    }

    $lower = strtolower($value);

    // Обычные слова, которым просто не повезло с гласными
    $known = ['strategy', 'systems', 'products', 'projects', 'growth', 'digital', 'staffing'];
    if (in_array($lower, $known, true)) {
        return false;
    }

    return preg_match_all('/[aeiou]/', $lower) / strlen($lower) < 0.26;
}

/**
 * Оценка заявки. Чем выше, тем больше похоже на бота.
 * От 3 баллов заявка уходит в «Спам» и письмом не отправляется.
 */
function spam_score(array $clean, array $leads, string $ip, int $tokenAge): array
{
    $score = 0;
    $why = [];

    // Проверяем только должность: именно её боты набивали мусором,
    // а названия компаний бывают любыми и легко дают ложный сигнал
    if (looks_like_gibberish((string) ($clean['role'] ?? ''))) {
        $score += 3;
        $why[] = 'бессмысленный текст в должности';
    }

    // Точный повтор: та же почта и то же имя за последние сутки
    $email = mb_strtolower((string) ($clean['email'] ?? ''));
    $day = time() - 86400;
    foreach ($leads as $l) {
        if (strtotime((string) ($l['createdAt'] ?? '')) < $day) {
            break;
        }
        if (mb_strtolower((string) ($l['fields']['email'] ?? '')) === $email) {
            $score += 3;
            $why[] = 'повтор заявки с той же почтой';
            break;
        }
    }

    // Залп: с того же адреса уже приходило меньше пяти минут назад
    $burst = 0;
    foreach ($leads as $l) {
        if (($l['ip'] ?? '') === $ip && strtotime((string) ($l['createdAt'] ?? '')) > time() - 300) {
            $burst++;
        }
    }
    if ($burst >= 2) {
        $score += 2;
        $why[] = 'несколько заявок подряд с одного адреса';
    }

    // Форма заполнена подозрительно быстро
    if ($tokenAge > 0 && $tokenAge < 8) {
        $score += 1;
        $why[] = 'форма заполнена за секунды';
    }

    // Ссылка в комментарии — обычный признак рассылки
    if (preg_match('~https?://|www\.~i', (string) ($clean['comment'] ?? ''))) {
        $score += 2;
        $why[] = 'ссылка в комментарии';
    }

    return ['score' => $score, 'why' => implode(', ', array_unique($why))];
}
