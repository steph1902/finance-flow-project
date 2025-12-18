import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ThrottlerModule } from '@nestjs/throttler';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: jest.Mocked<AuthService>;

    const mockAuthService = {
        signup: jest.fn(),
        signin: jest.fn(),
        refreshToken: jest.fn(),
        getUserProfile: jest.fn(),
        logout: jest.fn(),
    };

    const mockAuthResponse = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
        },
    };

    const mockUserProfile = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        preferredCurrency: 'USD',
        timezone: 'UTC',
        language: 'en',
        onboardingCompleted: true,
        createdAt: new Date(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
            ],
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get(AuthService) as jest.Mocked<AuthService>;
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('signup', () => {
        const signupDto = {
            email: 'newuser@example.com',
            password: 'Password123!',
            name: 'New User',
        };

        it('should successfully register a new user', async () => {
            mockAuthService.signup.mockResolvedValue(mockAuthResponse);

            const result = await controller.signup(signupDto);

            expect(authService.signup).toHaveBeenCalledWith(signupDto);
            expect(result).toEqual(mockAuthResponse);
        });

        it('should pass through service errors', async () => {
            mockAuthService.signup.mockRejectedValue(new Error('Email already exists'));

            await expect(controller.signup(signupDto)).rejects.toThrow('Email already exists');
        });
    });

    describe('signin', () => {
        const signinDto = {
            email: 'test@example.com',
            password: 'Password123!',
        };

        it('should successfully authenticate user', async () => {
            mockAuthService.signin.mockResolvedValue(mockAuthResponse);

            const result = await controller.signin(signinDto);

            expect(authService.signin).toHaveBeenCalledWith(signinDto);
            expect(result).toEqual(mockAuthResponse);
        });

        it('should pass through authentication errors', async () => {
            mockAuthService.signin.mockRejectedValue(new Error('Invalid credentials'));

            await expect(controller.signin(signinDto)).rejects.toThrow('Invalid credentials');
        });
    });

    describe('refresh', () => {
        const refreshTokenDto = {
            refreshToken: 'valid-refresh-token',
        };

        it('should successfully refresh tokens', async () => {
            mockAuthService.refreshToken.mockResolvedValue(mockAuthResponse);

            const result = await controller.refresh(refreshTokenDto);

            expect(authService.refreshToken).toHaveBeenCalledWith(refreshTokenDto.refreshToken);
            expect(result).toEqual(mockAuthResponse);
        });

        it('should pass through invalid refresh token errors', async () => {
            mockAuthService.refreshToken.mockRejectedValue(new Error('Invalid refresh token'));

            await expect(controller.refresh(refreshTokenDto)).rejects.toThrow('Invalid refresh token');
        });
    });

    describe('getProfile', () => {
        const jwtPayload = { sub: 'user-123', email: 'test@example.com' };

        it('should return user profile', async () => {
            mockAuthService.getUserProfile.mockResolvedValue(mockUserProfile);

            const result = await controller.getProfile(jwtPayload);

            expect(authService.getUserProfile).toHaveBeenCalledWith('user-123');
            expect(result).toEqual(mockUserProfile);
        });

        it('should pass through profile fetch errors', async () => {
            mockAuthService.getUserProfile.mockRejectedValue(new Error('User not found'));

            await expect(controller.getProfile(jwtPayload)).rejects.toThrow('User not found');
        });
    });

    describe('logout', () => {
        const userId = 'user-123';

        it('should successfully logout user', async () => {
            mockAuthService.logout.mockResolvedValue({ message: 'Successfully logged out' });

            const result = await controller.logout(userId);

            expect(authService.logout).toHaveBeenCalledWith(userId);
            expect(result).toEqual({ message: 'Successfully logged out' });
        });
    });
});
