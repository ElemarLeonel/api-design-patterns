import { IOrderObserver } from './IOrderObserver';
import { NotificationChannel } from '../bridges/NotificationChannel';

export class EmailNotificationListener implements IOrderObserver {
  private channel: NotificationChannel;

  constructor(channel: NotificationChannel) {
    this.channel = channel;
  }

  public async update(orderId: number, status: string, customerName: string, totalPrice: number): Promise<void> {
    await this.channel.send(
      customerName,
      `Atualização do Pedido #${orderId}`,
      `Seu pedido foi atualizado para o status '${status.toUpperCase()}'. Total: R$ ${totalPrice.toFixed(2)}.`
    );
  }
}

