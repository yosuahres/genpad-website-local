import { Module } from '@nestjs/common';
import { ParentAsuhController } from './parent-asuh.controller';
import { ParentAsuhService } from './parent-asuh.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [ParentAsuhController],
  providers: [ParentAsuhService],
})
export class ParentAsuhModule {}