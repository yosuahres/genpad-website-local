// messaging.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { MessagingService } from './messaging.service';

@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post('send-card')
  async sendCard(@Body('childId') childId: string) {
    if (!childId) {
      throw new BadRequestException('childId is required');
    }

    return this.messagingService.sendCardToParent(childId);
  }
}