/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/platform-fastify");

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("@nestjs/swagger");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("@fastify/helmet");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("@fastify/compress");

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(5);
const schedule_1 = __webpack_require__(9);
const throttler_1 = __webpack_require__(10);
const bullmq_1 = __webpack_require__(11);
const core_1 = __webpack_require__(1);
const Joi = __webpack_require__(12);
const database_module_1 = __webpack_require__(13);
const common_module_1 = __webpack_require__(16);
const auth_module_1 = __webpack_require__(18);
const users_module_1 = __webpack_require__(33);
const transactions_module_1 = __webpack_require__(37);
const budgets_module_1 = __webpack_require__(47);
const recurring_module_1 = __webpack_require__(59);
const goals_module_1 = __webpack_require__(60);
const analytics_module_1 = __webpack_require__(61);
const notifications_module_1 = __webpack_require__(62);
const admin_module_1 = __webpack_require__(70);
const analytics_module_2 = __webpack_require__(72);
const jwt_auth_guard_1 = __webpack_require__(51);
const throttler_2 = __webpack_require__(10);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                validationSchema: Joi.object({
                    NODE_ENV: Joi.string()
                        .valid('development', 'production', 'test')
                        .default('development'),
                    PORT: Joi.number().default(3001),
                    DATABASE_URL: Joi.string().required(),
                    JWT_SECRET: Joi.string().required(),
                    JWT_EXPIRATION: Joi.string().default('1h'),
                    JWT_REFRESH_SECRET: Joi.string().required(),
                    JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),
                    REDIS_HOST: Joi.string().default('localhost'),
                    REDIS_PORT: Joi.number().default(6379),
                    REDIS_PASSWORD: Joi.string().allow('').optional(),
                    RATE_LIMIT_TTL: Joi.number().default(60),
                    RATE_LIMIT_MAX: Joi.number().default(100),
                }),
            }),
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            bullmq_1.BullModule.forRootAsync({
                useFactory: () => {
                    const config = {
                        connection: {
                            host: process.env.REDIS_HOST || 'localhost',
                            port: parseInt(process.env.REDIS_PORT || '6379', 10),
                        },
                    };
                    const password = process.env.REDIS_PASSWORD;
                    if (password) {
                        config.connection.password = password;
                    }
                    return config;
                },
            }),
            database_module_1.DatabaseModule,
            common_module_1.CommonModule,
            analytics_module_2.AnalyticsModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            transactions_module_1.TransactionsModule,
            budgets_module_1.BudgetsModule,
            recurring_module_1.RecurringModule,
            goals_module_1.GoalsModule,
            analytics_module_1.AnalyticsModule,
            notifications_module_1.NotificationsModule,
            admin_module_1.AdminModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_2.ThrottlerGuard,
            },
        ],
    })
], AppModule);


/***/ }),
/* 9 */
/***/ ((module) => {

module.exports = require("@nestjs/schedule");

/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("@nestjs/throttler");

/***/ }),
/* 11 */
/***/ ((module) => {

module.exports = require("@nestjs/bullmq");

/***/ }),
/* 12 */
/***/ ((module) => {

module.exports = require("joi");

/***/ }),
/* 13 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DatabaseModule = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], DatabaseModule);


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrismaService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const common_1 = __webpack_require__(3);
const client_1 = __webpack_require__(15);
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    constructor() {
        super({
            log: [
                { emit: 'event', level: 'query' },
                { emit: 'event', level: 'error' },
                { emit: 'event', level: 'warn' },
            ],
            errorFormat: 'pretty',
        });
        this.logger = new common_1.Logger(PrismaService_1.name);
        if (process.env.NODE_ENV === 'development') {
            this.$on('query', (e) => {
                this.logger.debug(`Query: ${e.query}`);
                this.logger.debug(`Duration: ${e.duration}ms`);
            });
        }
        this.$on('error', (e) => {
            this.logger.error('Prisma Error:', e);
        });
        this.$on('warn', (e) => {
            this.logger.warn('Prisma Warning:', e);
        });
    }
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('✅ Database connected successfully');
        }
        catch (error) {
            this.logger.error('❌ Database connection failed', error);
            throw error;
        }
    }
    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('🔌 Database disconnected');
    }
    async cleanDatabase() {
        if (process.env.NODE_ENV !== 'test') {
            throw new Error('cleanDatabase can only be used in test environment');
        }
        const models = Reflect.ownKeys(this).filter((key) => typeof key === 'string' && key[0] !== '_');
        return Promise.all(models.map((modelKey) => {
            const model = this[modelKey];
            if (model && typeof model === 'object' && 'deleteMany' in model) {
                return model.deleteMany();
            }
        }));
    }
    async executeTransaction(callback, maxRetries = 3) {
        let lastError = null;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return (await this.$transaction(callback));
            }
            catch (error) {
                lastError = error;
                this.logger.warn(`Transaction attempt ${attempt}/${maxRetries} failed: ${lastError.message}`);
                if (attempt < maxRetries) {
                    await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 100));
                }
            }
        }
        this.logger.error('Transaction failed after all retries');
        throw lastError;
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);


/***/ }),
/* 15 */
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommonModule = void 0;
const common_1 = __webpack_require__(3);
const jwt_1 = __webpack_require__(17);
const config_1 = __webpack_require__(5);
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const secret = configService.get('JWT_SECRET');
                    if (!secret) {
                        throw new Error('JWT_SECRET is required');
                    }
                    return {
                        secret,
                        signOptions: {
                            expiresIn: configService.get('JWT_EXPIRATION') || '1h',
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
        ],
        exports: [jwt_1.JwtModule],
    })
], CommonModule);


