/**
 * Генерирует config.php с хешем пароля админки и заливает его на сервер.
 *
 * Пароль передаётся аргументом и никуда не сохраняется: в файл уходит
 * только bcrypt-хеш. Сам config.php не в git и не перезаписывается
 * деплоем (см. KEEP_ON_SERVER в deploy.mjs).
 *
 *   node scripts/admin-password.mjs "новый-пароль"
 *
 * Доступы берутся из переменных окружения, как и в deploy.mjs.
 */

import SftpClient from 'ssh2-sftp-client';
import bcrypt from 'bcryptjs';
import { readFileSync, existsSync } from 'node:fs';

/**
 * Доступы берём из окружения, а если их нет — из локального creds-файла
 * (путь можно переопределить переменной LAB2_CREDS). Файл лежит вне
 * проекта, в репозиторий не попадает.
 */
function loadCreds() {
  if (process.env.SFTP_HOST) return;
  const file =
    process.env.LAB2_CREDS ??
    `${process.env.LOCALAPPDATA ?? ''}\\CrazyAssistant\\creds\\card-124.env`;
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

loadCreds();

const password = process.argv[2];

if (!password || password.length < 8) {
  console.error('Укажите пароль не короче 8 символов:');
  console.error('  node scripts/admin-password.mjs "новый-пароль"');
  process.exit(1);
}

const cfg = {
  host: process.env.SFTP_HOST,
  port: Number(process.env.SFTP_PORT || 22),
  username: process.env.SFTP_USER,
  password: process.env.SFTP_PASSWORD,
};
const remoteDir = process.env.SFTP_DIR;

const missing = Object.entries({ ...cfg, SFTP_DIR: remoteDir })
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (missing.length) {
  console.error(`Не заданы переменные окружения: ${missing.join(', ')}`);
  process.exit(1);
}

// Стоимость 12: заметно дороже перебирать, но вход остаётся быстрым
const hash = bcrypt.hashSync(password, 12);

const php = `<?php
/**
 * Пароль админки. Файл создан scripts/admin-password.mjs.
 * В репозиторий не попадает и деплоем не перезаписывается.
 */

return [
    'password_hash' => ${JSON.stringify(hash).replace(/"/g, "'")},
];
`;

const sftp = new SftpClient();

try {
  await sftp.connect(cfg);
  const target = `${remoteDir}/api/config.php`;

  if (!(await sftp.exists(`${remoteDir}/api`))) {
    await sftp.mkdir(`${remoteDir}/api`, true);
  }

  await sftp.put(Buffer.from(php, 'utf8'), target);
  console.log(`Пароль админки обновлён: ${cfg.username}@${cfg.host} → ${target}`);
  console.log('Сам пароль нигде не сохранён — записан только хеш.');
} catch (err) {
  console.error('Ошибка:', err.message);
  process.exitCode = 1;
} finally {
  await sftp.end();
}
