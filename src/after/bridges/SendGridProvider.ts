import { INotificationProvider } from './INotificationProvider';

export class SendGridProvider implements INotificationProvider {
  public async sendMessage(to: string, content: string): Promise<void> {
    console.log(`[SendGrid Provider] Enviando via HTTP API para ${to}: ${content}`);
  }
}
