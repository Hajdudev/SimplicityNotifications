import express, { Router } from "express";
import { contextService } from "./services/context.service";
import { v4 as uuid } from "uuid";
//Controllers
import * as notificationController from "./controller/notifications.controller";


export const router: Router = express.Router();

router.use((req, res, next) => {
  contextService.run(() => next());
});

router.use((req, res, next) => {
  let correlationId = contextService.getCorrelationId();
  if (!correlationId) {
    correlationId = (req.headers["x-correlation-id"] as string) || uuid();
    contextService.setCorrelationId(correlationId);
  }
  next();
});
router.get("/", notificationController.getRegistrations)
