import { Response } from "express";
import {
  ValidatedNotificationDeleteRequest,
  ValidatedNotificationGetRequest,
  ValidatedNotificationPostRequest,
  ValidatedNotificationPutRequest,
  ValidatedNotificationsGetRequest,
} from "../middlwares/notifications.validation.middlware";
import { InternalServerError } from "../utils/errors";
import {
  handleGetNotification,
  handleGetNotifications,
  handlePostNotification,
  handlePutNotification,
  handleDeleteNotification,
} from "../services/notifications.service";
import { SelectableNotifications } from "../dao/notifications.dao";

export const getRegistrations = async (
  req: ValidatedNotificationsGetRequest,
  res: Response
): Promise<void> => {
  if (!req.validatedQuery) {
    throw new InternalServerError("Missing validated query");
  }
  const { size, category, page } = req.validatedQuery;
  const result = await handleGetNotifications({ size, page, category });
  res.json(result);

  return;
};

export const getRegistration = async (
  req: ValidatedNotificationGetRequest,
  res: Response
): Promise<void> => {
  if (!req.validatedParams) {
    throw new InternalServerError("Missing validated params");
  }

  const { id } = req.validatedParams;
  const result = await handleGetNotification(id);
  res.json(result);

  return;
};

export const postRegistration = async (
  req: ValidatedNotificationPostRequest,
  res: Response
): Promise<void> => {
  if (!req.validatedBody) {
    throw new InternalServerError("Missing validated body");
  }

  const result = await handlePostNotification(req.validatedBody);
  res.status(201).json(result as SelectableNotifications);

  return;
};

export const putRegistration = async (
  req: ValidatedNotificationPutRequest,
  res: Response
): Promise<void> => {
  if (!req.validatedParams) {
    throw new InternalServerError("Missing validated parameters");
  }

  if (!req.validatedBody) {
    throw new InternalServerError("Missing validated body");
  }

  const { id } = req.validatedParams;
  const result = await handlePutNotification(id, req.validatedBody);
  res.json(result);

  return;
};

export const deleteRegistration = async (
  req: ValidatedNotificationDeleteRequest,
  res: Response
): Promise<void> => {
  if (!req.validatedParams) {
    throw new InternalServerError("Missing validated params");
  }

  const { id } = req.validatedParams;
  await handleDeleteNotification(id);

  res.status(204).end();
  return;
};
