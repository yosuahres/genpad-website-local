// apps/api/src/whatsapp/whatsapp.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import * as path from 'path';
import * as fs from 'fs';
import pino from 'pino';

@Injectable()
export class WhatsAppService implements OnModuleInit {
  private readonly logger = new Logger(WhatsAppService.name);
  private sock: WASocket | null = null;
  private qrCode: string | null = null;
  private isConnected = false;
  private isConnecting = false;
  private readonly authDir = path.join(process.cwd(), 'whatsapp-auth');

  async onModuleInit() {
    if (fs.existsSync(this.authDir)) {
      this.logger.log('Existing WhatsApp session found, reconnecting...');
      await this.connect();
    } else {
      this.logger.warn('No WhatsApp session found. Scan QR code via GET /messaging/qr to connect.');
    }
  }

  async connect(): Promise<void> {
    if (this.isConnecting) {
      this.logger.warn('Connection already in progress');
      return;
    }

    this.isConnecting = true;

    try {
      const { state, saveCreds } = await useMultiFileAuthState(this.authDir);
      const { version } = await fetchLatestBaileysVersion();

      const pinoLogger = pino({ level: 'silent' });

      this.sock = makeWASocket({
        version,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, pinoLogger),
        },
        logger: pinoLogger,
        printQRInTerminal: true,
        generateHighQualityLinkPreview: false,
      });

      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.qrCode = qr;
          this.logger.log('New QR code generated. Scan via GET /messaging/qr');
        }

        if (connection === 'close') {
          this.isConnected = false;
          this.isConnecting = false;
          const reason = (lastDisconnect?.error as Boom)?.output?.statusCode;

          if (reason === DisconnectReason.loggedOut) {
            this.logger.warn('WhatsApp logged out. Clearing session...');
            this.clearSession();
          } else {
            this.logger.warn(`WhatsApp disconnected (reason: ${reason}). Reconnecting...`);
            setTimeout(() => this.connect(), 3000);
          }
        }

        if (connection === 'open') {
          this.isConnected = true;
          this.isConnecting = false;
          this.qrCode = null;
          this.logger.log('WhatsApp connected successfully!');
        }
      });

      this.sock.ev.on('creds.update', saveCreds);
    } catch (err: any) {
      this.isConnecting = false;
      this.logger.error(`Failed to connect WhatsApp: ${err.message}`);
    }
  }

  getSocket(): WASocket | null {
    return this.sock;
  }

  getQRCode(): string | null {
    return this.qrCode;
  }

  getStatus(): { connected: boolean; connecting: boolean } {
    return { connected: this.isConnected, connecting: this.isConnecting };
  }

  async sendImage(
    phoneNumber: string,
    imageBuffer: Buffer,
    caption?: string,
    mimeType?: string,
  ): Promise<any> {
    if (!this.sock || !this.isConnected) {
      throw new Error('WhatsApp is not connected. Scan QR code first via GET /messaging/qr');
    }

    const jid = this.formatPhoneToJid(phoneNumber);

    this.logger.log(`Sending image to ${jid} (${Math.round(imageBuffer.length / 1024)}KB)`);

    const result = await this.sock.sendMessage(jid, {
      image: imageBuffer,
      caption: caption || '',
      mimetype: mimeType || 'image/png',
    });

    this.logger.log(`Image sent successfully to ${jid}`);
    return result;
  }

  async sendText(phoneNumber: string, message: string): Promise<any> {
    if (!this.sock || !this.isConnected) {
      throw new Error('WhatsApp is not connected. Scan QR code first via GET /messaging/qr');
    }

    const jid = this.formatPhoneToJid(phoneNumber);
    return this.sock.sendMessage(jid, { text: message });
  }

  private formatPhoneToJid(phone: string): string {
    let cleaned = phone.replace(/[^0-9]/g, '');

    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }

    if (!cleaned.startsWith('62') && cleaned.length <= 12) {
      cleaned = '62' + cleaned;
    }

    return `${cleaned}@s.whatsapp.net`;
  }

  async disconnect(): Promise<void> {
    if (this.sock) {
      await this.sock.logout();
      this.sock = null;
      this.isConnected = false;
      this.qrCode = null;
      this.clearSession();
      this.logger.log('WhatsApp disconnected and session cleared');
    }
  }

  private clearSession(): void {
    if (fs.existsSync(this.authDir)) {
      fs.rmSync(this.authDir, { recursive: true, force: true });
      this.logger.log('WhatsApp auth session cleared');
    }
  }
}
