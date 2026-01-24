import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

interface AnalyticsEventData {
    userId?: string;
    sessionId: string;
    isDemo?: boolean;
    eventType: string;
    eventName: string;
    metadata?: Record<string, any>;
    page?: string;
    referrer?: string;
    userAgent?: string;
    ipAddress?: string;
}

interface GeolocationData {
    country?: string;
    city?: string;
    region?: string;
    timezone?: string;
}

@Injectable()
export class AnalyticsService {
    private readonly logger = new Logger(AnalyticsService.name);

    constructor(private prisma: PrismaService) { }

    /**
     * Track an analytics event with optional geolocation
     */
    async trackEvent(data: AnalyticsEventData, geo?: GeolocationData): Promise<void> {
        try {
            await this.prisma.analyticsEvent.create({
                data: {
                    ...data,
                    ...geo,
                },
            });
        } catch (error) {
            // Don't fail the main request if analytics fails
            this.logger.error(`Failed to track event: ${error.message}`, error.stack);
        }
    }

    /**
     * Get geolocation data from IP address using ip-api.com (free, no key required)
     */
    async getGeolocation(ipAddress: string): Promise<GeolocationData> {
        try {
            // Skip localhost/private IPs
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
        } catch (error) {
            this.logger.warn(`Failed to get geolocation for ${ipAddress}: ${error.message}`);
            return {};
        }
    }

    /**
     * Get demo account analytics summary
     */
    async getDemoAnalytics(startDate?: Date, endDate?: Date) {
        const where = {
            isDemo: true,
            ...(startDate && endDate ? {
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            } : {}),
        };

        const [
            totalEvents,
            uniqueSessions,
            eventsByType,
            eventsByCountry,
            recentEvents,
            loginEvents,
        ] = await Promise.all([
            // Total events count
            this.prisma.analyticsEvent.count({ where }),

            // Unique sessions
            this.prisma.analyticsEvent.findMany({
                where,
                select: { sessionId: true },
                distinct: ['sessionId'],
            }),

            // Events by type
            this.prisma.analyticsEvent.groupBy({
                by: ['eventType'],
                where,
                _count: true,
                orderBy: { _count: { eventType: 'desc' } },
            }),

            // Events by country
            this.prisma.analyticsEvent.groupBy({
                by: ['country'],
                where: { ...where, country: { not: null } },
                _count: true,
                orderBy: { _count: { country: 'desc' } },
            }),

            // Recent events
            this.prisma.analyticsEvent.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: 50,
            }),

            // Login events for session details
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
            eventsByType: eventsByType.map((e: any) => ({
                type: e.eventType,
                count: e._count,
            })),
            eventsByCountry: eventsByCountry.map((e: any) => ({
                country: e.country,
                count: e._count,
            })),
            recentEvents: recentEvents.map((e: any) => ({
                id: e.id,
                timestamp: e.createdAt,
                eventType: e.eventType,
                eventName: e.eventName,
                page: e.page,
                country: e.country,
                city: e.city,
                metadata: e.metadata,
            })),
            sessions: loginEvents.map((e: any) => ({
                sessionId: e.sessionId,
                timestamp: e.createdAt,
                country: e.country,
                city: e.city,
                userAgent: e.userAgent,
            })),
        };
    }
}
