import express from 'express';
import * as UserController from '../controllers/user-controller.js';
import authenticateUser from '../middlewares/authentication.js';

const router = express.Router();

router.route("/v1/user")
    .post(UserController.createUser)

// router.use(authenticateUser);

router.route("/v1/user/self")
    .get(UserController.getUser)
    .put(UserController.updateUser)
    .all(UserController.methodNotAllowed);



export default router;