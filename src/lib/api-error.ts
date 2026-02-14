import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_ERROR",
    details?: any,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = "AppError";
  }
}

export function createErrorResponse(error: unknown) {
  console.error("[API Error]", error);

  let statusCode = 500;
  let message = "An unexpected error occurred.";
  let code = "INTERNAL_SERVER_ERROR";
  let details: any = null;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code;
    details = error.details;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    code = "VALIDATION_ERROR";
    details = error.flatten();
  } else if (error instanceof Error) {
    message = error.message;
    // Prisma specific error handling could go here
    if (message.includes("Unique constraint")) {
      statusCode = 409;
      code = "CONFLICT";
      message = "Resource already exists.";
    }
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
        ...(process.env.NODE_ENV === "development" && error instanceof Error
          ? { stack: error.stack }
          : {}),
      },
      timestamp: new Date().toISOString(),
    },
    { status: statusCode },
  );
}
