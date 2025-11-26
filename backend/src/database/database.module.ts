import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Database module - provides Prisma service globally
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
