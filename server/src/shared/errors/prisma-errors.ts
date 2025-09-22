import { AppError } from "./custom-errors.js";

export class PrismaErrors extends AppError {
  constructor(message: string, status: number, errors: any, originalError?: unknown) {
    super(message, status, errors, originalError);
    this.name = "PrismaError";
  }

  private static uniqueConstraint(error: any) {
    const target = Array.isArray(error?.meta?.target)
      ? error.meta.target.join(", ")
      : error?.meta?.target ?? "unknown";
    return new PrismaErrors("Unique constraint violated", 409, [
      {
        code: "UNIQUE_CONSTRAINT",
        message: `field ${target} is a duplicate`,
      },
    ], error);
  }

  private static notFound(error: any) {
    const cause = error?.meta?.cause || "The requested record was not found";
    return new PrismaErrors("Record not found", 404, [
      { code: "NOT_FOUND", message: cause },
    ], error);
  }

  private static serviceUnavailable(error: any) {
    const msg =
      error?.message ||
      "Unable to connect to the database. Please try again later.";
    return new PrismaErrors("Database connection failed", 503, [
      { code: "SERVICE_UNAVAILABLE", message: msg },
    ], error);
  }

  private static gatewayTimeout(error: any) {
    const msg = error?.message || "The database operation timed out.";
    return new PrismaErrors("Database timeout", 504, [
      { code: "GATEWAY_TIMEOUT", message: msg },
    ], error);
  }

  private static foreignKeyConstraint(error: any) {
    const field = error?.meta?.field_name || "related record";
    return new PrismaErrors("Foreign key constraint violation", 400, [
      {
        code: "FOREIGN_KEY_CONSTRAINT",
        message: `Foreign key constraint failed on field: ${field}`,
      },
    ], error);
  }

  private static transactionConflict(error: any) {
    const msg = error?.message || "A transaction conflict occurred.";
    return new PrismaErrors("Transaction conflict", 409, [
      { code: "TRANSACTION_CONFLICT", message: msg },
    ], error);
  }

  static code(error: any) {
    switch (error.code) {
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
        return this.transactionConflict(error);
      default:
        throw new Error(`Unknown Prisma error code: ${error.code}`);
    }
  }
}
