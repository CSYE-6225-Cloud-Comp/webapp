import app from './app.js';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Cloud native app listening on port ${PORT}!`);
});