/**
 * Utility function to safely extract error messages
 * Used for proper error handling with unknown types
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    return String(error);
}

/**
 * Check if value is an Error instance
 */
export function isError(error: unknown): error is Error {
    return error instanceof Error;
}
