// apps/api/src/template-cards/template-cards.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class TemplateCardsService {
  private readonly tableName = 'card_templates'; 

  constructor(private readonly supabase: SupabaseService) {}

  // Simplified to fetch the single active config
  async findAll() {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.tableName)
      .select('*')
      .eq('is_active', true)
      .limit(1);

    if (error) throw new BadRequestException(error.message);
    return { data };
  }

  async update(id: string, dto: any) {
    // Ensure the data matches the schema requirements
    const updateData = {
      name: dto.name || 'Global Config',
      template_file: dto.template_file,
      default_message: dto.default_message,
      is_active: true,
      template_type: dto.template_type || 'STUDENT'
    };

    const { data, error } = await this.supabase
      .getClient()
      .from(this.tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update Error:', error);
      throw new BadRequestException(error.message);
    }
    return data;
  }
}