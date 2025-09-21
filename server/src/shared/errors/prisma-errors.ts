import { AppError } from "./custom-errors.js";

export class PrismaErrors extends AppError {


  constructor(message: string, status: number, errors: any) {
    super(message, status, errors);

    this.name = "PrismaError";

  }

  private static uniqueConstraint(err: any) {
    return new PrismaErrors("Unique constraint violated", 409, err);
  }

  private static notFound(err: any) {
    return new PrismaErrors("Record not found", 404, err);
  }

  private static serviceUnavailable(err: any) {
    return new PrismaErrors("Database connection failed", 503, err);
  }

  private static gatewayTimeout(err: any) {
    return new PrismaErrors("Database timeout", 504, err);
  }

  private static foreignKeyConstraint(err: any) {
    return new PrismaErrors("Foreign key constraint violation", 400, err);
  }

  private static transactionConflict(err: any) {
    return new PrismaErrors("Transaction conflict", 409, err);
  }

  static code(error: any) {
    switch (error) {
      case "P2002":
        return this.uniqueConstraint(error);
      case "P2025":
        return this.notFound(error);
      case "P1001":
      case "P1002":
      case "P1017":
        return this.serviceUnavailable(error);
      case "P1008":
      case "P2024":
        return this.gatewayTimeout(error);
      case "P2003":
        return this.foreignKeyConstraint(error);
      case "P2034":
        return this.transactionConflict(error)
      default:
        throw new Error(`Unknown Prisma error code: ${error.code}`);
    }
  }
}
