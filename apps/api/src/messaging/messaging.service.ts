// apps/api/src/messaging/messaging.service.ts
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly whatsapp: WhatsAppService,
  ) {}

  async sendCardToParent(childId: string) {
    // 1. Check WhatsApp connection
    const status = this.whatsapp.getStatus();
    if (!status.connected) {
      throw new BadRequestException(
        'WhatsApp is not connected. Please scan the QR code first via GET /messaging/qr',
      );
    }

    // 2. Fetch child and parent details
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

    // 3. Fetch the active template configuration
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
    if (!config.template_file) throw new BadRequestException('No template image configured');

    // 4. Download image from Supabase Storage
    const { data: fileData, error: fileError } = await this.supabase
      .getAdminClient()
      .storage.from('templates')
      .download(config.template_file);

    if (fileError || !fileData) {
      this.logger.error('Failed to download template image from storage', fileError);
      throw new BadRequestException('Failed to download template image');
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Detect MIME type from file extension
    const ext = config.template_file.split('.').pop()?.toLowerCase() || 'png';
    const mimeMap: Record<string, string> = {
      png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg',
      gif: 'image/gif', webp: 'image/webp',
    };
    const mimeType = mimeMap[ext] || 'image/png';

    this.logger.log(
      `Sending card to ${targetPhone} for child "${(child as any).name}" (${ext}, ${Math.round(imageBuffer.length / 1024)}KB)`,
    );

    // 5. Send via Baileys (WhatsApp Web)
    try {
      const result = await this.whatsapp.sendImage(
        targetPhone,
        imageBuffer,
        config.default_message || '',
        mimeType,
      );

      return { success: true, data: { messageId: result?.key?.id } };
    } catch (err: any) {
      this.logger.error(`WhatsApp send failed: ${err.message}`);
      throw new BadRequestException(`Messaging Error: ${err.message}`);
    }
  }
}