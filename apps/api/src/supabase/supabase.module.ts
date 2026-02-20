import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Add this import
import { SupabaseService } from './supabase.service';

@Global() 
@Module({
  imports: [ConfigModule], // Add this to provide ConfigService to SupabaseService
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}