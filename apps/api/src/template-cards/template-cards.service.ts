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
    const to = from + limit - 1;

    const { data, error, count } = await this.supabase
      .getClient()
      .from(this.tableName)
      .select('*', { count: 'exact' })
      .order('id', { ascending: false }) // Use 'id' because 'created_at' does not exist
      .range(from, to);

    if (error) throw new BadRequestException(error.message);
    return { data, count, page, limit };
  }

  async create(dto: CreateTemplateCardDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.tableName)
      .insert([{
        name: dto.name,
        template_file: dto.template_file,
        default_message: dto.default_message,
        is_active: dto.is_active ?? true,
        // Match the database enum 'template_type_enum'
        template_type: dto.template_type || 'card_template' 
      }])
      .select()
      .single();

    if (error) {
      throw new BadRequestException(`Database Error: ${error.message}`);
    }
    return data;
  }

  async update(id: string, dto: UpdateTemplateCardDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.tableName)
      .update({
        name: dto.name,
        template_file: dto.template_file,
        default_message: dto.default_message,
        is_active: dto.is_active,
        template_type: dto.template_type
      })
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