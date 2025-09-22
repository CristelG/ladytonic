export class AppError extends Error {

  public status: number;
  public errorCode: any;
  public originalError?: unknown;

  constructor(message: string, status: number, errors: any, originalError?: unknown) {
    super(message);
    this.status = status;
    this.name = "AppError";
    this.errorCode = errors;
    this.originalError = originalError;
  }

}

