import { ICommand } from './ICommand';
import { OrderService } from '../services/OrderService';

export class PlaceOrderCommand implements ICommand {
  private orderService: OrderService;
  private orderData: any;

  constructor(orderService: OrderService, orderData: any) {
    this.orderService = orderService;
    this.orderData = orderData;
  }

  public async execute(): Promise<any> {
    console.log('[Command] Executando comando de Criação de Pedido...');
    // O comando delega a execução real para o receiver (OrderService)
    return await this.orderService.processOrder(this.orderData);
  }
}
