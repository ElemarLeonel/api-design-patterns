import { INotificationProvider } from './INotificationProvider';

export class TwilioProvider implements INotificationProvider {
  public async sendMessage(to: string, content: string): Promise<void> {
    console.log(`[Twilio Provider] Enviando via SMS Gateway para ${to}: ${content}`);
  }
}
