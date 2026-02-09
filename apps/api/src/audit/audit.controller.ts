
import { Controller, Get, Delete, UseGuards, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('audit')
@UseGuards(AuthGuard('jwt'))
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  async getLogs(@Query('days') days?: string) {
    
    const daysNum = days ? parseInt(days, 10) : 0;
    return this.auditService.findAll(daysNum);
  }

  @Delete('logs')
  async clearLogs() {
    return this.auditService.clearAll();
  }
}