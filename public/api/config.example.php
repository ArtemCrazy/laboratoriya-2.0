<?php
/**
 * Образец конфига админки. Рабочий config.php лежит только на сервере:
 * он не в git и не заливается деплоем (см. scripts/deploy.mjs), чтобы
 * пароль не попадал в репозиторий и не перезатирался выкладкой.
 *
 * Хеш получить так (локально):
 *   php -r "echo password_hash('ВАШ_ПАРОЛЬ', PASSWORD_DEFAULT);"
 * либо скриптом:
 *   node scripts/admin-password.mjs
 */

return [
    'password_hash' => '$2y$12$ЗАМЕНИТЕ_НА_РЕАЛЬНЫЙ_ХЕШ',
];
