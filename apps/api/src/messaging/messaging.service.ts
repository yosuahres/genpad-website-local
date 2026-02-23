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
    console.log(`DEBUG: Fetching details for Child ID: ${childId}`);
    
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
      console.error('DEBUG: Supabase Fetch Error:', error);
      throw new BadRequestException('Child details not found');
    }

    console.log('DEBUG: Fetched Child Record:', JSON.stringify(child, null, 2));

    const parent = (Array.isArray(child.parent_asuh) ? child.parent_asuh[0] : child.parent_asuh) as any;
    const template = (Array.isArray(child.template) ? child.template[0] : child.template) as any;

    const targetPhone = parent?.phone_number;
    console.log(`DEBUG: Target Phone Number extracted: ${targetPhone}`);

    if (!targetPhone) {
      throw new BadRequestException('Child is missing an assigned Parent or phone_number is null');
    }

    // ... rest of the Fonnte fetch logic ...
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/templates/${template?.template_file}`;

    console.log(`DEBUG: Sending via Fonnte to ${targetPhone} with URL: ${publicUrl}`);

    try {
      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': this.configService.get<string>('FONNTE_TOKEN') || '',
        },
        body: new URLSearchParams({
          target: targetPhone,
          message: template?.default_message || 'Kartu Laporan',
          url: publicUrl, 
        }),
      });

      const result = await response.json();
      console.log('DEBUG: Fonnte API Result:', result);
      
      if (!result.status) throw new Error(result.reason || 'Fonnte failure');
      return { success: true, data: result };
    } catch (err: any) {
      console.error('DEBUG: Catch Block Error:', err.message);
      throw new BadRequestException(`Messaging Error: ${err.message}`);
    }
  }
}