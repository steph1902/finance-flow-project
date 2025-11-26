import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/database/prisma.service';
import { mockPrismaService } from '../../test/helpers/mocks';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to database', async () => {
      await expect(service.$connect()).resolves.not.toThrow();
      expect(mockPrismaService.$connect).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('should disconnect from database', async () => {
      await expect(service.$disconnect()).resolves.not.toThrow();
      expect(mockPrismaService.$disconnect).toHaveBeenCalled();
    });
  });

  describe('$transaction', () => {
    it('should execute transaction callback', async () => {
      const callback = jest.fn().mockResolvedValue('result');
      
      mockPrismaService.$transaction.mockImplementation((cb) => cb(mockPrismaService));

      const result = await service.$transaction(callback);

      expect(callback).toHaveBeenCalled();
    });
  });
});
