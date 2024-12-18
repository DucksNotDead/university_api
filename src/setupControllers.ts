import fs from 'fs';
import path from 'path';
import { Express } from 'express';

// Путь к директории с контроллерами
const controllersDir = path.join(__dirname, 'controllers');

// Загружаем все контроллеры из директории
export function setupControllers(app: Express) {
  const controllerFiles = fs.readdirSync(controllersDir); // Чтение файлов в директории

  controllerFiles.forEach((file) => {
    const filePath = path.join(controllersDir, file);

    // Проверка, что файл имеет расширение .ts или .js
    if (file.endsWith('.ts') || file.endsWith('.js')) {
      // Импортируем и инициализируем каждый контроллер
      import(filePath)
        .then((controllerModule) => {
          // Здесь предполагается, что контроллер экспортирует класс
          const controller = new controllerModule.default();

          // Вызываем метод для инициализации маршрутов
          controller.init(app)
        })
        .catch((err) => {
          console.error(`Failed to load controller: ${filePath}`, err);
        });
    }
  });
}
