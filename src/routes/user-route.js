import express from 'express';
import * as UserController from '../controllers/user-controller.js';

const router = express.Router();

router.route("/v1/user")
    .post(UserController.createUser)
    .head(UserController.methodNotAllowed)
    .all(UserController.methodNotAllowed);

router.route("/v1/user/self")
    .get(UserController.getUser)
    .put(UserController.updateUser)
    .head(UserController.methodNotAllowed)
    .all(UserController.methodNotAllowed);

router.route("/verify")
    .get(UserController.verifyUser)
    .head(UserController.methodNotAllowed)
    .all(UserController.methodNotAllowed);

export default router;