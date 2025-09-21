import { AppError } from "./custom-errors.js";

export class ZodErrors extends AppError {

  constructor(message: string, status: number, errors: any) {
    super(message, status, errors);

    this.name = "ZodError";
  }

  public static validation(err: any) {
    return new ZodErrors("Validation failed", 422, JSON.parse(err.message));
  }
}
