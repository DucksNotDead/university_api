import express from 'express';
import cookieParser from 'cookie-parser';
import { setupControllers } from './setupControllers';
import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

setupControllers(app);

// Запуск сервер
app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
});
