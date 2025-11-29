import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Public decorator
 * Marks a route as public (bypasses JWT authentication)
 *
 * @example
 * @Public()
 * @Get('health')
 * healthCheck() { ... }
 */
export function Public(): MethodDecorator {
  return SetMetadata(IS_PUBLIC_KEY, true);
}
