import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Users Service
 * Business logic for user management
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find user by ID
   */
  async findById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        preferredCurrency: true,
        timezone: true,
        language: true,
        onboardingCompleted: true,
        onboardingStep: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        preferredCurrency: true,
        timezone: true,
        language: true,
        onboardingCompleted: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Update onboarding status
   */
  async updateOnboarding(userId: string, completed: boolean, step?: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        onboardingCompleted: completed,
        ...(step !== undefined && { onboardingStep: step }),
      },
    });
  }

  /**
   * Delete user account
   */
  async deleteAccount(userId: string) {
    // Soft delete or hard delete based on requirements
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Account successfully deleted' };
  }
}
