import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

/**
 * Timeout interceptor
 * Enforces a maximum execution time for all requests (30 seconds default)
 */
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private readonly TIMEOUT_MS = 30000; // 30 seconds

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.TIMEOUT_MS),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () => new RequestTimeoutException('Request timeout - operation took too long'),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
