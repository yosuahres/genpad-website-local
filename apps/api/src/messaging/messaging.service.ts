import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class MessagingService {
  constructor(private readonly supabase: SupabaseService) {}

  async sendCardToParent(childId: string) {
    // 1. Fetch Child, Parent Asuh, and Template details
    const { data: child, error } = await this.supabase.getClient()
      .from('children')
      .select(`
        name,
        child_code,
        parent_asuh:parent_asuh_id (name, phone),
        template:template_cards!id (name, template_file)
      `)
      .eq('id', childId)
      .single();

    if (error || !child || !child.parent_asuh || !child.template) {
      throw new BadRequestException('Child, Parent Asuh, or Template details not found');
    }

    const parentPhone = child.parent_asuh[0]?.phone;
    const parentName = child.parent_asuh[0]?.name;
    const templateFile = child.template[0]?.template_file;

    if (!parentPhone || !parentName || !templateFile) {
      throw new BadRequestException('Incomplete Parent Asuh or Template details');
    }

    const message = `Halo ${parentName}, berikut adalah kartu laporan untuk ${child.name} (${child.child_code}).`;

    // 2. Integration with Fonnte API
    try {
      const response = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': process.env.FONNTE_TOKEN || '', 
        },
        body: new URLSearchParams({
          'target': parentPhone,
          'message': message,
          'url': `https://your-storage-url.com/${templateFile}`, // Adjust based on your storage logic
        }),
      });

      const result = await response.json();
      if (!result.status) throw new Error(result.reason);

      return { success: true, message: 'Card sent successfully' };
    } catch (err: any) {
      throw new BadRequestException(`Fonnte Error: ${err.message || 'Unknown error'}`);
    }
  }
}