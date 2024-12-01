import express from 'express';
import cookieParser from 'cookie-parser';
import { Router } from './helpers/router';
import { AuthController } from './controllers/AuthController';
import { UsersController } from './controllers/UsersController';
import { FacultiesController } from './controllers/FacultiesController';
import { DepartmentsController } from './controllers/DepartmentsController';
import { DisciplinesController } from './controllers/DisciplinesController';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cookieParser());

new Router(
  AuthController,
  UsersController,
  FacultiesController,
  DepartmentsController,
  DisciplinesController,
).init(app);

// Запуск сервер
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
});
