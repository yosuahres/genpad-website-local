// apps/api/src/template-cards/template-cards.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateTemplateCardDto, UpdateTemplateCardDto } from '../dto/template-card.dto';

@Injectable()
export class TemplateCardsService {
  private readonly tableName = 'card_templates'; 

  constructor(private readonly supabase: SupabaseService) {}

  async findAll(page: number = 1, limit: number = 10) {
    const from = (page - 1) * limit;
    const { data, count, error } = await this.supabase
      .getClient()
      .from(this.tableName)
      .select('*', { count: 'exact' })
      .range(from, from + limit - 1);

    if (error) throw new BadRequestException(error.message);
    return { data, total: count };
  }

  async create(dto: CreateTemplateCardDto) {
    const { data, error } = await this.supabase.getClient().from(this.tableName).insert(dto).select().single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async update(id: string, dto: UpdateTemplateCardDto) {
    const { data, error } = await this.supabase.getClient().from(this.tableName).update(dto).eq('id', id).select().single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase.getClient().from(this.tableName).delete().eq('id', id);
    if (error) throw new BadRequestException(error.message);
    return { success: true };
  }
}