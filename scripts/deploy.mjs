/**
 * Заливка собранной статики на стенд по SFTP.
 *
 * Доступы берутся ТОЛЬКО из переменных окружения — в файлы проекта
 * они не пишутся и в репозиторий не попадают (правило студии).
 *
 *   SFTP_HOST      office5c.beget.tech
 *   SFTP_PORT      22
 *   SFTP_USER      ...
 *   SFTP_PASSWORD  ...
 *   SFTP_DIR       рабочая папка на сервере
 *
 * Заливается только содержимое out/ — служебные файлы агентов
 * (.claude/, AGENTS.md) туда не попадают по определению.
 */

import SftpClient from 'ssh2-sftp-client';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const localDir = resolve(root, 'out');

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

if (!existsSync(localDir)) {
  console.error('Нет папки out/ — сначала собери проект: npm run build');
  process.exit(1);
}

const sftp = new SftpClient();

try {
  await sftp.connect(cfg);
  // Хост и папку печатаем, пароль — никогда
  console.log(`Подключён: ${cfg.username}@${cfg.host} → ${remoteDir}`);

  if (!(await sftp.exists(remoteDir))) {
    await sftp.mkdir(remoteDir, true);
  }

  await sftp.uploadDir(localDir, remoteDir);
  console.log('Готово. Статика залита.');
} catch (err) {
  console.error('Ошибка заливки:', err.message);
  process.exitCode = 1;
} finally {
  await sftp.end();
}
