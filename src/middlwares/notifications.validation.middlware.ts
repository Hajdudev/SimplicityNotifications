import { Request, Response, NextFunction } from "express";
import {
  notificationsGetRequestSchema,
  NotificationsGetType,
  notificationPostRequestSchema,
  NotificationPostType,
  notificationPutRequestSchema,
  NotificationPutType,
} from "../types/request/notifications.request.schema";
import { ValidationError } from "../utils/errors";
import { idParamsSchema, IdParamsType } from "../types/request/common.request.schema";
import { LoggerService } from "../utils/LoggerService";
import { _zodErrorToApiResponse } from "./validation.middleware";

const logger = new LoggerService();

export interface ValidatedNotificationsGetRequest extends Request {
  validatedQuery?: NotificationsGetType;
}

export const validateNotificationsGetRequest = (
  req: ValidatedNotificationsGetRequest,
  res: Response,
  next: NextFunction
) => {
  const query = req.query;
  const result = notificationsGetRequestSchema.safeParse(query);
  if (!result.success) {

    logger.debug(`Validating GET notifications request with query: ${JSON.stringify(query)}`);
    throw new ValidationError(_zodErrorToApiResponse(result.error), result.error);
  }

  req.validatedQuery = result.data;
  next();
};

export interface ValidatedNotificationGetRequest extends Request {
  validatedParams?: IdParamsType;
}

export const validateNotificationGetRequest = (
  req: ValidatedNotificationGetRequest,
  res: Response,
  next: NextFunction
) => {
  const params = req.params;
  const result = idParamsSchema.safeParse(params);
  if (!result.success) {
    logger.debug(`Validating GET notification request with params: ${JSON.stringify(params)}`);
    throw new ValidationError(_zodErrorToApiResponse(result.error), result.error);
  }

  req.validatedParams = result.data;
  next();
};

export interface ValidatedNotificationPostRequest extends Request {
  validatedBody?: NotificationPostType;
}

export const validateNotificationPostRequest = (
  req: ValidatedNotificationPostRequest,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;
  const result = notificationPostRequestSchema.safeParse(body);
  if (!result.success) {
    logger.debug(`Validating POST notification request with body: ${JSON.stringify(body)}`);
    throw new ValidationError(_zodErrorToApiResponse(result.error), result.error);
  }

  req.validatedBody = result.data;
  next();
};

export interface ValidatedNotificationPutRequest extends Request {
  validatedParams?: IdParamsType;
  validatedBody?: NotificationPutType;
}

export const validateNotificationPutRequest = (
  req: ValidatedNotificationPutRequest,
  res: Response,
  next: NextFunction
) => {
  const params = req.params;
  const paramsResult = idParamsSchema.safeParse(params);
  if (!paramsResult.success) {
    logger.debug(`Validating PUT notification request with params: ${JSON.stringify(params)}`);
    throw new ValidationError(_zodErrorToApiResponse(paramsResult.error), paramsResult.error);
  }

  const body = req.body;
  const bodyResult = notificationPutRequestSchema.safeParse(body);
  if (!bodyResult.success) {
    logger.debug(`Validating PUT notification request with body: ${JSON.stringify(body)}`);
    throw new ValidationError(_zodErrorToApiResponse(bodyResult.error), bodyResult.error);
  }

  req.validatedParams = paramsResult.data;
  req.validatedBody = bodyResult.data;
  next();
};

export interface ValidatedNotificationDeleteRequest extends Request {
  validatedParams?: IdParamsType;
}

export const validateNotificationDeleteRequest = (
  req: ValidatedNotificationDeleteRequest,
  res: Response,
  next: NextFunction
) => {
  const params = req.params;
  const result = idParamsSchema.safeParse(params);
  if (!result.success) {
    logger.debug(`Validating DELETE notification request with params: ${JSON.stringify(params)}`);
    throw new ValidationError(_zodErrorToApiResponse(result.error), result.error);
  }

  req.validatedParams = result.data;
  next();
};
