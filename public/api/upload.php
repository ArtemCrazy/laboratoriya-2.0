<?php
/**
 * Загрузка фото спикера. Принимаем только картинки и только по факту
 * содержимого (getimagesize), а не по расширению из имени файла —
 * иначе можно было бы залить скрипт под видом .jpg.
 *
 * Имя генерируем сами, оригинальное не используем вовсе.
 */

declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

require_auth();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    fail('Метод не поддерживается', 405);
}

if (empty($_FILES['file']) || !is_array($_FILES['file'])) {
    fail('Файл не передан');
}

$file = $_FILES['file'];
if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    fail('Файл не загрузился (код ' . (int) $file['error'] . ')');
}

$maxBytes = 8 * 1024 * 1024;
if (($file['size'] ?? 0) > $maxBytes) {
    fail('Файл больше 8 МБ');
}

$tmp = (string) ($file['tmp_name'] ?? '');
if ($tmp === '' || !is_uploaded_file($tmp)) {
    fail('Некорректная загрузка');
}

$info = @getimagesize($tmp);
if ($info === false) {
    fail('Это не изображение');
}

$extByType = [
    IMAGETYPE_JPEG => 'jpg',
    IMAGETYPE_PNG => 'png',
    IMAGETYPE_WEBP => 'webp',
];
$type = $info[2] ?? null;
if (!isset($extByType[$type])) {
    fail('Поддерживаются JPG, PNG и WEBP');
}

if (!is_dir(UPLOAD_DIR) && !mkdir(UPLOAD_DIR, 0775, true) && !is_dir(UPLOAD_DIR)) {
    fail('Не удалось создать папку для фото', 500);
}

// Картинки отдавать нужно, а исполнять в этой папке — нечего:
// глушим PHP на случай, если в загрузку всё же просочится скрипт
$htaccess = UPLOAD_DIR . '/.htaccess';
if (!is_file($htaccess)) {
    @file_put_contents(
        $htaccess,
        "php_flag engine off\n"
        . "<FilesMatch \"\\.(php|phtml|phar|phps|cgi|pl)$\">\n"
        . "Require all denied\n"
        . "</FilesMatch>\n"
    );
}

$name = 'sp-' . bin2hex(random_bytes(8)) . '.' . $extByType[$type];
$dest = UPLOAD_DIR . '/' . $name;

if (!move_uploaded_file($tmp, $dest)) {
    fail('Не удалось сохранить файл', 500);
}
@chmod($dest, 0644);

// Путь отдаём относительно корня сайта — его же кладём в content.json
$base = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');

respond(['ok' => true, 'path' => $base . '/api/uploads/' . $name]);
