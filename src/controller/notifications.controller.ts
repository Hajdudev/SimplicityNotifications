import { Request, Response } from "express"
import { ValidatedNotificationDeleteRequest, ValidatedNotificationGetRequest, ValidatedNotificationPostRequest, ValidatedNotificationPutRequest, ValidatedNotificationsGetRequest } from "../middlwares/notifications.validation.middlware"
import { InternalServerError } from "../utils/errors";


export const getRegistrations = async (req: ValidatedNotificationsGetRequest, res: Response): Promise<void> => {
  if (req.validatedQuery) {
    throw new InternalServerError("Missing validated query");
  }

  return
}

export const getRegistration = async (req: ValidatedNotificationGetRequest, res: Response): Promise<void> => {
  if (req.validatedParams) {
    throw new InternalServerError("Missing validated params");
  }

  return
}

export const postRegistration = async (req: ValidatedNotificationPostRequest, res: Response): Promise<void> => {
  if (req.validatedBody) {
    throw new InternalServerError("Missing validated body");
  }

  return
}

export const putRegistration = async (req: ValidatedNotificationPutRequest, res: Response): Promise<void> => {
  if (!req.validatedParams) {
    throw new InternalServerError("Missing validated parameters");
  }

  if (!req.validatedBody) {
    throw new InternalServerError("Missing validated body");
  }

  return
}


export const deleteRegistration = async (req: ValidatedNotificationDeleteRequest, res: Response): Promise<void> => {
  if (req.validatedParams) {
    throw new InternalServerError("Missing validated params");
  }

  return
}
