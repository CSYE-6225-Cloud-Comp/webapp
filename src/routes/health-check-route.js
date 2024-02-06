import express from "express";
import * as Healthcontroller from "../controllers/health-check-controller.js";

const router = express.Router();

console.log("Inside health-check-route.js");

router.route("/healthz")
    .get(Healthcontroller.getHealthStatus)
    .head(Healthcontroller.setMethodNotAllowed)
    .all(Healthcontroller.setMethodNotAllowed);


export default router;