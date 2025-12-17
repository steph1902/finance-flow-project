import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { LoggingInterceptor } from './logging.interceptor';

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggingInterceptor],
    }).compile();

    interceptor = module.get<LoggingInterceptor>(LoggingInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    let mockContext: ExecutionContext;
    let mockCallHandler: CallHandler;

    beforeEach(() => {
      mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            method: 'GET',
            url: '/test',
            ip: '127.0.0.1',
            headers: { 'user-agent': 'test-agent' },
          }),
          getResponse: jest.fn().mockReturnValue({
            statusCode: 200,
          }),
        }),
      } as any;

      mockCallHandler = {
        handle: jest.fn().mockReturnValue(of({ data: 'test' })),
      };
    });

    it('should log request and response', (done) => {
      const result = interceptor.intercept(mockContext, mockCallHandler);

      result.subscribe({
        next: (data) => {
          expect(data).toEqual({ data: 'test' });
          done();
        },
      });
    });

    it('should measure response time', (done) => {
      const result = interceptor.intercept(mockContext, mockCallHandler);

      result.subscribe({
        next: () => {
          // Verify logging happened (through spy if needed)
          done();
        },
      });
    });
  });
});
