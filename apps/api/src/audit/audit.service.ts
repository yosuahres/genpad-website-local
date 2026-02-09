
import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuditService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(days: number = 0) {
    
    const dateLimit = new Date();
    dateLimit.setHours(0, 0, 0, 0);
    dateLimit.setDate(dateLimit.getDate() - days);

    const { data, error } = await this.supabaseService
      .getClient()
      .from('activity_logs')
      .select(`*, users ( name, email )`)
      .gte('created_at', dateLimit.toISOString()) 
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async createLog(log: {
    user_id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    old_value?: any;
    new_value?: any;
  }) {
    const { error } = await this.supabaseService
      .getAdminClient()
      .from('activity_logs')
      .insert([log]);

    if (error) console.error('Audit Log Error:', error.message);
  }

  async clearAll() {
    const { error } = await this.supabaseService
      .getAdminClient()
      .from('activity_logs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); 

    if (error) throw error;
    return { success: true };
  }
}