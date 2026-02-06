import { Module } from '@nestjs/common';
import { RegionsController } from './regions.controller';
import { RegionsService } from './regions.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [RegionsController],
  providers: [RegionsService],
  exports: [RegionsService], // Exported in case other modules (like Children) need it
})
export class RegionsModule {}