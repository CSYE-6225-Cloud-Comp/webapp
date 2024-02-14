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

export default app;

