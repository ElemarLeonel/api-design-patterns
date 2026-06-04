import { SQLiteOrderRepository } from '../repositories/SQLiteOrderRepository';
import { OrderService } from '../services/OrderService';
import { PlaceOrderCommand } from '../commands/PlaceOrderCommand';

export class CheckoutFacade {
  private orderService: OrderService;

  constructor() {
    // A Facade assume a responsabilidade de instanciar todas as partes complexas
    // Opcionalmente, poderia usar injeção de dependência.
    const repository = new SQLiteOrderRepository();
    this.orderService = new OrderService(repository);
  }

  public async processCheckout(orderData: any): Promise<any> {
    console.log('[Facade] Iniciando processo de checkout ocultando complexidade...');
    
    // Encapsula em um comando (Padrão Command) e executa
    const command = new PlaceOrderCommand(this.orderService, orderData);
    return await command.execute();
  }

  public async processReorder(oldOrderId: number): Promise<any> {
    console.log('[Facade] Iniciando processo de reorder ocultando complexidade...');
    return await this.orderService.reorder(oldOrderId);
  }
}
