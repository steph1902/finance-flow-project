import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '@/database/prisma.service';
import { SignupDto, SigninDto } from './dto/auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AnalyticsService } from '@/common/analytics/analytics.service';

/**
 * Authentication Service
 * Handles user authentication logic, JWT generation, and token management
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly analyticsService: AnalyticsService,
  ) { }

  /**
   * Register a new user
   */
  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    const { email, password, name } = signupDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password with 10 rounds for balance of security and performance
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Log registration without exposing email
    this.logger.log(`New user registered with ID: ${user.id}`);

    // Generate tokens
    return this.generateTokenResponse(user.id, user.email);
  }

  /**
   * Authenticate user
   */
  async signin(signinDto: SigninDto): Promise<AuthResponseDto> {
    const { email, password } = signinDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Log sign-in without exposing email
    this.logger.log(`User signed in with ID: ${user.id}`);

    // Track demo account login
    if (user.email === 'demo@financeflow.com') {
      await this.analyticsService.trackEvent({
        userId: user.id,
        sessionId: user.id + '-' + Date.now(),
        isDemo: true,
        eventType: 'login',
        eventName: 'Demo Account Login',
      });
    }

    // Generate tokens
    return this.generateTokenResponse(user.id, user.email);
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Verify user still exists
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new tokens
      return this.generateTokenResponse(user.id, user.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string) {
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
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  /**
   * Logout user
   */
  async logout(userId: string) {
    // In a production app, you would invalidate the refresh token here
    // For now, we'll just log the action
    this.logger.log(`User logged out: ${userId}`);
    return { message: 'Successfully logged out' };
  }

  /**
   * Validate user for JWT strategy
   */
  async validateUser(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  /**
   * Generate JWT tokens
   */
  private async generateTokenResponse(
    userId: string,
    email: string,
  ): Promise<AuthResponseDto> {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.configService.get<string>('JWT_EXPIRATION') || '1h',
      tokenType: 'Bearer',
    };
  }
}
