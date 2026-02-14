import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../guards/roles.guard';

export const ROLES_KEY = 'roles';

/**
 * Roles decorator
 * Specifies which roles can access a route
 *
 * @example
 * @Roles(UserRole.ADMIN)
 * @Delete(':id')
 * deleteUser(@Param('id') id: string) { ... }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
