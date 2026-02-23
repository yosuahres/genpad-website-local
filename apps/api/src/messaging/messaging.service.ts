// apps/api/src/messaging/messaging.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessagingService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly configService: ConfigService,
  ) {}

  async sendCardToParent(childId: string) {
    const { data: child, error } = await this.supabase
      .getClient()
      .from('children')
      .select(`
        name,
        child_code,
        parent_asuh:parent_asuh_id (name, phone_number),
        template:template_id (name, template_file, default_message)
      `)
      .eq('id', childId)
      .single();

    if (error || !child) {
      throw new BadRequestException('Child details not found');
    }

    // Safely extract from arrays returned by Supabase joins
    const parent = (Array.isArray(child.parent_asuh) ? child.parent_asuh[0] : child.parent_asuh) as any;
    const template = (Array.isArray(child.template) ? child.template[0] : child.template) as any;

    const targetPhone = parent?.phone_number;
    const parentName = parent?.name;
    const templateFile = template?.template_file;

    if (!targetPhone || !templateFile) {
      throw new BadRequestException('Child is missing an assigned Parent (with phone) or a Template');
    }

    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/templates/${templateFile}`;

    const message = template.default_message || 
      `Halo ${parentName}, berikut adalah kartu laporan untuk ${child.name} (${child.child_code}).`;

    try {
      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': this.configService.get<string>('FONNTE_TOKEN') || '',
        },
        body: new URLSearchParams({
          target: targetPhone,
          message: message,
          url: publicUrl, 
        }),
      });

      const result = await response.json();
      if (!result.status) throw new Error(result.reason || 'Fonnte failure');

      return { success: true, data: result };
    } catch (err: any) {
      throw new BadRequestException(`Messaging Error: ${err.message}`);
    }
  }
}