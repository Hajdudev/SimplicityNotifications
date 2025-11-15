import express, { Router } from "express";
import { contextService } from "./services/context.service";
import { v4 as uuid } from "uuid";
//Controllers
import * as notificationController from "./controller/notifications.controller";
import { validateNotificationDeleteRequest, validateNotificationGetRequest, validateNotificationPostRequest, validateNotificationPutRequest, validateNotificationsGetRequest } from "./middlwares/notifications.validation.middlware";


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

//Notifications Routes
router.get("/notifications", [validateNotificationsGetRequest], notificationController.getRegistrations)
router.get("/notifications/:id", [validateNotificationGetRequest], notificationController.getRegistration)
router.post("/notifications/", [validateNotificationPostRequest], notificationController.postRegistration)
router.put("/notifications/:id", [validateNotificationPutRequest], notificationController.putRegistration)
router.delete("/notifications/:id", [validateNotificationDeleteRequest], notificationController.deleteRegistration)

