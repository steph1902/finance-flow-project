import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  QueryTransactionDto,
  RejectAISuggestionDto,
} from './dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

/**
 * Transactions Controller
 * REST API endpoints for transaction management
 */
@ApiTags('transactions')
@ApiBearerAuth('JWT-auth')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  /**
   * Create a new transaction
   */
  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.create(userId, createTransactionDto);
  }

  /**
   * Get all transactions with pagination and filters
   */
  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: ['INCOME', 'EXPENSE'] })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query() query: QueryTransactionDto,
  ) {
    return this.transactionsService.findAll(userId, query);
  }

  /**
   * Scan receipt image using AI
   * IMPORTANT: Must be before :id routes to avoid 405 errors
   */
  @Post('receipt-scan')
  @ApiOperation({
    summary: 'Scan receipt image',
    description: 'Extract transaction data from receipt image using AI OCR',
  })
  @ApiResponse({ status: 200, description: 'Receipt scanned successfully' })
  @ApiResponse({ status: 400, description: 'Invalid image data' })
  @HttpCode(HttpStatus.OK)
  async scanReceipt(
    @CurrentUser('id') userId: string,
    @Body() body: { image: string },
  ) {
    return this.transactionsService.scanReceipt(userId, body.image);
  }

  /**
   * Get transaction by ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction found' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.transactionsService.findOne(userId, id);
  }

  /**
   * Update transaction
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update transaction' })
  @ApiResponse({ status: 200, description: 'Transaction updated successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(userId, id, updateTransactionDto);
  }

  /**
   * Soft delete transaction
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete transaction' })
  @ApiResponse({ status: 204, description: 'Transaction deleted successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.transactionsService.softDelete(userId, id);
  }

  /**
   * Get transaction statistics
   */
  @Get('stats/summary')
  @ApiOperation({ summary: 'Get transaction statistics' })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats(
    @CurrentUser('id') userId: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.transactionsService.getStats(userId, startDate, endDate);
  }

  /**
   * Bulk create transactions
   */
  @Post('bulk')
  @ApiOperation({ summary: 'Bulk create transactions' })
  @ApiResponse({ status: 201, description: 'Transactions created successfully' })
  async bulkCreate(
    @CurrentUser('id') userId: string,
    @Body() transactions: CreateTransactionDto[],
  ) {
    return this.transactionsService.bulkCreate(userId, transactions);
  }

  /**
   * Export transactions to CSV
   */
  @Get('export/csv')
  @ApiOperation({ summary: 'Export transactions to CSV' })
  @ApiResponse({ status: 200, description: 'CSV generated successfully' })
  async exportCsv(
    @CurrentUser('id') userId: string,
    @Query() query: QueryTransactionDto,
  ) {
    return this.transactionsService.exportToCsv(userId, query);
  }

  /**
   * Get AI suggestion for a transaction
   */
  @Get(':id/ai-suggestion')
  @ApiOperation({ summary: 'Get AI categorization suggestion for a transaction' })
  @ApiResponse({ status: 200, description: 'AI suggestion retrieved' })
  @ApiResponse({ status: 404, description: 'Transaction or suggestion not found' })
  async getAISuggestion(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.transactionsService.getAISuggestion(userId, id);
  }

  /**
   * Accept AI categorization suggestion
   */
  @Post(':id/ai-suggestion/accept')
  @ApiOperation({ summary: 'Accept AI categorization suggestion' })
  @ApiResponse({ status: 200, description: 'AI suggestion accepted' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async acceptAISuggestion(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.transactionsService.acceptAISuggestion(userId, id);
  }

  /**
   * Reject AI categorization suggestion and provide feedback
   */
  @Post(':id/reject-ai-suggestion')
  @ApiOperation({
    summary: 'Reject AI categorization suggestion',
    description: 'User rejects the AI suggestion and provides feedback for improvement',
  })
  @ApiResponse({ status: 200, description: 'Feedback recorded successfully' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @HttpCode(HttpStatus.OK)
  async rejectAISuggestion(
    @CurrentUser('id') userId: string,
    @Param('id') transactionId: string,
    @Body() rejectDto: RejectAISuggestionDto,
  ) {
    return this.transactionsService.rejectAISuggestion(
      transactionId,
      userId,
      rejectDto,
    );
  }
}
