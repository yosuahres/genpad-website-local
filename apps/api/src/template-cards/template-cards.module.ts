import { Module } from '@nestjs/common';
import { TemplateCardsController } from './template-cards.controller';
import { TemplateCardsService } from './template-cards.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [TemplateCardsController],
  providers: [TemplateCardsService],
})
export class TemplateCardsModule {}