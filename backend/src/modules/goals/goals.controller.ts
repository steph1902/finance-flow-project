import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateGoalDto, UpdateGoalDto, ContributeToGoalDto } from './dto';

@ApiTags('Goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new financial goal' })
  @ApiResponse({ status: HttpStatus.CREATED })
  async create(
    @CurrentUser('id') userId: string,
    @Body() createGoalDto: CreateGoalDto,
  ) {
    return this.goalsService.create(userId, createGoalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all goals for user' })
  @ApiResponse({ status: HttpStatus.OK })
  async findAll(@CurrentUser('id') userId: string) {
    return this.goalsService.findAll(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get goal by ID' })
  @ApiResponse({ status: HttpStatus.OK })
  async findOne(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.goalsService.findOne(userId, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update goal' })
  @ApiResponse({ status: HttpStatus.OK })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalsService.update(userId, id, updateGoalDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete goal' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.goalsService.remove(userId, id);
  }

  @Post(':id/contribute')
  @ApiOperation({ summary: 'Add contribution to goal' })
  @ApiResponse({ status: HttpStatus.OK })
  async contribute(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() contributeDto: ContributeToGoalDto,
  ) {
    return this.goalsService.addContribution(userId, id, contributeDto.amount);
  }
}
