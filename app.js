import express from 'express';
import registerRouter from './src/routes/index.js'
import dotenv from 'dotenv';
import { checkSyntaxError } from './src/middlewares/syntax-error.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

registerRouter(app);

// Return 404 if path not found
app.all('*', (request, response) => {
  response.status(404).json();
  return;
});

app.use(checkSyntaxError);

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Cloud native app listening on port ${PORT}!`);
});

