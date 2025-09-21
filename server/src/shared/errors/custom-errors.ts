export class AppError extends Error {

  public status: number;
  public errorCode: any;

  constructor(message: string, status: number, errors: any) {
    super(message);
    this.status = status;
    this.name = "AppError";
    this.errorCode = errors;
  }

}

