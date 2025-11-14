import * as winston from "winston";
import path from "path";
import { contextService } from "../services/context.service";

const { combine, printf, timestamp } = winston.format;

const LOG_LEVEL = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "info";

export class LoggerService {
  private logger: winston.Logger;

  /**
   * Creates a new instance of LoggerService. BE CAREFUL TO NOT LOG SENSITIVE INFORMATION (like tokens)
   */
  constructor() {
    this.logger = winston.createLogger({
      level: LOG_LEVEL,
      format: combine(timestamp(), this.formatter),
      transports: [new winston.transports.Console()],
    });

    this.logger.on("error", (err) => {
      this.logger.error(`An error occurred while logging with winston: ${err.message}`);
    });
  }

  private formatter = printf((info) => {
    let msg = `${info.level}: [${contextService.getCorrelationId() || ""}]`;
    msg += info?.moduleName ? ` ${info.moduleName}` : "";
    msg += ` ${info.message}`;
    return info?.stack ? `${msg}\nStacktrace: ${info.stack}` : msg;
  });

  public debug(message: string): void {
    const moduleName = this.getCallingModuleFilename();
    this.logger.debug(message, { moduleName });
  }

  public info(message: string): void {
    const moduleName = this.getCallingModuleFilename();
    this.logger.info(message, { moduleName });
  }

  public warn(message: string): void {
    const moduleName = this.getCallingModuleFilename();
    this.logger.warn(message, { moduleName });
  }

  /**
   * Error message and stacktrace will be logged (if error has a cause, cause message and cause stacktrace
   * will be logged as well)
   * @param error
   */
  public error(error: Error): void;
  /**
   * Provided message will be logged
   * @param message
   */
  public error(message: string): void;
  /**
   * Provided message and error message will be combined and logged (if error has a cause, cause message will be logged
   * as well), error stacktrace will be logged (if error has a cause, cause stacktrace will be logged as well)
   * @param message
   * @param error
   */
  public error(message: string, error: Error | undefined): void;
  public error(arg1: Error | string, arg2?: Error | undefined): void {
    let message: string;
    let stack;
    if (arg1 instanceof Error) {
      message = this.getMessageFromError(arg1);
      stack = this.getStackFromError(arg1);
    } else {
      message = arg1;
    }
    if (arg2) {
      message += ` | ${this.getMessageFromError(arg2)}`;
      stack = this.getStackFromError(arg2);
    }
    const moduleName = this.getCallingModuleFilename();
    this.logger.error(message, { moduleName, stack });
  }

  /**
   * Extracts the message from an error. If the error has also related cause, concatenates messages from main error
   * and from original error if present.
   * @param error
   * @returns the message from the error
   */
  private getMessageFromError(error: Error): string {
    if (error.cause) {
      return `${error.message} | ${(error.cause as Error).message}`;
    }

    return error.message;
  }

  /**
   * Extracts the stack from an error. If the error has also related cause, concatenates stacks from main error and from
   * original error if present.
   * @param error
   * @returns the stack from the error without line breaks
   */
  private getStackFromError(error: Error): string {
    let stackString = error.stack ?? "";
    if (error.cause) {
      stackString += `\nCaused by: ${(error.cause as Error).stack}`;
    }

    return stackString;
  }

  private getCallingModuleFilename() {
    const origPrepareStackTrace = Error.prepareStackTrace;
    try {
      Error.prepareStackTrace = function (_, stackTrace) {
        return stackTrace;
      };
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const stack = new Error().stack as any;
      Error.prepareStackTrace = origPrepareStackTrace;
      return "(" + path.basename(stack[2].getFileName()) + ")";
    } catch (err) {
      this.logger.error(err);
      Error.prepareStackTrace = origPrepareStackTrace;
    }
    return "";
  }
}
