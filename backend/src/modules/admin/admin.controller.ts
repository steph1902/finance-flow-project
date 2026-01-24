import { Controller, Get, Post, Body, Request, UnauthorizedException } from '@nestjs/common';
import { AnalyticsService } from '@/common/analytics/analytics.service';
import { JwtService } from '@nestjs/jwt';
import { Public } from '@/common/decorators/public.decorator';

@Controller('admin')
export class AdminController {
    constructor(
        private analyticsService: AnalyticsService,
        private jwtService: JwtService,
    ) { }

    @Public()
    @Post('login')
    async login(@Body() body: { password: string }) {
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            throw new UnauthorizedException('Admin system not configured');
        }

        // Simple password check
        if (body.password !== adminPassword) {
            throw new UnauthorizedException('Invalid password');
        }

        // Create JWT token
        const token = this.jwtService.sign(
            { admin: true },
            { expiresIn: '24h' }
        );

        // Return token in response body (frontend will store it)
        return {
            success: true,
            token,
            expiresIn: '24h',
        };
    }

    @Public()
    @Get('analytics')
    async getAnalytics(@Request() req: any) {
        // Check admin token
        const token = req.cookies?.['admin_token'];

        if (!token) {
            throw new UnauthorizedException('Not authenticated');
        }

        try {
            this.jwtService.verify(token);
        } catch {
            throw new UnauthorizedException('Invalid token');
        }

        // Get analytics data
        const analytics = await this.analyticsService.getDemoAnalytics();

        return analytics;
    }

    @Public()
    @Post('logout')
    async logout() {
        // Frontend will clear the token from storage
        return { success: true, message: 'Logged out successfully' };
    }
}
