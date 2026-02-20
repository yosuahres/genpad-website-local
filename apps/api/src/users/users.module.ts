import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [SupabaseModule, AuditModule],
  controllers: [UsersController],
})
export class UsersModule {}