//messaging.service.ts
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
        parent_asuh:parent_asuh_id (name, phone),
        template:template_cards!id (name, template_file)
      `)
      .eq('id', childId)
      .single();

    if (error || !child) {
      throw new BadRequestException('Child details not found');
    }

    const parent = Array.isArray(child.parent_asuh) ? child.parent_asuh[0] : child.parent_asuh;
    const template = Array.isArray(child.template) ? child.template[0] : child.template;

    const parentPhone = parent?.phone;
    const parentName = parent?.name;
    const templateFile = template?.template_file;

    if (!parentPhone || !parentName || !templateFile) {
      throw new BadRequestException('Incomplete Parent Asuh or Template details');
    }

    // Format: [SUPABASE_URL]/storage/v1/object/public/[BUCKET_NAME]/[FILE_PATH]
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const bucketName = 'templates'; 
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${templateFile}`;

    const message = `Halo ${parentName}, berikut adalah kartu laporan untuk ${child.name} (${child.child_code}).`;

    try {
      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': this.configService.get<string>('FONNTE_TOKEN') || '',
        },
        body: new URLSearchParams({
          target: parentPhone,
          message: message,
          url: publicUrl, 
        }),
      });

      const result = await response.json();

      if (!result.status) {
        throw new Error(result.reason || 'Fonnte failed to send');
      }

      return { success: true, message: 'Card sent successfully', data: result };
    } catch (err: any) {
      throw new BadRequestException(
        `Fonnte Error: ${err.message || 'Unknown error'}`,
      );
    }
  }
}