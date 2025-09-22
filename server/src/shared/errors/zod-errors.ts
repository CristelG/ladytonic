import { AppError } from "./custom-errors";

export class ZodErrors extends AppError {
  constructor(message: string, status: number, errors: any, originalError?: unknown) {
    super(message, status, errors, originalError);

    this.name = "ZodError";
  }

  public static validation(err: any) {
    return new ZodErrors(
      "Validation failed",
      422,
      err.issues.map((issue: { code: any; message: any; }) => ({ code: issue.code, message: issue.message })),
      err
    );
  }
}
