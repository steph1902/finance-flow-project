import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { NotificationQueryDto } from './dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for user' })
  @ApiResponse({ status: HttpStatus.OK })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query() query: NotificationQueryDto,
  ) {
    return this.notificationsService.findAll(userId, query);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  @ApiResponse({ status: HttpStatus.OK })
  async getUnreadCount(@CurrentUser('id') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: HttpStatus.OK })
  async markAsRead(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.notificationsService.markAsRead(userId, id);
  }

  @Put('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: HttpStatus.OK })
  async markAllAsRead(@CurrentUser('id') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.notificationsService.remove(userId, id);
  }
}
