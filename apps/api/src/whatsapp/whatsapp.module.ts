// apps/api/src/whatsapp/whatsapp.module.ts
import { Module, Global } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';

@Global() // Make available app-wide without importing in every module
@Module({
  providers: [WhatsAppService],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
