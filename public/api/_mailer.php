<?php
/**
 * Отправка уведомлений о заявках.
 *
 * Почему не просто mail(): письмо от mail() уходит с сервера хостинга,
 * а почта домена живёт на Яндексе. Для спам-фильтра это письмо «от самого
 * себя», пришедшее с чужого сервера и без подписи — прямой путь в спам.
 * Через SMTP ящика письмо подписывается DKIM Яндекса и проходит проверки.
 *
 * mail() остаётся запасным каналом: если SMTP не настроен или не ответил,
 * письмо всё равно попробует уйти обычным способом.
 */

declare(strict_types=1);

/** Строка заголовка с не-ASCII символами кодируется по RFC 2047 */
function mime_header(string $value): string
{
    return preg_match('/[^\x20-\x7E]/', $value)
        ? '=?UTF-8?B?' . base64_encode($value) . '?='
        : $value;
}

/** Читаем ответ сервера: последняя строка кода идёт без дефиса */
function smtp_read($fp): string
{
    $out = '';
    while (($line = fgets($fp, 1024)) !== false) {
        $out .= $line;
        if (strlen($line) < 4 || $line[3] !== '-') {
            break;
        }
    }
    return $out;
}

/** Команда и проверка кода ответа. Ожидаемых кодов может быть несколько */
function smtp_cmd($fp, string $cmd, string $expect): array
{
    if ($cmd !== '') {
        fwrite($fp, $cmd . "\r\n");
    }
    $res = smtp_read($fp);
    $code = substr($res, 0, 3);
    return [in_array($code, explode('|', $expect), true), trim($res)];
}

/**
 * Отправка через SMTP с авторизацией.
 * Возвращает ['ok' => bool, 'error' => string].
 */
function smtp_send(array $cfg, string $to, string $subject, string $body, string $replyTo = ''): array
{
    $host = trim((string) ($cfg['smtpHost'] ?? ''));
    $port = (int) ($cfg['smtpPort'] ?? 465);
    $user = trim((string) ($cfg['smtpUser'] ?? ''));
    $pass = (string) ($cfg['smtpPassword'] ?? '');
    $from = trim((string) ($cfg['smtpFrom'] ?? '')) ?: $user;

    if ($host === '' || $user === '' || $pass === '') {
        return ['ok' => false, 'error' => 'SMTP не настроен: нужны сервер, логин и пароль'];
    }

    // 465 — сразу TLS, 587 — открытым текстом с последующим STARTTLS
    $secure = $port === 465;
    $dsn = ($secure ? 'ssl://' : 'tcp://') . $host . ':' . $port;

    $fp = @stream_socket_client($dsn, $errno, $errstr, 12);
    if (!$fp) {
        return ['ok' => false, 'error' => "Не соединиться с $host:$port ($errstr)"];
    }
    stream_set_timeout($fp, 15);

    $helo = 'cblabconference.ru';

    [$ok, $res] = smtp_cmd($fp, '', '220');
    if (!$ok) {
        fclose($fp);
        return ['ok' => false, 'error' => 'Сервер не поздоровался: ' . $res];
    }

    smtp_cmd($fp, "EHLO $helo", '250');

    if (!$secure) {
        [$ok, $res] = smtp_cmd($fp, 'STARTTLS', '220');
        if (!$ok || !@stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
            fclose($fp);
            return ['ok' => false, 'error' => 'Не удалось включить шифрование: ' . $res];
        }
        smtp_cmd($fp, "EHLO $helo", '250');
    }

    [$ok, $res] = smtp_cmd($fp, 'AUTH LOGIN', '334');
    if ($ok) {
        [$ok, $res] = smtp_cmd($fp, base64_encode($user), '334');
    }
    if ($ok) {
        [$ok, $res] = smtp_cmd($fp, base64_encode($pass), '235');
    }
    if (!$ok) {
        fclose($fp);
        return ['ok' => false, 'error' => 'Почта не приняла логин или пароль: ' . $res];
    }

    [$ok, $res] = smtp_cmd($fp, "MAIL FROM:<$from>", '250');
    if (!$ok) {
        fclose($fp);
        return ['ok' => false, 'error' => "Адрес отправителя не принят ($from): " . $res];
    }

    [$ok, $res] = smtp_cmd($fp, "RCPT TO:<$to>", '250|251');
    if (!$ok) {
        fclose($fp);
        return ['ok' => false, 'error' => "Адрес получателя не принят ($to): " . $res];
    }

    [$ok, $res] = smtp_cmd($fp, 'DATA', '354');
    if (!$ok) {
        fclose($fp);
        return ['ok' => false, 'error' => 'Сервер не принял письмо: ' . $res];
    }

    $headers = [
        'Date: ' . date('r'),
        'From: ' . mime_header('Сайт C&B-лаборатории') . " <$from>",
        "To: <$to>",
        'Subject: ' . mime_header($subject),
        'Message-ID: <' . bin2hex(random_bytes(10)) . '@cblabconference.ru>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
    ];
    if ($replyTo !== '') {
        $headers[] = "Reply-To: <$replyTo>";
    }

    // base64 в теле: в нём нет точки в начале строки, экранировать нечего
    $data = implode("\r\n", $headers) . "\r\n\r\n"
        . chunk_split(base64_encode($body), 76, "\r\n");

    fwrite($fp, $data . "\r\n.\r\n");
    [$ok, $res] = smtp_cmd($fp, '', '250');

    smtp_cmd($fp, 'QUIT', '221');
    fclose($fp);

    return $ok ? ['ok' => true, 'error' => ''] : ['ok' => false, 'error' => 'Письмо не принято: ' . $res];
}

