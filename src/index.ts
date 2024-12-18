import express from 'express';
import cookieParser from 'cookie-parser';
import { setupControllers } from './setupControllers';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cookieParser());

setupControllers(app)

// Запуск сервер
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
});
