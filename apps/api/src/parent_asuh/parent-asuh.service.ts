// apps/api/src/parent-asuh/parent-asuh.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateParentAsuhDto, UpdateParentAsuhDto } from '../dto/parent-asuh.dto';

@Injectable()
export class ParentAsuhService {
  private readonly tableName = 'parent_asuh';

  constructor(private readonly supabase: SupabaseService) {}

  async findAll(page: number = 1, limit: number = 10) {
    const from = (page - 1) * limit;
    const { data, count, error } = await this.supabase
      .getClient()
      .from(this.tableName)
      .select('*', { count: 'exact' })
      .range(from, from + limit - 1)
      .order('name', { ascending: true });

    if (error) throw new BadRequestException(error.message);
    return { data, total: count };
  }

  async create(dto: CreateParentAsuhDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.tableName)
      .insert(dto)
      .select().single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async update(id: string, dto: UpdateParentAsuhDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.tableName)
      .update(dto)
      .eq('id', id)
      .select().single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.getClient().from(this.tableName).delete().eq('id', id);
    if (error) throw new BadRequestException(error.message);
    return { success: true };
  }
}