/** Заголовки для запасной отправки через mail() */
function plain_headers(string $replyTo = ''): string
{
    $host = preg_replace('/^www\./', '', (string) ($_SERVER['HTTP_HOST'] ?? 'localhost'));
    $headers = "MIME-Version: 1.0\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "From: site@$host\r\n";
    if ($replyTo !== '') {
        $headers .= "Reply-To: $replyTo\r\n";
    }
    return $headers;
}

/**
 * Уведомление на почту: сначала SMTP, при неудаче — mail().
 * Возвращает ['ok' => bool, 'via' => 'smtp|mail', 'error' => string].
 */
function notify_mail(array $cfg, string $to, string $subject, string $body, string $replyTo = ''): array
{
    if (!empty($cfg['smtpEnabled'])) {
        $res = smtp_send($cfg, $to, $subject, $body, $replyTo);
        if ($res['ok']) {
            return ['ok' => true, 'via' => 'smtp', 'error' => ''];
        }
        $fallback = @mail($to, mime_header($subject), $body, plain_headers($replyTo));
        return ['ok' => (bool) $fallback, 'via' => 'mail', 'error' => $res['error']];
    }

    $ok = @mail($to, mime_header($subject), $body, plain_headers($replyTo));
    return ['ok' => (bool) $ok, 'via' => 'mail', 'error' => $ok ? '' : 'mail() вернул ошибку'];
}

/**
 * Дубль заявки в Google-таблицу через веб-приложение Apps Script.
 * Таблица — независимый канал: если письмо не дойдёт, строка всё равно там.
 */
function push_to_sheet(string $url, array $payload): array
{
    if ($url === '') {
        return ['ok' => false, 'error' => 'Ссылка на таблицу не задана'];
    }
    if (!function_exists('curl_init')) {
        return ['ok' => false, 'error' => 'На сервере нет cURL'];
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_CONNECTTIMEOUT => 6,
    ]);
    $body = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);

    if ($body === false) {
        return ['ok' => false, 'error' => 'Таблица не ответила: ' . $err];
    }
    if ($code < 200 || $code >= 300) {
        return ['ok' => false, 'error' => "Таблица ответила кодом $code"];
    }
    return ['ok' => true, 'error' => ''];
}