/***/ }),
/* 17 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(3);
const passport_1 = __webpack_require__(19);
const jwt_1 = __webpack_require__(17);
const config_1 = __webpack_require__(5);
const auth_controller_1 = __webpack_require__(20);
const auth_service_1 = __webpack_require__(21);
const jwt_strategy_1 = __webpack_require__(29);
const local_strategy_1 = __webpack_require__(31);
const users_module_1 = __webpack_require__(33);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRATION') || '1h',
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, local_strategy_1.LocalStrategy],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 19 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(4);
const auth_service_1 = __webpack_require__(21);
const auth_dto_1 = __webpack_require__(24);
const auth_response_dto_1 = __webpack_require__(26);
const public_decorator_1 = __webpack_require__(27);
const current_user_decorator_1 = __webpack_require__(28);
const throttler_1 = __webpack_require__(10);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signup(signupDto) {
        return this.authService.signup(signupDto);
    }
    async signin(signinDto) {
        return this.authService.signin(signinDto);
    }
    async refresh(refreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto.refreshToken);
    }
    async getProfile(user) {
        return this.authService.getUserProfile(user.sub);
    }
    async logout(userId) {
        return this.authService.logout(userId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('signup'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User successfully registered',
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof auth_dto_1.SignupDto !== "undefined" && auth_dto_1.SignupDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], AuthController.prototype, "signup", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('signin'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Authenticate user and get JWT token' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User successfully authenticated',
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof auth_dto_1.SigninDto !== "undefined" && auth_dto_1.SigninDto) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], AuthController.prototype, "signin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token using refresh token' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token successfully refreshed',
        type: auth_response_dto_1.AuthResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid refresh token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof auth_dto_1.RefreshTokenDto !== "undefined" && auth_dto_1.RefreshTokenDto) === "function" ? _f : Object]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User profile retrieved' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Logout user and invalidate tokens' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully logged out' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(3);
const jwt_1 = __webpack_require__(17);
const config_1 = __webpack_require__(5);
const bcrypt = __webpack_require__(22);
const prisma_service_1 = __webpack_require__(14);
const analytics_service_1 = __webpack_require__(23);
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwtService, configService, analyticsService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.analyticsService = analyticsService;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    async signup(signupDto) {
        const { email, password, name } = signupDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        this.logger.log(`New user registered with ID: ${user.id}`);
        return this.generateTokenResponse(user.id, user.email);
    }
    async signin(signinDto) {
        const { email, password } = signinDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        this.logger.log(`User signed in with ID: ${user.id}`);
        if (user.email === 'demo@financeflow.com') {
            await this.analyticsService.trackEvent({
                userId: user.id,
                sessionId: user.id + '-' + Date.now(),
                isDemo: true,
                eventType: 'login',
                eventName: 'Demo Account Login',
            });
        }
        return this.generateTokenResponse(user.id, user.email);
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            return this.generateTokenResponse(user.id, user.email);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async getUserProfile(userId) {
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
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async logout(userId) {
        this.logger.log(`User logged out: ${userId}`);
        return { message: 'Successfully logged out' };
    }
    async validateUser(payload) {
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
    async generateTokenResponse(userId, email) {
        const payload = {
            sub: userId,
            email,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
        });
        return {
            accessToken,
            refreshToken,
            expiresIn: this.configService.get('JWT_EXPIRATION') || '1h',
            tokenType: 'Bearer',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _c : Object, typeof (_d = typeof analytics_service_1.AnalyticsService !== "undefined" && analytics_service_1.AnalyticsService) === "function" ? _d : Object])
], AuthService);


/***/ }),
/* 22 */
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AnalyticsService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AnalyticsService_1.name);
    }
    async trackEvent(data, geo) {
        try {
            await this.prisma.analyticsEvent.create({
                data: {
                    ...data,
                    ...geo,
                },
            });
        }
        catch (error) {
            this.logger.error(`Failed to track event: ${error.message}`, error.stack);
        }
    }
    async getGeolocation(ipAddress) {
        try {
            if (!ipAddress || ipAddress === '::1' || ipAddress.startsWith('127.') || ipAddress.startsWith('192.168.')) {
                return {};
            }
            const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,country,city,regionName,timezone`);
            if (!response.ok) {
                return {};
            }
            const data = await response.json();
            if (data.status === 'success') {
                return {
                    country: data.country,
                    city: data.city,
                    region: data.regionName,
                    timezone: data.timezone,
                };
            }
            return {};
        }
        catch (error) {
            this.logger.warn(`Failed to get geolocation for ${ipAddress}: ${error.message}`);
            return {};
        }
    }
    async getDemoAnalytics(startDate, endDate) {
        const where = {
            isDemo: true,
            ...(startDate && endDate ? {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            } : {}),
        };
        const [totalEvents, uniqueSessions, eventsByType, eventsByCountry, recentEvents, loginEvents,] = await Promise.all([
            this.prisma.analyticsEvent.count({ where }),
            this.prisma.analyticsEvent.findMany({
                where,
                select: { sessionId: true },
                distinct: ['sessionId'],
            }),
            this.prisma.analyticsEvent.groupBy({
                by: ['eventType'],
                where,
                _count: true,
                orderBy: { _count: { eventType: 'desc' } },
            }),
            this.prisma.analyticsEvent.groupBy({
                by: ['country'],
                where: { ...where, country: { not: null } },
                _count: true,
                orderBy: { _count: { country: 'desc' } },
            }),
            this.prisma.analyticsEvent.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: 50,
            }),
            this.prisma.analyticsEvent.findMany({
                where: { ...where, eventType: 'login' },
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        return {
            summary: {
                totalEvents,
                uniqueSessions: uniqueSessions.length,
                loginCount: loginEvents.length,
            },
            eventsByType: eventsByType.map((e) => ({
                type: e.eventType,
                count: e._count,
            })),
            eventsByCountry: eventsByCountry.map((e) => ({
                country: e.country,
                count: e._count,
            })),
            recentEvents: recentEvents.map((e) => ({
                id: e.id,
                timestamp: e.createdAt,
                eventType: e.eventType,
                eventName: e.eventName,
                page: e.page,
                country: e.country,
                city: e.city,
                metadata: e.metadata,
            })),
            sessions: loginEvents.map((e) => ({
                sessionId: e.sessionId,
                timestamp: e.createdAt,
                country: e.country,
                city: e.city,
                userAgent: e.userAgent,
            })),
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AnalyticsService);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RefreshTokenDto = exports.SigninDto = exports.SignupDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(4);
class SignupDto {
}
exports.SignupDto = SignupDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], SignupDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], SignupDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SecurePass123!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    }),
    __metadata("design:type", String)
], SignupDto.prototype, "password", void 0);
class SigninDto {
}
exports.SigninDto = SigninDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SigninDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'SecurePass123!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], SigninDto.prototype, "password", void 0);
class RefreshTokenDto {
}
exports.RefreshTokenDto = RefreshTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RefreshTokenDto.prototype, "refreshToken", void 0);


/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthResponseDto = void 0;
const swagger_1 = __webpack_require__(4);
class AuthResponseDto {
}
exports.AuthResponseDto = AuthResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "accessToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "refreshToken", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "expiresIn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], AuthResponseDto.prototype, "tokenType", void 0);


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IS_PUBLIC_KEY = void 0;
exports.Public = Public;
const common_1 = __webpack_require__(3);
exports.IS_PUBLIC_KEY = 'isPublic';
function Public() {
    return (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
}


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurrentUser = void 0;
const common_1 = __webpack_require__(3);
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
});


/***/ }),
/* 29 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const common_1 = __webpack_require__(3);
const passport_1 = __webpack_require__(19);
const passport_jwt_1 = __webpack_require__(30);
const config_1 = __webpack_require__(5);
const auth_service_1 = __webpack_require__(21);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    constructor(authService, configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
        this.authService = authService;
    }
    async validate(payload) {
        const user = await this.authService.validateUser(payload);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        return user;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], JwtStrategy);


/***/ }),
/* 30 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const common_1 = __webpack_require__(3);
const passport_1 = __webpack_require__(19);
const passport_local_1 = __webpack_require__(32);
const auth_service_1 = __webpack_require__(21);
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy, 'local') {
    constructor(authService) {
        super({
            usernameField: 'email',
            passwordField: 'password',
        });
        this.authService = authService;
    }
    async validate(email, password) {
        const user = await this.authService.signin({ email, password });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return user;
    }
};
exports.LocalStrategy = LocalStrategy;
exports.LocalStrategy = LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], LocalStrategy);


/***/ }),
/* 32 */
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(3);
const users_controller_1 = __webpack_require__(34);
const users_service_1 = __webpack_require__(35);
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(4);
const users_service_1 = __webpack_require__(35);
const update_user_dto_1 = __webpack_require__(36);
const current_user_decorator_1 = __webpack_require__(28);
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getCurrentUser(userId) {
        return this.usersService.findById(userId);
    }
    async updateProfile(userId, updateUserDto) {
        return this.usersService.updateProfile(userId, updateUserDto);
    }
    async deleteAccount(userId) {
        return this.usersService.deleteAccount(userId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User profile retrieved' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Put)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof update_user_dto_1.UpdateUserDto !== "undefined" && update_user_dto_1.UpdateUserDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Delete)('me'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user account' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Account deleted successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteAccount", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(userId) {
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
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async updateProfile(userId, updateUserDto) {
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
    async updateOnboarding(userId, completed, step) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                onboardingCompleted: completed,
                ...(step !== undefined && { onboardingStep: step }),
            },
        });
    }
    async deleteAccount(userId) {
        await this.prisma.user.delete({
            where: { id: userId },
        });
        return { message: 'Account successfully deleted' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], UsersService);


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateUserDto = void 0;
const class_validator_1 = __webpack_require__(25);
const swagger_1 = __webpack_require__(4);
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "preferredCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "language", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "onboardingCompleted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateUserDto.prototype, "onboardingStep", void 0);


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionsModule = void 0;
const common_1 = __webpack_require__(3);
const bullmq_1 = __webpack_require__(11);
const transactions_controller_1 = __webpack_require__(38);
const transactions_service_1 = __webpack_require__(39);
const transactions_repository_1 = __webpack_require__(41);
const budget_repository_1 = __webpack_require__(42);
const ai_categorization_processor_1 = __webpack_require__(45);
let TransactionsModule = class TransactionsModule {
};
exports.TransactionsModule = TransactionsModule;
exports.TransactionsModule = TransactionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.registerQueue({
                name: 'ai-categorization',
            }),
        ],
        controllers: [transactions_controller_1.TransactionsController],
        providers: [
            transactions_service_1.TransactionsService,
            transactions_repository_1.TransactionsRepository,
            budget_repository_1.BudgetRepository,
            ai_categorization_processor_1.AiCategorizationProcessor,
        ],
        exports: [transactions_service_1.TransactionsService, transactions_repository_1.TransactionsRepository],
    })
], TransactionsModule);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionsController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(4);
const transactions_service_1 = __webpack_require__(39);
const dto_1 = __webpack_require__(43);
const current_user_decorator_1 = __webpack_require__(28);
let TransactionsController = class TransactionsController {
    constructor(transactionsService) {
        this.transactionsService = transactionsService;
    }
    async create(userId, createTransactionDto) {
        return this.transactionsService.create(userId, createTransactionDto);
    }
    async findAll(userId, query) {
        return this.transactionsService.findAll(userId, query);
    }
    async findOne(userId, id) {
        return this.transactionsService.findOne(userId, id);
    }
    async update(userId, id, updateTransactionDto) {
        return this.transactionsService.update(userId, id, updateTransactionDto);
    }
    async remove(userId, id) {
        return this.transactionsService.softDelete(userId, id);
    }
    async getStats(userId, startDate, endDate) {
        return this.transactionsService.getStats(userId, startDate, endDate);
    }
    async bulkCreate(userId, transactions) {
        return this.transactionsService.bulkCreate(userId, transactions);
    }
    async exportCsv(userId, query) {
        return this.transactionsService.exportToCsv(userId, query);
    }
};
exports.TransactionsController = TransactionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new transaction' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Transaction created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof dto_1.CreateTransactionDto !== "undefined" && dto_1.CreateTransactionDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all transactions' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'type', required: false, enum: ['INCOME', 'EXPENSE'] }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transactions retrieved successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof dto_1.QueryTransactionDto !== "undefined" && dto_1.QueryTransactionDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transaction found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transaction not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update transaction' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transaction updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transaction not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, typeof (_d = typeof dto_1.UpdateTransactionDto !== "undefined" && dto_1.UpdateTransactionDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete transaction' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Transaction deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Transaction not found' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('stats/summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction statistics' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: Date }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistics retrieved successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object, typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk create transactions' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Transactions created successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    (0, swagger_1.ApiOperation)({ summary: 'Export transactions to CSV' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CSV generated successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_g = typeof dto_1.QueryTransactionDto !== "undefined" && dto_1.QueryTransactionDto) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], TransactionsController.prototype, "exportCsv", null);
exports.TransactionsController = TransactionsController = __decorate([
    (0, swagger_1.ApiTags)('transactions'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [typeof (_a = typeof transactions_service_1.TransactionsService !== "undefined" && transactions_service_1.TransactionsService) === "function" ? _a : Object])
], TransactionsController);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TransactionsService_1;
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionsService = void 0;
const common_1 = __webpack_require__(3);
const client_1 = __webpack_require__(15);
const bullmq_1 = __webpack_require__(11);
const bullmq_2 = __webpack_require__(40);
const prisma_service_1 = __webpack_require__(14);
const transactions_repository_1 = __webpack_require__(41);
const budget_repository_1 = __webpack_require__(42);
let TransactionsService = TransactionsService_1 = class TransactionsService {
    constructor(prisma, repository, budgetRepository, aiQueue) {
        this.prisma = prisma;
        this.repository = repository;
        this.budgetRepository = budgetRepository;
        this.aiQueue = aiQueue;
        this.logger = new common_1.Logger(TransactionsService_1.name);
    }
    async create(userId, dto) {
        this.logger.log(`Creating transaction for user ${userId}`);
        const data = {
            ...dto,
            amount: new client_1.Prisma.Decimal(dto.amount),
            userId,
        };
        const transaction = await this.repository.create(data);
        if (dto.type === client_1.TransactionType.EXPENSE) {
            await this.updateBudgetSpent(userId, dto.category, transaction.date, data.amount);
            await this.checkBudgetAlerts(userId, dto.category, transaction.date);
        }
        if (!dto.category || dto.category === 'Other' || dto.category === 'Uncategorized') {
            await this.queueAICategorization(transaction);
        }
        return this.serializeTransaction(transaction);
    }
    async queueAICategorization(transaction) {
        try {
            await this.aiQueue.add('categorize-transaction', {
                transactionId: transaction.id,
                userId: transaction.userId,
                description: transaction.description || 'Transaction',
                amount: Number(transaction.amount),
                type: transaction.type,
            }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 2000,
                },
                removeOnComplete: true,
                removeOnFail: false,
            });
            this.logger.log(`Queued AI categorization for transaction ${transaction.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to queue AI categorization for transaction ${transaction.id}`, error instanceof Error ? error.stack : String(error));
        }
    }
    async findAll(userId, query) {
        const { page = 1, limit = 10, type, category, startDate, endDate, search, sortBy = 'date', sortOrder = 'desc', } = query;
        const safeLimit = Math.min(limit, 100);
        const skip = (page - 1) * safeLimit;
        const where = {
            userId,
            deletedAt: null,
            ...(type && { type }),
            ...(category && { category }),
            ...(startDate || endDate
                ? {
                    date: {
                        ...(startDate && { gte: startDate }),
                        ...(endDate && { lte: endDate }),
                    },
                }
                : {}),
            ...(search && {
                OR: [
                    { description: { contains: search, mode: 'insensitive' } },
                    { category: { contains: search, mode: 'insensitive' } },
                    { notes: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [transactions, total] = await Promise.all([
            this.repository.findMany({
                where,
                skip,
                take: safeLimit,
                orderBy: { [sortBy]: sortOrder },
            }),
            this.repository.count(where),
        ]);
        return {
            data: transactions.map(this.serializeTransaction),
            meta: {
                total,
                page,
                limit: safeLimit,
                totalPages: Math.ceil(total / safeLimit),
            },
        };
    }
    async findOne(userId, id) {
        const transaction = await this.repository.findOne({
            where: {
                id,
                userId,
                deletedAt: null,
            },
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        return this.serializeTransaction(transaction);
    }
    async update(userId, id, dto) {
        const existing = await this.repository.findOne({
            where: { id, userId, deletedAt: null },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        const data = {
            ...dto,
            ...(dto.amount && { amount: new client_1.Prisma.Decimal(dto.amount) }),
        };
        const transaction = await this.repository.update({
            where: { id },
            data,
        });
        const oldIsExpense = existing.type === client_1.TransactionType.EXPENSE;
        const newIsExpense = (dto.type ?? existing.type) === client_1.TransactionType.EXPENSE;
        const oldAmount = existing.amount;
        const newAmount = dto.amount ? new client_1.Prisma.Decimal(dto.amount) : oldAmount;
        const oldCategory = existing.category;
        const newCategory = dto.category ?? oldCategory;
        const newDate = dto.date ?? existing.date;
        if (oldIsExpense && newIsExpense) {
            if (oldCategory === newCategory) {
                const difference = newAmount.minus(oldAmount);
                if (!difference.isZero()) {
                    await this.updateBudgetSpent(userId, newCategory, newDate, difference);
                    await this.checkBudgetAlerts(userId, newCategory, newDate);
                }
            }
            else {
                await this.updateBudgetSpent(userId, oldCategory, existing.date, oldAmount.negated());
                await this.updateBudgetSpent(userId, newCategory, newDate, newAmount);
                await this.checkBudgetAlerts(userId, newCategory, newDate);
            }
        }
        else if (oldIsExpense && !newIsExpense) {
            await this.updateBudgetSpent(userId, oldCategory, existing.date, oldAmount.negated());
        }
        else if (!oldIsExpense && newIsExpense) {
            await this.updateBudgetSpent(userId, newCategory, newDate, newAmount);
            await this.checkBudgetAlerts(userId, newCategory, newDate);
        }
        this.logger.log(`Updated transaction ${id}`);
        return this.serializeTransaction(transaction);
    }
    async softDelete(userId, id) {
        const transaction = await this.repository.findOne({
            where: { id, userId, deletedAt: null },
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Transaction not found');
        }
        await this.repository.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        if (transaction.type === client_1.TransactionType.EXPENSE) {
            await this.updateBudgetSpent(userId, transaction.category, transaction.date, transaction.amount.negated());
        }
        this.logger.log(`Soft deleted transaction ${id}`);
        return { message: 'Transaction deleted successfully' };
    }
    async getStats(userId, startDate, endDate) {
        const where = {
            userId,
            deletedAt: null,
            ...(startDate || endDate
                ? {
                    date: {
                        ...(startDate && { gte: startDate }),
                        ...(endDate && { lte: endDate }),
                    },
                }
                : {}),
        };
        const [totalIncome, totalExpense, transactionCount, categoryBreakdown] = await Promise.all([
            this.repository.aggregate({
                where: { ...where, type: client_1.TransactionType.INCOME },
                _sum: { amount: true },
            }),
            this.repository.aggregate({
                where: { ...where, type: client_1.TransactionType.EXPENSE },
                _sum: { amount: true },
            }),
            this.repository.count(where),
            this.repository.groupBy({
                by: ['category', 'type'],
                where,
                _sum: { amount: true },
                _count: true,
            }),
        ]);
        const income = Number(totalIncome._sum?.amount ?? 0);
        const expense = Number(totalExpense._sum?.amount ?? 0);
        return {
            totalIncome: income,
            totalExpense: expense,
            netSavings: income - expense,
            transactionCount,
            categoryBreakdown: categoryBreakdown.map((item) => ({
                category: item.category,
                type: item.type,
                total: Number(item._sum?.amount ?? 0),
                count: item._count,
            })),
        };
    }
    async bulkCreate(userId, transactions) {
        if (transactions.length === 0) {
            throw new common_1.BadRequestException('No transactions provided');
        }
        if (transactions.length > 1000) {
            throw new common_1.BadRequestException('Maximum 1000 transactions allowed per bulk operation');
        }
        const data = transactions.map((dto) => ({
            ...dto,
            amount: new client_1.Prisma.Decimal(dto.amount),
            userId,
        }));
        const result = await this.repository.createMany(data);
        this.logger.log(`Bulk created ${result.count} transactions for user ${userId}`);
        return {
            message: `${result.count} transactions created successfully`,
            count: result.count,
        };
    }
    async exportToCsv(userId, query) {
        const { data } = await this.findAll(userId, { ...query, limit: 10000 });
        const sanitizeCell = (value) => {
            const str = String(value ?? '');
            if (str.match(/^[=+\-@]/)) {
                return `'${str.replace(/"/g, '""')}`;
            }
            return str.replace(/"/g, '""');
        };
        const headers = ['Date', 'Type', 'Category', 'Amount', 'Description', 'Notes'];
        const rows = data.map((t) => [
            new Date(t.date).toISOString().split('T')[0],
            t.type,
            t.category,
            t.amount.toString(),
            t.description || '',
            t.notes || '',
        ]);
        const csv = [
            headers.join(','),
            ...rows.map((row) => row.map((cell) => `"${sanitizeCell(cell)}"`).join(',')),
        ].join('\n');
        return {
            filename: `transactions_${new Date().toISOString().split('T')[0]}.csv`,
            content: csv,
            mimeType: 'text/csv',
        };
    }
    async updateBudgetSpent(userId, category, date, amount) {
        try {
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const budget = await this.prisma.budget.findFirst({
                where: { userId, category, month, year },
            });
            if (budget) {
                await this.budgetRepository.incrementSpent(budget.id, amount);
                this.logger.log(`Updated budget ${budget.id} spent by ${amount.toString()} for category ${category}`);
            }
            else {
                this.logger.debug(`No budget found for category ${category} in ${month}/${year}`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to update budget spent: ${error.message}`, error.stack);
        }
    }
    async checkBudgetAlerts(userId, category, date) {
        try {
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const budget = await this.prisma.budget.findFirst({
                where: { userId, category, month, year },
            });
            if (!budget || !budget.alertThreshold) {
                return;
            }
            const percentUsed = budget.amount.isZero()
                ? 0
                : budget.spent.dividedBy(budget.amount).times(100).toNumber();
            if (percentUsed >= budget.alertThreshold.toNumber()) {
                const isOverBudget = percentUsed >= 100;
                await this.prisma.notification.create({
                    data: {
                        userId,
                        type: 'BUDGET_ALERT',
                        title: isOverBudget
                            ? `Budget Exceeded: ${category}`
                            : `Budget Alert: ${category}`,
                        message: isOverBudget
                            ? `You have exceeded your ${category} budget by ${(percentUsed - 100).toFixed(1)}%. Spent: $${budget.spent.toNumber()} of $${budget.amount.toNumber()}.`
                            : `You have used ${percentUsed.toFixed(1)}% of your ${category} budget. Spent: $${budget.spent.toNumber()} of $${budget.amount.toNumber()}.`,
                        priority: isOverBudget ? 2 : 1,
                        metadata: {
                            budgetId: budget.id,
                            category,
                            percentUsed,
                            spent: budget.spent.toNumber(),
                            budgeted: budget.amount.toNumber(),
                        },
                    },
                });
                this.logger.log(`Created budget alert for user ${userId}, category ${category}: ${percentUsed.toFixed(1)}%`);
            }
        }
        catch (error) {
            this.logger.error(`Failed to check budget alerts: ${error.message}`, error.stack);
        }
    }
    serializeTransaction(transaction) {
        return {
            ...transaction,
            amount: Number(transaction.amount),
            date: transaction.date.toISOString(),
            createdAt: transaction.createdAt.toISOString(),
            updatedAt: transaction.updatedAt.toISOString(),
        };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = TransactionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, bullmq_1.InjectQueue)('ai-categorization')),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object, typeof (_b = typeof transactions_repository_1.TransactionsRepository !== "undefined" && transactions_repository_1.TransactionsRepository) === "function" ? _b : Object, typeof (_c = typeof budget_repository_1.BudgetRepository !== "undefined" && budget_repository_1.BudgetRepository) === "function" ? _c : Object, typeof (_d = typeof bullmq_2.Queue !== "undefined" && bullmq_2.Queue) === "function" ? _d : Object])
], TransactionsService);


/***/ }),
/* 40 */
/***/ ((module) => {

module.exports = require("bullmq");

/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionsRepository = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
let TransactionsRepository = class TransactionsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.transaction.create({ data });
    }
    async findMany(params) {
        return this.prisma.transaction.findMany(params);
    }
    async findOne(params) {
        return this.prisma.transaction.findFirst(params);
    }
    async update(params) {
        return this.prisma.transaction.update(params);
    }
    async delete(where) {
        return this.prisma.transaction.delete({ where });
    }
    async count(where) {
        return this.prisma.transaction.count({ where });
    }
    async aggregate(params) {
        return this.prisma.transaction.aggregate(params);
    }
    async groupBy(params) {
        return this.prisma.transaction.groupBy(params);
    }
    async createMany(data) {
        return this.prisma.transaction.createMany({
            data,
            skipDuplicates: true,
        });
    }
};
exports.TransactionsRepository = TransactionsRepository;
exports.TransactionsRepository = TransactionsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], TransactionsRepository);


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BudgetRepository = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
let BudgetRepository = class BudgetRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.budget.create({ data });
    }
    async findById(id, userId) {
        return this.prisma.budget.findFirst({
            where: { id, userId },
        });
    }
    async findAll(userId, query) {
        const where = { userId };
        if (query.category) {
            where.category = query.category;
        }
        if (query.startDate || query.endDate) {
            const startMonth = query.startDate ? query.startDate.getMonth() + 1 : undefined;
            const startYear = query.startDate ? query.startDate.getFullYear() : undefined;
            const endMonth = query.endDate ? query.endDate.getMonth() + 1 : undefined;
            const endYear = query.endDate ? query.endDate.getFullYear() : undefined;
            where.AND = [];
            if (startYear && startMonth) {
                where.AND.push({
                    OR: [
                        { year: { gt: startYear } },
                        { year: startYear, month: { gte: startMonth } }
                    ]
                });
            }
            if (endYear && endMonth) {
                where.AND.push({
                    OR: [
                        { year: { lt: endYear } },
                        { year: endYear, month: { lte: endMonth } }
                    ]
                });
            }
        }
        return this.prisma.budget.findMany({
            where,
            orderBy: { year: 'desc', month: 'desc' },
        });
    }
    async findOverlapping(userId, category, startDate, endDate) {
        const startMonth = startDate.getMonth() + 1;
        const startYear = startDate.getFullYear();
        const endMonth = endDate.getMonth() + 1;
        const endYear = endDate.getFullYear();
        return this.prisma.budget.findMany({
            where: {
                userId,
                category,
                OR: [
                    {
                        AND: [
                            { year: startYear, month: { gte: startMonth } },
                            { year: startYear, month: { lte: endMonth } }
                        ]
                    },
                    {
                        AND: [
                            { year: endYear, month: { gte: startMonth } },
                            { year: endYear, month: { lte: endMonth } }
                        ]
                    },
                    {
                        AND: [
                            { year: startYear, month: { lte: startMonth } },
                            { year: endYear, month: { gte: endMonth } }
                        ]
                    },
                ],
            },
        });
    }
    async update(id, data) {
        return this.prisma.budget.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return this.prisma.budget.delete({
            where: { id },
        });
    }
    async updateSpent(id, spent) {
        return this.prisma.budget.update({
            where: { id },
            data: { spent },
        });
    }
    async findRolloverCandidates(userId) {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        let prevMonth = currentMonth - 1;
        let prevYear = currentYear;
        if (prevMonth === 0) {
            prevMonth = 12;
            prevYear = currentYear - 1;
        }
        return this.prisma.budget.findMany({
            where: {
                userId,
                rollover: true,
                month: prevMonth,
                year: prevYear,
            },
        });
    }
    async incrementSpent(id, amount) {
        return this.prisma.budget.update({
            where: { id },
            data: {
                spent: {
                    increment: amount,
                },
            },
        });
    }
};
exports.BudgetRepository = BudgetRepository;
exports.BudgetRepository = BudgetRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], BudgetRepository);


/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.QueryTransactionDto = exports.UpdateTransactionDto = exports.CreateTransactionDto = void 0;
const class_validator_1 = __webpack_require__(25);
const class_transformer_1 = __webpack_require__(44);
const swagger_1 = __webpack_require__(4);
const client_1 = __webpack_require__(15);
class CreateTransactionDto {
}
exports.CreateTransactionDto = CreateTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100.50, description: 'Transaction amount' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Max)(999999.99),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.TransactionType, example: 'EXPENSE' }),
    (0, class_validator_1.IsEnum)(client_1.TransactionType),
    __metadata("design:type", typeof (_a = typeof client_1.TransactionType !== "undefined" && client_1.TransactionType) === "function" ? _a : Object)
], CreateTransactionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Food & Dining' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Lunch at restaurant', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(191),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2024-11-25T12:00:00Z' }),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], CreateTransactionDto.prototype, "date", void 0);
class UpdateTransactionDto {
}
exports.UpdateTransactionDto = UpdateTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.Max)(999999.99),
    __metadata("design:type", Number)
], UpdateTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.TransactionType, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TransactionType),
    __metadata("design:type", typeof (_c = typeof client_1.TransactionType !== "undefined" && client_1.TransactionType) === "function" ? _c : Object)
], UpdateTransactionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(191),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTransactionDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], UpdateTransactionDto.prototype, "date", void 0);
class QueryTransactionDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
        this.sortBy = 'date';
        this.sortOrder = 'desc';
    }
}
exports.QueryTransactionDto = QueryTransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], QueryTransactionDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], QueryTransactionDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.TransactionType, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TransactionType),
    __metadata("design:type", typeof (_e = typeof client_1.TransactionType !== "undefined" && client_1.TransactionType) === "function" ? _e : Object)
], QueryTransactionDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryTransactionDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], QueryTransactionDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", typeof (_g = typeof Date !== "undefined" && Date) === "function" ? _g : Object)
], QueryTransactionDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryTransactionDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: ['date', 'amount'], default: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryTransactionDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: ['asc', 'desc'], default: 'desc' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryTransactionDto.prototype, "sortOrder", void 0);


/***/ }),
/* 44 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 45 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiCategorizationProcessor_1;
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AiCategorizationProcessor = void 0;
const bullmq_1 = __webpack_require__(11);
const common_1 = __webpack_require__(3);
const bullmq_2 = __webpack_require__(40);
const prisma_service_1 = __webpack_require__(14);
const generative_ai_1 = __webpack_require__(46);
let AiCategorizationProcessor = AiCategorizationProcessor_1 = class AiCategorizationProcessor extends bullmq_1.WorkerHost {
    constructor(prisma) {
        super();
        this.prisma = prisma;
        this.logger = new common_1.Logger(AiCategorizationProcessor_1.name);
        this.genAI = null;
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (apiKey) {
            this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
            this.logger.log('Gemini AI initialized for transaction categorization');
        }
        else {
            this.logger.warn('GOOGLE_AI_API_KEY not configured - AI categorization will be skipped');
        }
    }
    async process(job) {
        const { transactionId, description, amount, type } = job.data;
        this.logger.log(`Processing AI categorization for transaction ${transactionId}`);
        try {
            if (!this.genAI) {
                throw new Error('Gemini AI not initialized');
            }
            const { category, confidence } = await this.categorizeTransaction(description, amount, type);
            await this.prisma.transaction.update({
                where: { id: transactionId },
                data: {
                    category,
                },
            });
            await this.prisma.aISuggestion.create({
                data: {
                    userId: job.data.userId,
                    transactionId,
                    suggestionType: 'CATEGORY',
                    suggestedValue: category,
                    confidenceScore: confidence / 100,
                    accepted: true,
                    metadata: {
                        processedAt: new Date().toISOString(),
                        originalDescription: description,
                        aiModel: 'gemini-1.5-flash',
                    },
                },
            });
            this.logger.log(`Successfully categorized transaction ${transactionId} as "${category}" (confidence: ${confidence}%)`);
            return { category, confidence };
        }
        catch (error) {
            this.logger.error(`Failed to categorize transaction ${transactionId}`, error instanceof Error ? error.stack : String(error));
            throw error;
        }
    }
    async categorizeTransaction(description, amount, type) {
        if (!this.genAI) {
            throw new Error('Gemini AI not configured');
        }
        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `You are a financial transaction categorization expert.

Task: Categorize this transaction into ONE of the following standard categories:

**Valid Categories:**
- Housing (rent, mortgage, utilities, repairs)
- Transportation (car payments, gas, public transit, ride-sharing)
- Food (groceries, restaurants, dining out)
- Healthcare (doctors, medicine, insurance)
- Entertainment (movies, games, subscriptions, hobbies)
- Shopping (clothing, electronics, general retail)
- Travel (flights, hotels, vacation expenses)
- Education (tuition, books, courses)
- Insurance (any type of insurance)
- Debt (loan payments, credit card payments)
- Savings (transfers to savings, investments)
- Income (salary, freelance, side income)
- Other (anything that doesn't fit above)

Transaction Details:
- Description: "${description}"
- Amount: $${amount}
- Type: ${type}

IMPORTANT: Respond ONLY with a JSON object in this exact format:
{
  "category": "<one of the valid categories above>",
  "confidence": <number between 0-100>
}

No explanation, no markdown, just the JSON object.`;
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        try {
            const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
            const parsed = JSON.parse(cleanResponse);
            if (!parsed.category || typeof parsed.confidence !== 'number') {
                throw new Error('Invalid AI response format');
            }
            return {
                category: parsed.category,
                confidence: Math.min(100, Math.max(0, parsed.confidence)),
            };
        }
        catch (error) {
            this.logger.error(`Failed to parse AI response: ${response}`, error);
            return this.fallbackCategorization(description, type);
        }
    }
    fallbackCategorization(description, type) {
        const lowercaseDesc = description.toLowerCase();
        const categories = {
            food: ['grocery', 'restaurant', 'cafe', 'food', 'dining', 'uber eats', 'doordash'],
            transportation: ['uber', 'lyft', 'gas', 'fuel', 'parking', 'transit', 'metro'],
            housing: ['rent', 'mortgage', 'utilities', 'electric', 'water', 'internet'],
            shopping: ['amazon', 'store', 'mall', 'retail', 'purchase'],
            entertainment: ['netflix', 'spotify', 'movie', 'game', 'subscription'],
            healthcare: ['pharmacy', 'doctor', 'hospital', 'medical', 'clinic'],
        };
        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some((keyword) => lowercaseDesc.includes(keyword))) {
                return {
                    category: category.charAt(0).toUpperCase() + category.slice(1),
                    confidence: 60,
                };
            }
        }
        return {
            category: type === 'INCOME' ? 'Income' : 'Other',
            confidence: 30,
        };
    }
    onCompleted(job) {
        this.logger.debug(`Categorization job ${job.id} completed`);
    }
    onFailed(job, error) {
        this.logger.error(`Categorization job ${job.id} failed: ${error.message}`);
    }
};
exports.AiCategorizationProcessor = AiCategorizationProcessor;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('completed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof bullmq_2.Job !== "undefined" && bullmq_2.Job) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AiCategorizationProcessor.prototype, "onCompleted", null);
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof bullmq_2.Job !== "undefined" && bullmq_2.Job) === "function" ? _c : Object, typeof (_d = typeof Error !== "undefined" && Error) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], AiCategorizationProcessor.prototype, "onFailed", null);
exports.AiCategorizationProcessor = AiCategorizationProcessor = AiCategorizationProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('ai-categorization', {
        concurrency: 5,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], AiCategorizationProcessor);


/***/ }),
/* 46 */
/***/ ((module) => {

module.exports = require("@google/generative-ai");

/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BudgetsModule = void 0;
const common_1 = __webpack_require__(3);
const budgets_controller_1 = __webpack_require__(48);
const budgets_service_1 = __webpack_require__(49);
const budget_repository_1 = __webpack_require__(42);
let BudgetsModule = class BudgetsModule {
};
exports.BudgetsModule = BudgetsModule;
exports.BudgetsModule = BudgetsModule = __decorate([
    (0, common_1.Module)({
        controllers: [budgets_controller_1.BudgetsController],
        providers: [budgets_service_1.BudgetsService, budget_repository_1.BudgetRepository],
        exports: [budgets_service_1.BudgetsService, budget_repository_1.BudgetRepository],
    })
], BudgetsModule);


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BudgetsController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(4);
const budgets_service_1 = __webpack_require__(49);
const jwt_auth_guard_1 = __webpack_require__(51);
const current_user_decorator_1 = __webpack_require__(28);
const dto_1 = __webpack_require__(52);
const budget_response_dto_1 = __webpack_require__(56);
let BudgetsController = class BudgetsController {
    constructor(budgetsService) {
        this.budgetsService = budgetsService;
    }
    async create(userId, createBudgetDto) {
        return this.budgetsService.create(userId, createBudgetDto);
    }
    async findAll(userId, query) {
        return this.budgetsService.findAll(userId, query);
    }
    async getSummary(userId, month) {
        return this.budgetsService.getBudgetSummary(userId, month);
    }
    async findOne(userId, id) {
        return this.budgetsService.findOne(userId, id);
    }
    async update(userId, id, updateBudgetDto) {
        return this.budgetsService.update(userId, id, updateBudgetDto);
    }
    async remove(userId, id) {
        return this.budgetsService.remove(userId, id);
    }
};
exports.BudgetsController = BudgetsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new budget' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, type: budget_response_dto_1.BudgetResponseDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof dto_1.CreateBudgetDto !== "undefined" && dto_1.CreateBudgetDto) === "function" ? _b : Object]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], BudgetsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all budgets for user' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: [budget_response_dto_1.BudgetResponseDto] }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof dto_1.BudgetQueryDto !== "undefined" && dto_1.BudgetQueryDto) === "function" ? _d : Object]),
    __metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], BudgetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, swagger_1.ApiOperation)({ summary: 'Get budget summary with spending analysis' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: budget_response_dto_1.BudgetSummaryDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], BudgetsController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get budget by ID' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: budget_response_dto_1.BudgetResponseDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], BudgetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update budget' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, type: budget_response_dto_1.BudgetResponseDto }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, typeof (_h = typeof dto_1.UpdateBudgetDto !== "undefined" && dto_1.UpdateBudgetDto) === "function" ? _h : Object]),
    __metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], BudgetsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete budget' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_k = typeof Promise !== "undefined" && Promise) === "function" ? _k : Object)
], BudgetsController.prototype, "remove", null);
exports.BudgetsController = BudgetsController = __decorate([
    (0, swagger_1.ApiTags)('Budgets'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('budgets'),
    __metadata("design:paramtypes", [typeof (_a = typeof budgets_service_1.BudgetsService !== "undefined" && budgets_service_1.BudgetsService) === "function" ? _a : Object])
], BudgetsController);


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BudgetsService = void 0;
const common_1 = __webpack_require__(3);
const budget_repository_1 = __webpack_require__(42);
const library_1 = __webpack_require__(50);
let BudgetsService = class BudgetsService {
    constructor(budgetRepository) {
        this.budgetRepository = budgetRepository;
    }
    async create(userId, createBudgetDto) {
        const overlapping = await this.budgetRepository.findOverlapping(userId, createBudgetDto.category, createBudgetDto.startDate, createBudgetDto.endDate);
        if (overlapping.length > 0) {
            throw new common_1.BadRequestException(`Budget for category "${createBudgetDto.category}" already exists for this period`);
        }
        const month = createBudgetDto.startDate.getMonth() + 1;
        const year = createBudgetDto.startDate.getFullYear();
        const budget = await this.budgetRepository.create({
            userId,
            category: createBudgetDto.category,
            amount: createBudgetDto.amount,
            month,
            year,
        });
        return this.mapToResponse(budget);
    }
    async findAll(userId, query) {
        const budgets = await this.budgetRepository.findAll(userId, query);
        return budgets.map((budget) => this.mapToResponse(budget));
    }
    async findOne(userId, id) {
        const budget = await this.budgetRepository.findById(id, userId);
        if (!budget) {
            throw new common_1.NotFoundException(`Budget with ID ${id} not found`);
        }
        return this.mapToResponse(budget);
    }
    async update(userId, id, updateBudgetDto) {
        const existing = await this.budgetRepository.findById(id, userId);
        if (!existing) {
            throw new common_1.NotFoundException(`Budget with ID ${id} not found`);
        }
        const updated = await this.budgetRepository.update(id, updateBudgetDto);
        return this.mapToResponse(updated);
    }
    async remove(userId, id) {
        const budget = await this.budgetRepository.findById(id, userId);
        if (!budget) {
            throw new common_1.NotFoundException(`Budget with ID ${id} not found`);
        }
        await this.budgetRepository.delete(id);
    }
    async getBudgetSummary(userId, month) {
        const currentDate = month ? new Date(month) : new Date();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const budgets = await this.budgetRepository.findAll(userId, {
            startDate,
            endDate,
        });
        let totalBudgeted = new library_1.Decimal(0);
        let totalSpent = new library_1.Decimal(0);
        const categoryBreakdown = [];
        for (const budget of budgets) {
            totalBudgeted = totalBudgeted.plus(budget.amount);
            const spent = budget.spent;
            totalSpent = totalSpent.plus(spent);
            const percentUsed = budget.amount.isZero()
                ? 0
                : spent.dividedBy(budget.amount).times(100).toNumber();
            categoryBreakdown.push({
                category: budget.category,
                budgeted: budget.amount.toNumber(),
                spent: spent.toNumber(),
                remaining: budget.amount.minus(spent).toNumber(),
                percentUsed,
                isOverBudget: spent.greaterThan(budget.amount),
            });
        }
        return {
            totalBudgeted: totalBudgeted.toNumber(),
            totalSpent: totalSpent.toNumber(),
            totalRemaining: totalBudgeted.minus(totalSpent).toNumber(),
            overallPercentUsed: totalBudgeted.isZero()
                ? 0
                : totalSpent.dividedBy(totalBudgeted).times(100).toNumber(),
            categoryBreakdown,
            period: {
                start: startDate,
                end: endDate,
            },
        };
    }
    mapToResponse(budget) {
        const spent = budget.spent;
        const percentUsed = budget.amount.isZero()
            ? 0
            : spent.dividedBy(budget.amount).times(100).toNumber();
        const startDate = new Date(budget.year, budget.month - 1, 1);
        const endDate = new Date(budget.year, budget.month, 0);
        return {
            id: budget.id,
            userId: budget.userId,
            category: budget.category,
            amount: budget.amount.toNumber(),
            spent: spent.toNumber(),
            remaining: budget.amount.minus(spent).toNumber(),
            percentUsed,
            startDate,
            endDate,
            rollover: budget.rollover,
            alertThreshold: budget.alertThreshold?.toNumber(),
            isOverBudget: spent.greaterThan(budget.amount),
            createdAt: budget.createdAt,
            updatedAt: budget.updatedAt,
        };
    }
};
exports.BudgetsService = BudgetsService;
exports.BudgetsService = BudgetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof budget_repository_1.BudgetRepository !== "undefined" && budget_repository_1.BudgetRepository) === "function" ? _a : Object])
], BudgetsService);


/***/ }),
/* 50 */
/***/ ((module) => {

module.exports = require("@prisma/client/runtime/library");

/***/ }),
/* 51 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const common_1 = __webpack_require__(3);
const passport_1 = __webpack_require__(19);
const core_1 = __webpack_require__(1);
const public_decorator_1 = __webpack_require__(27);
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            throw (err ||
                new common_1.UnauthorizedException(info?.message || 'You are not authorized to access this resource'));
        }
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], JwtAuthGuard);


/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(53), exports);
__exportStar(__webpack_require__(54), exports);
__exportStar(__webpack_require__(55), exports);
__exportStar(__webpack_require__(56), exports);
__exportStar(__webpack_require__(57), exports);
__exportStar(__webpack_require__(58), exports);


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateBudgetDto = void 0;
const swagger_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(25);
const class_transformer_1 = __webpack_require__(44);
class CreateBudgetDto {
}
exports.CreateBudgetDto = CreateBudgetDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Food & Dining' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBudgetDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-01' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], CreateBudgetDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-01-31' }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], CreateBudgetDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateBudgetDto.prototype, "rollover", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 80, required: false, description: 'Alert when spending reaches this percentage' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBudgetDto.prototype, "alertThreshold", void 0);


/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateBudgetDto = void 0;
const swagger_1 = __webpack_require__(4);
const create_budget_dto_1 = __webpack_require__(53);
class UpdateBudgetDto extends (0, swagger_1.PartialType)(create_budget_dto_1.CreateBudgetDto) {
}
exports.UpdateBudgetDto = UpdateBudgetDto;


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BudgetQueryDto = void 0;
const swagger_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(25);
const class_transformer_1 = __webpack_require__(44);
class BudgetQueryDto {
}
exports.BudgetQueryDto = BudgetQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BudgetQueryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], BudgetQueryDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], BudgetQueryDto.prototype, "endDate", void 0);


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BudgetSummaryDto = exports.CategoryBreakdown = exports.BudgetResponseDto = void 0;
const swagger_1 = __webpack_require__(4);
class BudgetResponseDto {
}
exports.BudgetResponseDto = BudgetResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BudgetResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BudgetResponseDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], BudgetResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BudgetResponseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BudgetResponseDto.prototype, "spent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BudgetResponseDto.prototype, "remaining", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BudgetResponseDto.prototype, "percentUsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], BudgetResponseDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], BudgetResponseDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], BudgetResponseDto.prototype, "rollover", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BudgetResponseDto.prototype, "alertThreshold", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], BudgetResponseDto.prototype, "isOverBudget", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], BudgetResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], BudgetResponseDto.prototype, "updatedAt", void 0);
class CategoryBreakdown {
}
exports.CategoryBreakdown = CategoryBreakdown;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CategoryBreakdown.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CategoryBreakdown.prototype, "budgeted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CategoryBreakdown.prototype, "spent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CategoryBreakdown.prototype, "remaining", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CategoryBreakdown.prototype, "percentUsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CategoryBreakdown.prototype, "isOverBudget", void 0);
class BudgetSummaryDto {
}
exports.BudgetSummaryDto = BudgetSummaryDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BudgetSummaryDto.prototype, "totalBudgeted", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BudgetSummaryDto.prototype, "totalSpent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BudgetSummaryDto.prototype, "totalRemaining", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], BudgetSummaryDto.prototype, "overallPercentUsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CategoryBreakdown] }),
    __metadata("design:type", Array)
], BudgetSummaryDto.prototype, "categoryBreakdown", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Object)
], BudgetSummaryDto.prototype, "period", void 0);


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OptimizeBudgetDto = void 0;
const swagger_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(25);
class OptimizeBudgetDto {
}
exports.OptimizeBudgetDto = OptimizeBudgetDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3000, description: 'Total monthly income' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], OptimizeBudgetDto.prototype, "totalIncome", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, required: false, description: 'Number of months to analyze' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], OptimizeBudgetDto.prototype, "analysisMonths", void 0);


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateSharedBudgetDto = void 0;
const swagger_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(25);
const create_budget_dto_1 = __webpack_require__(53);
class CreateSharedBudgetDto extends create_budget_dto_1.CreateBudgetDto {
}
exports.CreateSharedBudgetDto = CreateSharedBudgetDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['user1@example.com', 'user2@example.com'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEmail)({}, { each: true }),
    __metadata("design:type", Array)
], CreateSharedBudgetDto.prototype, "sharedWith", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Family Groceries' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSharedBudgetDto.prototype, "name", void 0);


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RecurringModule = void 0;
const common_1 = __webpack_require__(3);
let RecurringModule = class RecurringModule {
};
exports.RecurringModule = RecurringModule;
exports.RecurringModule = RecurringModule = __decorate([
    (0, common_1.Module)({
        controllers: [],
        providers: [],
        exports: [],
    })
], RecurringModule);


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GoalsModule = void 0;
const common_1 = __webpack_require__(3);
let GoalsModule = class GoalsModule {
};
exports.GoalsModule = GoalsModule;
exports.GoalsModule = GoalsModule = __decorate([
    (0, common_1.Module)({
        controllers: [],
        providers: [],
        exports: [],
    })
], GoalsModule);


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsModule = void 0;
const common_1 = __webpack_require__(3);
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Module)({
        controllers: [],
        providers: [],
        exports: [],
    })
], AnalyticsModule);


/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsModule = void 0;
const common_1 = __webpack_require__(3);
const notifications_controller_1 = __webpack_require__(63);
const notifications_service_1 = __webpack_require__(64);
const notification_repository_1 = __webpack_require__(65);
const email_service_1 = __webpack_require__(66);
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        controllers: [notifications_controller_1.NotificationsController],
        providers: [notifications_service_1.NotificationsService, notification_repository_1.NotificationRepository, email_service_1.EmailService],
        exports: [notifications_service_1.NotificationsService],
    })
], NotificationsModule);


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsController = void 0;
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(4);
const notifications_service_1 = __webpack_require__(64);
const jwt_auth_guard_1 = __webpack_require__(51);
const current_user_decorator_1 = __webpack_require__(28);
const dto_1 = __webpack_require__(68);
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async findAll(userId, query) {
        return this.notificationsService.findAll(userId, query);
    }
    async getUnreadCount(userId) {
        return this.notificationsService.getUnreadCount(userId);
    }
    async markAsRead(userId, id) {
        return this.notificationsService.markAsRead(userId, id);
    }
    async markAllAsRead(userId) {
        return this.notificationsService.markAllAsRead(userId);
    }
    async remove(userId, id) {
        return this.notificationsService.remove(userId, id);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all notifications for user' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof dto_1.NotificationQueryDto !== "undefined" && dto_1.NotificationQueryDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unread notification count' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Put)(':id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark notification as read' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Put)('mark-all-read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete notification' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NO_CONTENT }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], NotificationsController.prototype, "remove", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [typeof (_a = typeof notifications_service_1.NotificationsService !== "undefined" && notifications_service_1.NotificationsService) === "function" ? _a : Object])
], NotificationsController);


/***/ }),
/* 64 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationsService = void 0;
const common_1 = __webpack_require__(3);
const notification_repository_1 = __webpack_require__(65);
const email_service_1 = __webpack_require__(66);
const client_1 = __webpack_require__(15);
const prisma_service_1 = __webpack_require__(14);
let NotificationsService = class NotificationsService {
    constructor(notificationRepository, emailService, prisma) {
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
        this.prisma = prisma;
    }
    async create(data) {
        const notification = await this.notificationRepository.create({
            userId: data.userId,
            title: data.title,
            message: data.message,
            type: data.type,
            actionUrl: data.link,
            status: 'UNREAD',
        });
        if (data.sendEmail) {
            const user = await this.prisma.user.findUnique({
                where: { id: data.userId },
                select: { email: true },
            });
            if (user?.email) {
                await this.emailService.sendNotification(user.email, {
                    title: data.title,
                    message: data.message,
                    link: data.link,
                });
            }
        }
        return notification;
    }
    async findAll(userId, query) {
        return this.notificationRepository.findAll(userId, query);
    }
    async getUnreadCount(userId) {
        const count = await this.notificationRepository.countUnread(userId);
        return { count };
    }
    async markAsRead(userId, id) {
        const notification = await this.notificationRepository.findById(id, userId);
        if (!notification) {
            throw new common_1.NotFoundException(`Notification with ID ${id} not found`);
        }
        return this.notificationRepository.update(id, { status: client_1.NotificationStatus.READ });
    }
    async markAllAsRead(userId) {
        await this.notificationRepository.markAllAsRead(userId);
        return { message: 'All notifications marked as read' };
    }
    async remove(userId, id) {
        const notification = await this.notificationRepository.findById(id, userId);
        if (!notification) {
            throw new common_1.NotFoundException(`Notification with ID ${id} not found`);
        }
        await this.notificationRepository.delete(id);
    }
    async sendBudgetAlert(userId, budgetData) {
        await this.create({
            userId,
            title: 'Budget Alert',
            message: `You have used ${budgetData.percentUsed.toFixed(0)}% of your ${budgetData.category} budget`,
            type: 'BUDGET_ALERT',
            sendEmail: false,
        });
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });
        if (user?.email) {
            await this.emailService.sendBudgetAlert(user.email, budgetData);
        }
    }
    async sendGoalMilestone(userId, goalData) {
        await this.create({
            userId,
            title: 'Goal Milestone',
            message: `Congratulations! You've reached ${goalData.progress.toFixed(0)}% of your ${goalData.name} goal`,
            type: 'GOAL_MILESTONE',
            sendEmail: true,
        });
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof notification_repository_1.NotificationRepository !== "undefined" && notification_repository_1.NotificationRepository) === "function" ? _a : Object, typeof (_b = typeof email_service_1.EmailService !== "undefined" && email_service_1.EmailService) === "function" ? _b : Object, typeof (_c = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _c : Object])
], NotificationsService);


