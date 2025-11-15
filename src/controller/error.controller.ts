import { BaseError } from "../utils/errors";
import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../utils/LoggerService";
import { contextService } from "../services/context.service";

const logger = new LoggerService();

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  let statusCode;
  if (err instanceof BaseError) {
    statusCode = err.statusCode;
  }
  const correlationId = contextService.getCorrelationId() || "";
  res.status(statusCode ?? 500).json({ message: err.message, correlationId: correlationId });
};
