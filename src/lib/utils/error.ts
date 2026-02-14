/**
 * Extracts a readable error message from unknown error types
 * @param error - The error to extract message from
 * @returns A string error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown error occurred";
}

/**
 * Checks if an error is a not found error
 * @param error - The error to check
 * @returns True if error message is "NOT_FOUND"
 */
export function isNotFoundError(error: unknown): boolean {
  return error instanceof Error && error.message === "NOT_FOUND";
}
