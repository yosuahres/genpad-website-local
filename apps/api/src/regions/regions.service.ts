import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateRegionDto, UpdateRegionDto } from '../dto/region.dto';

@Injectable()
export class RegionsService {
  private readonly tableName = 'regions';

  constructor(private readonly supabase: SupabaseService) {}

  async findAll(page: number = 1, limit: number = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, count, error } = await this.supabase
      .getClient()
      .from(this.tableName)
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('name', { ascending: true });

    if (error) throw new BadRequestException(error.message);
    return { data, total: count };
  }

  async create(dto: CreateRegionDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.tableName)
      .insert(dto)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async update(id: string, dto: UpdateRegionDto) {
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
    const { error } = await this.supabase
      .getClient()
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw new BadRequestException(error.message);
    return { success: true };
  }
}