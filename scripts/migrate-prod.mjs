/**
 * Перенос сайта на боевой домен.
 *
 * Порядок важен: сначала архивируем то, что уже стоит на домене, и только
 * потом заливаем новое. Если что-то пойдёт не так, старый сайт останется
 * целиком в архивной папке.
 *
 * Шаги:
 *   1. Копия текущего сайта в PROD_ARCHIVE (по умолчанию vers1) на сервере
 *      и скачивание её же локально, в .transfer/archive
 *   2. Заливка новой сборки из out/ в корень
 *   3. Перенос данных админки из .transfer/_data и .transfer/uploads
 *   4. Закрытие архива от индексации
 *
 * Доступы берутся из переменных окружения, как в deploy.mjs:
 *   PROD_HOST · PROD_PORT · PROD_USER · PROD_PASSWORD · PROD_DIR
 *   PROD_ARCHIVE — имя папки архива, по умолчанию vers1
 *
 * Запуск по шагам, чтобы можно было остановиться и посмотреть:
 *   node scripts/migrate-prod.mjs archive
 *   node scripts/migrate-prod.mjs upload
 *   node scripts/migrate-prod.mjs data
 */

import SftpClient from 'ssh2-sftp-client';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const localOut = resolve(root, 'out');
const transferDir = resolve(root, '.transfer');

const cfg = {
  host: process.env.PROD_HOST,
  port: Number(process.env.PROD_PORT || 22),
  username: process.env.PROD_USER,
  password: process.env.PROD_PASSWORD,
};
/**
 * Путь собираем здесь, а не берём из окружения целиком: Git Bash подменяет
 * переменные, похожие на unix-пути, и /var/www превращается в путь к Git.
 */
const remoteDir = process.env.PROD_DIR?.startsWith('/')
  ? process.env.PROD_DIR
  : `/var/www/${process.env.PROD_USER}/data/www/${process.env.PROD_DIR}`;
const archiveName = process.env.PROD_ARCHIVE || 'vers1';

/** Живое на сервере: контент админки, загруженные фото и пароль */
const KEEP_ON_SERVER = ['api/_data', 'api/uploads', 'api/config.php'];

const step = process.argv[2] || 'help';

const missing = Object.entries({ ...cfg, PROD_DIR: remoteDir })
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (step === 'help') {
  console.log('Шаги: archive | upload | data');
  console.log('Нужны переменные: PROD_HOST, PROD_PORT, PROD_USER, PROD_PASSWORD, PROD_DIR');
  process.exit(0);
}

if (missing.length) {
  console.error(`Не заданы переменные окружения: ${missing.join(', ')}`);
  process.exit(1);
}

const sftp = new SftpClient();

/** Рекурсивно скачиваем папку: fastGet умеет только файлы */
/** Медиа не тянем к себе: это десятки мегабайт, и они есть в бэкапе хостинга */
const SKIP_LOCAL = ['img', 'images', 'upload', 'uploads'];

async function downloadDir(remote, local) {
  const list = await sftp.list(remote);
  const { mkdirSync } = await import('node:fs');
  mkdirSync(local, { recursive: true });

  for (const item of list) {
    const from = `${remote}/${item.name}`;
    const to = `${local}/${item.name}`;
    // Архив кладём внутрь той же папки — в него самого не заходим
    if (item.name === archiveName) continue;
    if (item.type === 'd' && SKIP_LOCAL.includes(item.name)) {
      console.log(`  (локально пропущено, останется на сервере: ${item.name})`);
      continue;
    }
    if (item.type === 'd') {
      await downloadDir(from, to);
    } else if (item.type === '-') {
      await sftp.fastGet(from, to);
    }
  }
}

try {
  await sftp.connect(cfg);
  console.log(`Подключён: ${cfg.username}@${cfg.host} → ${remoteDir}`);

  if (step === 'archive') {
    const archivePath = `${remoteDir}/${archiveName}`;

    const list = await sftp.list(remoteDir);
    const items = list.filter((f) => f.name !== archiveName && !f.name.startsWith('.'));
    if (!items.length) {
      console.log('В корне пусто — архивировать нечего.');
    } else {
      // Сначала копия к себе: пусть будет и локально, независимо от сервера
      const localArchive = resolve(transferDir, 'archive');
      console.log('Скачиваем текущий сайт в .transfer/archive …');
      await downloadDir(remoteDir, localArchive);
      console.log('Скачано.');

      if (!(await sftp.exists(archivePath))) {
        await sftp.mkdir(archivePath, true);
      }

      // На сервере переносим содержимое в папку архива
      for (const item of items) {
        const from = `${remoteDir}/${item.name}`;
        const to = `${archivePath}/${item.name}`;
        if (await sftp.exists(to)) {
          console.log(`  пропуск (уже в архиве): ${item.name}`);
          continue;
        }
        await sftp.rename(from, to);
        console.log(`  в архив: ${item.name}`);
      }

      // Закрываем архив от индексации
      const htaccess = resolve(transferDir, 'vers1.htaccess');
      if (existsSync(htaccess)) {
        await sftp.put(htaccess, `${archivePath}/.htaccess`);
        console.log('  архив закрыт от индексации');
      }
    }
  }

  if (step === 'upload') {
    if (!existsSync(localOut)) {
      console.error('Нет папки out/ — соберите: BASE_PATH= npm run build');
      process.exit(1);
    }
    await sftp.uploadDir(localOut, remoteDir, {
      filter: (path) => !KEEP_ON_SERVER.some((p) => path.replace(/\\/g, '/').includes(p)),
    });
    console.log('Сборка залита.');
    console.log(`Не тронуто: ${KEEP_ON_SERVER.join(', ')}`);
  }

  if (step === 'data') {
    const dataDir = resolve(transferDir, '_data');
    const uploadsDir = resolve(transferDir, 'uploads');

    if (existsSync(dataDir)) {
      const target = `${remoteDir}/api/_data`;
      if (!(await sftp.exists(target))) await sftp.mkdir(target, true);
      for (const name of readdirSync(dataDir)) {
        if (!statSync(resolve(dataDir, name)).isFile()) continue;
        await sftp.put(resolve(dataDir, name), `${target}/${name}`);
        console.log(`  данные: ${name}`);
      }
    }

    if (existsSync(uploadsDir)) {
      const target = `${remoteDir}/api/uploads`;
      if (!(await sftp.exists(target))) await sftp.mkdir(target, true);
      for (const name of readdirSync(uploadsDir)) {
        if (!statSync(resolve(uploadsDir, name)).isFile()) continue;
        await sftp.put(resolve(uploadsDir, name), `${target}/${name}`);
        console.log(`  файл: ${name}`);
      }
    }
    console.log('Данные админки перенесены.');
  }
} catch (err) {
  console.error('Ошибка:', err.message);
  process.exitCode = 1;
} finally {
  await sftp.end();
}
