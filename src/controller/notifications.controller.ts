import { Response } from "express"
import { ValidatedNotificationDeleteRequest, ValidatedNotificationGetRequest, ValidatedNotificationPostRequest, ValidatedNotificationPutRequest, ValidatedNotificationsGetRequest } from "../middlwares/notifications.validation.middlware"
import { InternalServerError } from "../utils/errors";
import { handleGetNotification, handleGetNotifications, handlePostNotification, handlePutNotification } from "../services/notifications.service";


export const getRegistrations = async (req: ValidatedNotificationsGetRequest, res: Response): Promise<void> => {
  if (!req.validatedQuery) {
    throw new InternalServerError("Missing validated query");
  }
  const { size, category, page } = req.validatedQuery
  const result = await handleGetNotifications({ size, page, category })
  res.json(result)

  return
}

export const getRegistration = async (req: ValidatedNotificationGetRequest, res: Response): Promise<void> => {
  if (!req.validatedParams) {
    throw new InternalServerError("Missing validated params");
  }

  const result = await handleGetNotification()
  res.json(result)

  return
}

export const postRegistration = async (req: ValidatedNotificationPostRequest, res: Response): Promise<void> => {
  if (!req.validatedBody) {
    throw new InternalServerError("Missing validated body");
  }

  const result = await handlePostNotification()
  res.json(result)

  return
}

export const putRegistration = async (req: ValidatedNotificationPutRequest, res: Response): Promise<void> => {
  if (!req.validatedParams) {
    throw new InternalServerError("Missing validated parameters");
  }

  if (!req.validatedBody) {
    throw new InternalServerError("Missing validated body");
  }

  const result = await handlePutNotification()
  res.json(result)

  return
}


export const deleteRegistration = async (req: ValidatedNotificationDeleteRequest, res: Response): Promise<void> => {
  if (!req.validatedParams) {
    throw new InternalServerError("Missing validated params");
  }

  await handlePutNotification()

  res.status(204).end();
  return
}
