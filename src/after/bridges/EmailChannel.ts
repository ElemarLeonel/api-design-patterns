import { NotificationChannel } from './NotificationChannel';

export class EmailChannel extends NotificationChannel {
  public async send(to: string, title: string, body: string): Promise<void> {
    const formattedContent = `Subject: ${title}\nBody: ${body}\n(Assinatura: Sua Loja)`;
    await this.provider.sendMessage(to, formattedContent);
  }
}
