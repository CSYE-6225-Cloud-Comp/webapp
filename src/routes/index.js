import healthCheckRouter from './health-check-route.js';
import userRouter from './user-route.js';
import { checkSyntaxError } from '../middlewares/syntax-error.js';

export default (app) => {
    app.use(healthCheckRouter);
    app.use(userRouter);
}