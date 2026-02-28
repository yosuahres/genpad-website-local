// messaging.controller.ts
import { Controller, Post, Get, Body, BadRequestException } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

@Controller('messaging')
export class MessagingController {
  constructor(
    private readonly messagingService: MessagingService,
    private readonly whatsapp: WhatsAppService,
  ) {}

  /**
   * GET /messaging/qr
   * Returns the QR code string to scan with WhatsApp.
   * Also triggers connection if not already connecting.
   */
  @Get('qr')
  async getQR() {
    const status = this.whatsapp.getStatus();

    if (status.connected) {
      return { connected: true, message: 'WhatsApp is already connected.' };
    }

    // Trigger connection if not already connecting
    if (!status.connecting) {
      await this.whatsapp.connect();
      // Wait a moment for QR to generate
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    const qr = this.whatsapp.getQRCode();
    if (qr) {
      return { connected: false, qr };
    }

    return {
      connected: false,
      message: 'QR code is being generated. Please try again in a few seconds.',
    };
  }

  /**
   * GET /messaging/status
   * Returns WhatsApp connection status.
   */
  @Get('status')
  getStatus() {
    return this.whatsapp.getStatus();
  }

  /**
   * POST /messaging/disconnect
   * Disconnects WhatsApp and clears the session.
   */
  @Post('disconnect')
  async disconnect() {
    await this.whatsapp.disconnect();
    return { success: true, message: 'WhatsApp disconnected and session cleared.' };
  }

  @Post('send-card')
  async sendCard(@Body('childId') childId: string) {
    if (!childId) {
      throw new BadRequestException('childId is required');
    }

    return this.messagingService.sendCardToParent(childId);
  }
}