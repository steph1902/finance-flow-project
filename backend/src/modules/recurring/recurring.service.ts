import { Injectable, NotFoundException } from '@nestjs/common';
import { RecurringRepository } from './repositories/recurring.repository';
import { CreateRecurringDto, UpdateRecurringDto } from './dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class RecurringService {
  constructor(private readonly recurringRepository: RecurringRepository) {}

  async create(userId: string, createRecurringDto: CreateRecurringDto) {
    const nextDate = this.calculateNextDate(
      createRecurringDto.startDate,
      createRecurringDto.frequency,
    );

    return this.recurringRepository.create({
      ...createRecurringDto,
      userId,
      amount: new Decimal(createRecurringDto.amount),
      nextDate,
    });
  }

  async findAll(userId: string) {
    return this.recurringRepository.findAll(userId);
  }

  async findOne(userId: string, id: string) {
    const recurring = await this.recurringRepository.findById(id, userId);
    if (!recurring) {
      throw new NotFoundException(`Recurring transaction with ID ${id} not found`);
    }
    return recurring;
  }

  async update(userId: string, id: string, updateRecurringDto: UpdateRecurringDto) {
    const existing = await this.recurringRepository.findById(id, userId);
    if (!existing) {
      throw new NotFoundException(`Recurring transaction with ID ${id} not found`);
    }

    const updateData: any = { ...updateRecurringDto };
    if (updateRecurringDto.amount !== undefined) {
      updateData.amount = new Decimal(updateRecurringDto.amount);
    }

    return this.recurringRepository.update(id, updateData);
  }

  async remove(userId: string, id: string): Promise<void> {
    const recurring = await this.recurringRepository.findById(id, userId);
    if (!recurring) {
      throw new NotFoundException(`Recurring transaction with ID ${id} not found`);
    }
    await this.recurringRepository.delete(id);
  }

  async skipNext(userId: string, id: string) {
    const recurring = await this.recurringRepository.findById(id, userId);
    if (!recurring) {
      throw new NotFoundException(`Recurring transaction with ID ${id} not found`);
    }

    const nextDate = this.calculateNextDate(recurring.nextDate, recurring.frequency);
    return this.recurringRepository.update(id, { nextDate });
  }

  /**
   * Calculate next occurrence date based on frequency
   */
  private calculateNextDate(currentDate: Date, frequency: string): Date {
    const next = new Date(currentDate);

    switch (frequency) {
      case 'DAILY':
        next.setDate(next.getDate() + 1);
        break;
      case 'WEEKLY':
        next.setDate(next.getDate() + 7);
        break;
      case 'BIWEEKLY':
        next.setDate(next.getDate() + 14);
        break;
      case 'MONTHLY':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'QUARTERLY':
        next.setMonth(next.getMonth() + 3);
        break;
      case 'YEARLY':
        next.setFullYear(next.getFullYear() + 1);
        break;
      default:
        throw new Error(`Unknown frequency: ${frequency}`);
    }

    return next;
  }
}
