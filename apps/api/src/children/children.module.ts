import { Module } from '@nestjs/common';
import { ChildrenController } from './children.controller';
import { ChildrenService } from './children.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [ChildrenController],
  providers: [ChildrenService],
})
export class ChildrenModule {}