/***/ }),
/* 65 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationRepository = void 0;
const common_1 = __webpack_require__(3);
const prisma_service_1 = __webpack_require__(14);
let NotificationRepository = class NotificationRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.notification.create({ data });
    }
    async findById(id, userId) {
        return this.prisma.notification.findFirst({
            where: { id, userId },
        });
    }
    async findAll(userId, query) {
        const where = { userId };
        if (query.read !== undefined) {
            where.status = query.read ? 'READ' : 'UNREAD';
        }
        if (query.type) {
            where.type = query.type;
        }
        return this.prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: query.limit || 50,
            skip: query.offset || 0,
        });
    }
    async countUnread(userId) {
        return this.prisma.notification.count({
            where: { userId, status: 'UNREAD' },
        });
    }
    async update(id, data) {
        return this.prisma.notification.update({
            where: { id },
            data,
        });
    }
    async markAllAsRead(userId) {
        await this.prisma.notification.updateMany({
            where: { userId, status: 'UNREAD' },
            data: { status: 'READ', readAt: new Date() },
        });
    }
    async delete(id) {
        return this.prisma.notification.delete({
            where: { id },
        });
    }
};
exports.NotificationRepository = NotificationRepository;
exports.NotificationRepository = NotificationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof prisma_service_1.PrismaService !== "undefined" && prisma_service_1.PrismaService) === "function" ? _a : Object])
], NotificationRepository);


/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailService = void 0;
const common_1 = __webpack_require__(3);
const config_1 = __webpack_require__(5);
const resend_1 = __webpack_require__(67);
let EmailService = EmailService_1 = class EmailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(EmailService_1.name);
        const apiKey = this.configService.get('RESEND_API_KEY');
        this.fromEmail = this.configService.get('EMAIL_FROM', 'noreply@financeflow.app');
        if (apiKey) {
            this.resend = new resend_1.Resend(apiKey);
            this.logger.log('Resend email service initialized');
        }
        else {
            this.logger.warn('RESEND_API_KEY not configured - email notifications will be logged only');
        }
    }
    async sendNotification(userEmail, data) {
        if (!this.resend) {
            this.logger.log(`[EMAIL NOT SENT - No API Key] To: ${userEmail}, Subject: ${data.title}`);
            return;
        }
        try {
            const { error } = await this.resend.emails.send({
                from: this.fromEmail,
                to: userEmail,
                subject: data.title,
                html: this.generateNotificationTemplate(data),
            });
            if (error) {
                throw new Error(error.message);
            }
            this.logger.log(`Email notification sent successfully to ${userEmail}`);
        }
        catch (error) {
            this.logger.error(`Failed to send email notification to ${userEmail}`, error);
            throw error;
        }
    }
    async sendBudgetAlert(userEmail, budgetData) {
        if (!this.resend) {
            this.logger.log(`[EMAIL NOT SENT - No API Key] Budget alert for ${userEmail}`);
            return;
        }
        try {
            const { error } = await this.resend.emails.send({
                from: this.fromEmail,
                to: userEmail,
                subject: `⚠️ Budget Alert: ${budgetData.category} at ${budgetData.percentUsed.toFixed(0)}%`,
                html: this.generateBudgetAlertTemplate(budgetData),
            });
            if (error) {
                throw new Error(error.message);
            }
            this.logger.log(`Budget alert sent to ${userEmail}`);
        }
        catch (error) {
            this.logger.error(`Failed to send budget alert to ${userEmail}`, error);
            throw error;
        }
    }
    async sendWeeklyReport(userEmail, reportData) {
        if (!this.resend) {
            this.logger.log(`[EMAIL NOT SENT - No API Key] Weekly report for ${userEmail}`);
            return;
        }
        try {
            const { error } = await this.resend.emails.send({
                from: this.fromEmail,
                to: userEmail,
                subject: '📊 Your Weekly Financial Report',
                html: this.generateWeeklyReportTemplate(reportData),
            });
            if (error) {
                throw new Error(error.message);
            }
            this.logger.log(`Weekly report sent to ${userEmail}`);
        }
        catch (error) {
            this.logger.error(`Failed to send weekly report to ${userEmail}`, error);
            throw error;
        }
    }
    generateNotificationTemplate(data) {
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
            .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">💼 FinanceFlow</h1>
            </div>
            <div class="content">
              <h2>${data.title}</h2>
              <p>${data.message}</p>
              ${data.link ? `<a href="${data.link}" class="button">View Details</a>` : ''}
            </div>
            <div class="footer">
              <p>You're receiving this email because you have notifications enabled in FinanceFlow.</p>
              <p>© ${new Date().getFullYear()} FinanceFlow. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    }
    generateBudgetAlertTemplate(data) {
        const isOverBudget = data.spent > data.budgeted;
        const remaining = data.budgeted - data.spent;
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${isOverBudget ? '#ef4444' : '#f59e0b'}; color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
            .stats { background: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .stat-row { display: flex; justify-content: space-between; margin: 10px 0; }
            .progress-bar { background: #e5e7eb; height: 20px; border-radius: 10px; overflow: hidden; margin: 20px 0; }
            .progress-fill { background: ${isOverBudget ? '#ef4444' : '#f59e0b'}; height: 100%; width: ${Math.min(data.percentUsed, 100)}%; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">⚠️ Budget Alert</h1>
            </div>
            <div class="content">
              <h2>${isOverBudget ? 'You\'ve exceeded your budget!' : 'Budget threshold reached'}</h2>
              <p>Your <strong>${data.category}</strong> spending has reached <strong>${data.percentUsed.toFixed(1)}%</strong> of your budget.</p>
              
              <div class="stats">
                <div class="stat-row">
                  <span>Budgeted:</span>
                  <strong>$${data.budgeted.toFixed(2)}</strong>
                </div>
                <div class="stat-row">
                  <span>Spent:</span>
                  <strong style="color: ${isOverBudget ? '#ef4444' : '#f59e0b'};">$${data.spent.toFixed(2)}</strong>
                </div>
                <div class="stat-row">
                  <span>${isOverBudget ? 'Over budget by:' : 'Remaining:'}:</span>
                  <strong style="color: ${isOverBudget ? '#ef4444' : '#10b981'};">$${Math.abs(remaining).toFixed(2)}</strong>
                </div>
              </div>
              
              <div class="progress-bar">
                <div class="progress-fill"></div>
              </div>
              
              <p>${isOverBudget
            ? 'Consider reviewing your spending in this category to get back on track.'
            : 'Keep an eye on your spending to stay within budget.'}
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} FinanceFlow. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    }
    generateWeeklyReportTemplate(data) {
        const savingsRate = data.totalIncome > 0
            ? ((data.netSavings / data.totalIncome) * 100).toFixed(1)
            : '0';
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
            .summary-cards { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 20px 0; }
            .card { background: #f9fafb; padding: 20px; border-radius: 6px; text-align: center; }
            .card-value { font-size: 24px; font-weight: bold; margin: 10px 0; }
            .card-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
            .breakdown { margin: 30px 0; }
            .breakdown-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📊 Your Weekly Financial Report</h1>
            </div>
            <div class="content">
              <p>Here's your financial summary for the week:</p>
              
              <div class="summary-cards">
                <div class="card">
                  <div class="card-label">Income</div>
                  <div class="card-value" style="color: #10b981;">$${data.totalIncome.toFixed(2)}</div>
                </div>
                <div class="card">
                  <div class="card-label">Expenses</div>
                  <div class="card-value" style="color: #ef4444;">$${data.totalExpense.toFixed(2)}</div>
                </div>
                <div class="card">
                  <div class="card-label">Net Savings</div>
                  <div class="card-value" style="color: ${data.netSavings >= 0 ? '#10b981' : '#ef4444'};">
                    $${data.netSavings.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <p><strong>Savings Rate:</strong> ${savingsRate}%</p>
              
              <div class="breakdown">
                <h3>Top Spending Categories</h3>
                ${data.categoryBreakdown.map(cat => `
                  <div class="breakdown-item">
                    <span>${cat.category}</span>
                    <strong>$${cat.total.toFixed(2)}</strong>
                  </div>
                `).join('')}
              </div>
              
              <p style="margin-top: 30px; padding: 15px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
                💡 <strong>Tip:</strong> ${data.netSavings >= 0
            ? 'Great job staying on track this week! Keep up the good work.'
            : 'Consider reviewing your spending to identify areas where you can cut back.'}
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} FinanceFlow. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], EmailService);


/***/ }),
/* 67 */
/***/ ((module) => {

module.exports = require("resend");

/***/ }),
/* 68 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(69), exports);


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotificationQueryDto = void 0;
const swagger_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(25);
const class_transformer_1 = __webpack_require__(44);
const client_1 = __webpack_require__(15);
class NotificationQueryDto {
}
exports.NotificationQueryDto = NotificationQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true'),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], NotificationQueryDto.prototype, "read", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: client_1.NotificationType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.NotificationType),
    __metadata("design:type", typeof (_a = typeof client_1.NotificationType !== "undefined" && client_1.NotificationType) === "function" ? _a : Object)
], NotificationQueryDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], NotificationQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], NotificationQueryDto.prototype, "offset", void 0);


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminModule = void 0;
const common_1 = __webpack_require__(3);
const admin_controller_1 = __webpack_require__(71);
const jwt_1 = __webpack_require__(17);
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'your-secret-key',
                signOptions: { expiresIn: '24h' },
            }),
        ],
        controllers: [admin_controller_1.AdminController],
    })
], AdminModule);


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AdminController = void 0;
const common_1 = __webpack_require__(3);
const analytics_service_1 = __webpack_require__(23);
const jwt_1 = __webpack_require__(17);
const public_decorator_1 = __webpack_require__(27);
let AdminController = class AdminController {
    constructor(analyticsService, jwtService) {
        this.analyticsService = analyticsService;
        this.jwtService = jwtService;
    }
    async login(body) {
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword) {
            throw new common_1.UnauthorizedException('Admin system not configured');
        }
        if (body.password !== adminPassword) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        const token = this.jwtService.sign({ admin: true }, { expiresIn: '24h' });
        return {
            success: true,
            token,
            expiresIn: '24h',
        };
    }
    async getAnalytics(req) {
        const token = req.cookies?.['admin_token'];
        if (!token) {
            throw new common_1.UnauthorizedException('Not authenticated');
        }
        try {
            this.jwtService.verify(token);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        const analytics = await this.analyticsService.getDemoAnalytics();
        return analytics;
    }
    async logout() {
        return { success: true, message: 'Logged out successfully' };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('analytics'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAnalytics", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('logout'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "logout", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [typeof (_a = typeof analytics_service_1.AnalyticsService !== "undefined" && analytics_service_1.AnalyticsService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AdminController);


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AnalyticsModule = void 0;
const common_1 = __webpack_require__(3);
const analytics_service_1 = __webpack_require__(23);
let AnalyticsModule = class AnalyticsModule {
};
exports.AnalyticsModule = AnalyticsModule;
exports.AnalyticsModule = AnalyticsModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [analytics_service_1.AnalyticsService],
        exports: [analytics_service_1.AnalyticsService],
    })
], AnalyticsModule);


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpExceptionFilter = void 0;
const common_1 = __webpack_require__(3);
const library_1 = __webpack_require__(50);
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Internal Server Error';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            }
            else if (typeof exceptionResponse === 'object') {
                const resp = exceptionResponse;
                message = resp.message || message;
                error = resp.error || error;
            }
        }
        else if (exception instanceof library_1.PrismaClientKnownRequestError) {
            status = this.handlePrismaError(exception);
            message = this.getPrismaErrorMessage(exception);
            error = 'Database Error';
        }
        else if (exception instanceof library_1.PrismaClientValidationError) {
            status = common_1.HttpStatus.BAD_REQUEST;
            message = 'Validation error in database query';
            error = 'Validation Error';
        }
        else if (exception instanceof Error) {
            message = exception.message;
            this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack);
        }
        if (status >= 500) {
            this.logger.error(`${request.method} ${request.url} ${status} - ${message}`, exception instanceof Error ? exception.stack : undefined);
        }
        else {
            this.logger.warn(`${request.method} ${request.url} ${status} - ${message}`);
        }
        response.status(status).send({
            statusCode: status,
            error,
            message,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
    handlePrismaError(error) {
        switch (error.code) {
            case 'P2002':
                return common_1.HttpStatus.CONFLICT;
            case 'P2025':
                return common_1.HttpStatus.NOT_FOUND;
            case 'P2003':
                return common_1.HttpStatus.BAD_REQUEST;
            case 'P2014':
                return common_1.HttpStatus.BAD_REQUEST;
            default:
                return common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }
    getPrismaErrorMessage(error) {
        switch (error.code) {
            case 'P2002':
                return 'A record with this value already exists';
            case 'P2025':
                return 'The requested record was not found';
            case 'P2003':
                return 'Invalid reference to related record';
            case 'P2014':
                return 'The change would violate a required relation';
            default:
                return 'A database error occurred';
        }
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);


/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggingInterceptor = void 0;
const common_1 = __webpack_require__(3);
const operators_1 = __webpack_require__(75);
let LoggingInterceptor = class LoggingInterceptor {
    constructor() {
        this.logger = new common_1.Logger('HTTP');
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, ip } = request;
        const userAgent = request.headers['user-agent'] || '';
        const now = Date.now();
        this.logger.log(`→ ${method} ${url} ${ip} ${userAgent}`);
        return next.handle().pipe((0, operators_1.tap)({
            next: () => {
                const response = context.switchToHttp().getResponse();
                const delay = Date.now() - now;
                this.logger.log(`← ${method} ${url} ${response.statusCode} +${delay}ms`);
            },
            error: (error) => {
                const delay = Date.now() - now;
                this.logger.error(`← ${method} ${url} ${error.status || 500} +${delay}ms - ${error.message}`);
            },
        }));
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)()
], LoggingInterceptor);


/***/ }),
/* 75 */
/***/ ((module) => {

module.exports = require("rxjs/operators");

/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimeoutInterceptor = void 0;
const common_1 = __webpack_require__(3);
const rxjs_1 = __webpack_require__(77);
const operators_1 = __webpack_require__(75);
let TimeoutInterceptor = class TimeoutInterceptor {
    constructor() {
        this.TIMEOUT_MS = 30000;
    }
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.timeout)(this.TIMEOUT_MS), (0, operators_1.catchError)((err) => {
            if (err instanceof rxjs_1.TimeoutError) {
                return (0, rxjs_1.throwError)(() => new common_1.RequestTimeoutException('Request timeout - operation took too long'));
            }
            return (0, rxjs_1.throwError)(() => err);
        }));
    }
};
exports.TimeoutInterceptor = TimeoutInterceptor;
exports.TimeoutInterceptor = TimeoutInterceptor = __decorate([
    (0, common_1.Injectable)()
], TimeoutInterceptor);


