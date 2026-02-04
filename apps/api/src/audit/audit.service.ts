import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuditService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('activity_logs')
      .select(`
        *,
        users ( name, email )
      `) // Assuming a relationship exists to fetch user names
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}