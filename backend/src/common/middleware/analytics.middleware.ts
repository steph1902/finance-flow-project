import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../analytics/analytics.service';
import { v4 as uuidv4 } from 'uuid';

const DEMO_EMAIL = 'demo@financeflow.com';

@Injectable()
export class AnalyticsMiddleware implements NestMiddleware {
    private readonly logger = new Logger(AnalyticsMiddleware.name);

    constructor(private analyticsService: AnalyticsService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as any).user;
            const isDemo = user?.email === DEMO_EMAIL;

            // Only track demo account activity
            if (!isDemo) {
                return next();
            }

            // Get or create session ID
            let sessionId = req.cookies?.['analytics_session'];
            if (!sessionId) {
                sessionId = uuidv4();
                res.cookie('analytics_session', sessionId, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000, // 24 hours
                });
            }

            // Get IP address (handle proxies)
            const ipAddress =
                (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
                (req.headers['x-real-ip'] as string) ||
                req.socket.remoteAddress;

            // Get geolocation
            const geo = ipAddress ? await this.analyticsService.getGeolocation(ipAddress) : {};

            // Track page view
            await this.analyticsService.trackEvent({
                userId: user?.id,
                sessionId,
                isDemo: true,
                eventType: 'page_view',
                eventName: `Page: ${req.path}`,
                page: req.path,
                referrer: req.headers.referer,
                userAgent: req.headers['user-agent'],
                ipAddress,
            }, geo);

        } catch (error) {
            this.logger.error('Analytics middleware error:', error);
        }

        next();
    }
}
