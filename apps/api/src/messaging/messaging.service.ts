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
    // 1. Fetch child and parent details
    const { data: child, error: childError } = await this.supabase
      .getClient()
      .from('children')
      .select(`
        name,
        parent_asuh:parent_asuh_id (name, phone_number)
      `)
      .eq('id', childId)
      .single();

    if (childError || !child) throw new BadRequestException('Child details not found');

    // 2. Fetch the "One for All" active configuration
    const { data: config, error: configError } = await this.supabase
      .getClient()
      .from('card_templates')
      .select('template_file, default_message')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (configError || !config) throw new BadRequestException('Global messaging config not found');

    const parent = (Array.isArray(child.parent_asuh) ? child.parent_asuh[0] : child.parent_asuh) as any;
    const targetPhone = parent?.phone_number;
    if (!targetPhone) throw new BadRequestException('Parent phone number missing');

    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/templates/${config.template_file}`;

    try {
      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { 'Authorization': this.configService.get<string>('FONNTE_TOKEN') || '' },
        body: new URLSearchParams({
          target: targetPhone,
          message: config.default_message,
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