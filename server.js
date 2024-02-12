import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Cloud native app listening on port ${PORT}!`);
});