import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Audit Logging Interceptor
 * Logs critical user actions for audit trail without PII
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
    private readonly logger = new Logger('AuditLog');

    // Actions that should be audited
    private readonly auditableActions = [
        'POST /auth/signup',
        'POST /auth/signin',
        'POST /auth/logout',
        'DELETE /transactions',
        'DELETE /budgets',
        'DELETE /goals',
        'POST /transactions/import',
        'POST /reports/export',
    ];

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, user } = request;
        const actionKey = `${method} ${this.normalizeUrl(url)}`;

        // Only audit specific actions
        if (!this.shouldAudit(actionKey)) {
            return next.handle();
        }

        const userId = user?.sub || user?.id || 'anonymous';
        const startTime = Date.now();

        return next.handle().pipe(
            tap({
                next: () => {
                    const duration = Date.now() - startTime;
                    this.logAuditEvent({
                        action: actionKey,
                        userId,
                        status: 'SUCCESS',
                        duration,
                        timestamp: new Date().toISOString(),
                    });
                },
                error: (error) => {
                    const duration = Date.now() - startTime;
                    this.logAuditEvent({
                        action: actionKey,
                        userId,
                        status: 'FAILED',
                        error: error.message,
                        duration,
                        timestamp: new Date().toISOString(),
                    });
                },
            }),
        );
    }

    private shouldAudit(actionKey: string): boolean {
        return this.auditableActions.some((pattern) => {
            const regex = new RegExp(
                '^' + pattern.replace(/:[^/]+/g, '[^/]+').replace(/\//g, '\\/') + '.*$',
            );
            return regex.test(actionKey);
        });
    }

    private normalizeUrl(url: string): string {
        // Remove query params and normalize IDs to :id
        return url
            .split('?')[0]
            .replace(/\/[a-f0-9-]{36}/gi, '/:id')
            .replace(/\/\d+/g, '/:id');
    }

    private logAuditEvent(event: {
        action: string;
        userId: string;
        status: string;
        error?: string;
        duration: number;
        timestamp: string;
    }): void {
        // Log without PII - only userId (not email)
        this.logger.log(
            JSON.stringify({
                type: 'AUDIT',
                ...event,
            }),
        );
    }
}
