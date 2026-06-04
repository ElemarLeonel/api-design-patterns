import { IOrderObserver } from './IOrderObserver';
import { NotificationChannel } from '../bridges/NotificationChannel';

export class SmsNotificationListener implements IOrderObserver {
  private channel: NotificationChannel;

  constructor(channel: NotificationChannel) {
    this.channel = channel;
  }

  public async update(orderId: number, status: string, customerName: string, totalPrice: number): Promise<void> {
    await this.channel.send(
      customerName, // Na vida real seria o telefone
      `Pedido #${orderId}`,
      `Seu pedido está '${status.toUpperCase()}'. Obrigado pela compra!`
    );
  }
}

