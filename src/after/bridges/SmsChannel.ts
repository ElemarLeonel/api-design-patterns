import { NotificationChannel } from './NotificationChannel';

export class SmsChannel extends NotificationChannel {
  public async send(to: string, title: string, body: string): Promise<void> {
    // Adaptação para API de SMS (ex: Twilio) que pode ter limite de caracteres ou formato específico
    // Aqui simulamos o envio com uma mensagem mais curta
    const shortContent = `${title}: ${body}`.substring(0, 160); 
    await this.provider.sendMessage(to, shortContent);
  }
}
