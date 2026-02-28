// messaging.module.ts
import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { MessagingController } from './messaging.controller';

@Module({
  imports: [SupabaseModule],
  controllers: [MessagingController],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}