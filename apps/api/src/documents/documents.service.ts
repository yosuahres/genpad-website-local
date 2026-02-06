import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseSupabaseService } from '../common/base-supabase.service';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class DocumentsService extends BaseSupabaseService {
  constructor(protected readonly supabase: SupabaseService) {
    super(supabase, 'documents');
  }

  async findAllExtended(page: number = 1, limit: number = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await this.supabase
      .getClient()
      .from(this.tableName)
      .select(`
        *,
        child:children(name, child_code),
        uploader:users(name)
      `, { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw new BadRequestException(error.message);
    return { data, total: count };
  }

  async findOneExtended(id: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.tableName)
      .select(`
        *,
        child:children(name, child_code),
        uploader:users(name)
      `)
      .eq('id', id)
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }
}