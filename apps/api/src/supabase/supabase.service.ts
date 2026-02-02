// apps/api/src/supabase/supabase.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!url || !key) {
      this.logger.error('Supabase credentials missing in environment variables.');
      throw new Error('Supabase configuration failed');
    }

    this.supabase = createClient(url, key);
  }

  getClient() {
    return this.supabase;
  }
}