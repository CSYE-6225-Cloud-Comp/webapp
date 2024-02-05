import express from 'express';
import registerRouter from './src/routes/index.js'
import dotenv from 'dotenv';
import { checkSyntaxError } from './src/middlewares/syntax-error.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

registerRouter(app);

app.use(checkSyntaxError);

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Cloud native app listening on port ${PORT}!`);
});

