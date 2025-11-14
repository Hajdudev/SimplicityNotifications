import { ResponseCodes } from "../controller/ResponseCodes";

export abstract class BaseError extends Error {
  statusCode = 500;

  protected constructor(message: string, error?: Error) {
    super(message, { cause: error });
  }
  abstract toResponse(): Record<string, unknown> & { error: string; statusCode: number };
}

export class ForbiddenError extends BaseError {
  constructor(message: string, error?: Error) {
    super(message, error);
    this.statusCode = ResponseCodes.HTTP_403_FORBIDDEN;
  }

  toResponse() {
    return {
      error: "ForbiddenError",
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

export class NotFoundError extends BaseError {
  constructor(message: string, error?: Error) {
    super(message, error);
    this.statusCode = ResponseCodes.HTTP_404_NOT_FOUND;
  }

  toResponse() {
    return {
      error: "NotFoundError",
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

export class DatabaseError extends BaseError {
  constructor(message: string, error?: Error) {
    super(message, error);
    this.statusCode = ResponseCodes.HTTP_400_BAD_REQUEST;
  }

  toResponse() {
    return {
      error: "DatabaseError",
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

export class AuthError extends BaseError {
  constructor(message: string, statusCode?: number, error?: Error) {
    super(message, error);
    this.statusCode = statusCode ?? ResponseCodes.HTTP_400_BAD_REQUEST;
  }

  toResponse() {
    return {
      error: "AuthError",
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

export class ValidationError extends BaseError {
  constructor(message: string, error?: Error) {
    super(message, error);
    this.statusCode = ResponseCodes.HTTP_400_BAD_REQUEST;
  }

  toResponse() {
    return {
      error: "ValidationError",
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string, error?: Error) {
    super(message, error);
    this.statusCode = ResponseCodes.HTTP_401_UNAUTHORIZED;
  }

  toResponse() {
    return {
      error: "UnauthorizedError",
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}

export class InternalServerError extends BaseError {
  constructor(message: string, error?: Error) {
    super(message, error);
    this.statusCode = ResponseCodes.HTTP_500_INTERNAL_SERVER_ERROR;
  }

  toResponse() {
    return {
      error: "InternalServerError",
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}