/***/ }),
/* 77 */
/***/ ((module) => {

module.exports = require("rxjs");

/***/ }),
/* 78 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransformInterceptor = void 0;
const common_1 = __webpack_require__(3);
const operators_1 = __webpack_require__(75);
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        return next.handle().pipe((0, operators_1.map)((data) => ({
            data,
            meta: {
                timestamp: new Date().toISOString(),
                path: request.url,
            },
        })));
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);


/***/ }),
/* 79 */
/***/ ((module) => {

module.exports = require("@fastify/cookie");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(1);
const platform_fastify_1 = __webpack_require__(2);
const common_1 = __webpack_require__(3);
const swagger_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
const helmet_1 = __webpack_require__(6);
const compress_1 = __webpack_require__(7);
const app_module_1 = __webpack_require__(8);
const http_exception_filter_1 = __webpack_require__(73);
const logging_interceptor_1 = __webpack_require__(74);
const timeout_interceptor_1 = __webpack_require__(76);
const transform_interceptor_1 = __webpack_require__(78);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_fastify_1.FastifyAdapter({
        logger: false,
        trustProxy: true,
        bodyLimit: 10485760,
    }));
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: configService.get('CORS_ORIGIN') || 'http://localhost:3000',
        credentials: true,
    });
    await app.register(helmet_1.default, {
        contentSecurityPolicy: false,
    });
    await app.register(compress_1.default, {
        encodings: ['gzip', 'deflate'],
    });
    await app.register(__webpack_require__(79), {
        secret: configService.get('JWT_SECRET'),
    });
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        disableErrorMessages: configService.get('NODE_ENV') === 'production',
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(), new timeout_interceptor_1.TimeoutInterceptor(), new transform_interceptor_1.TransformInterceptor());
    if (configService.get('NODE_ENV') !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Finance Flow API')
            .setDescription('Complete RESTful API for Finance Flow SaaS Platform')
            .setVersion('1.0')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter JWT token',
            in: 'header',
        }, 'JWT-auth')
            .addTag('auth', 'Authentication & Authorization')
            .addTag('users', 'User Management')
            .addTag('transactions', 'Transaction Operations')
            .addTag('budgets', 'Budget Management')
            .addTag('recurring', 'Recurring Transactions')
            .addTag('goals', 'Financial Goals')
            .addTag('investments', 'Investment Tracking')
            .addTag('analytics', 'Dashboard & Analytics')
            .addTag('reports', 'Report Generation')
            .addTag('notifications', 'Notifications')
            .addTag('ai', 'AI-Powered Features')
            .addTag('currency', 'Multi-Currency')
            .addTag('integrations', 'External Integrations')
            .addTag('webhooks', 'Webhook Handlers')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document, {
            customSiteTitle: 'Finance Flow API Docs',
            customCss: '.swagger-ui .topbar { display: none }',
            swaggerOptions: {
                persistAuthorization: true,
                tagsSorter: 'alpha',
                operationsSorter: 'alpha',
            },
        });
    }
    const port = configService.get('PORT') || 3001;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Finance Flow Backend running on: http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
    console.log(`🌍 Environment: ${configService.get('NODE_ENV')}`);
}
bootstrap();

})();

/******/ })()
;