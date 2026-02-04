// apps/api/src/audit/audit.controller.ts
import { Controller, Get, Delete, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('audit')
@UseGuards(AuthGuard('jwt'))
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  async getLogs() {
    return this.auditService.findAll();
  }

  @Delete('logs')
  async clearLogs() {
    return this.auditService.clearAll();
  }
}