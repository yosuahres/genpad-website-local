import { BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export class BaseSupabaseService {
  constructor(
    protected readonly supabase: SupabaseService,
    protected readonly tableName: string,
  ) {}

  async findAll(page: number = 1, limit: number = 10, selectStr: string = '*') {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await this.supabase
      .getClient()
      .from(this.tableName)
      .select(selectStr, { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw new BadRequestException(error.message);
    return { data, total: count };
  }

  async create(dto: any) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.tableName)
      .insert(dto)
      .select()
      .single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async update(id: string, dto: any) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.tableName)
      .update(dto)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.getClient().from(this.tableName).delete().eq('id', id);
    if (error) throw new BadRequestException(error.message);
    return { success: true };
  }
}