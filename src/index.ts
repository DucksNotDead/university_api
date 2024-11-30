import express from 'express';
import cookieParser from 'cookie-parser';
import { Router } from './helpers/router';
import { AuthController } from './controllers/AuthController';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cookieParser());

new Router(AuthController).init(app);

// Запуск сервер
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
});
