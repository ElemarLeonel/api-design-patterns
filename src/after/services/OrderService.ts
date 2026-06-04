import { IOrderRepository } from '../repositories/IOrderRepository';
import { IShippingStrategy } from '../strategies/IShippingStrategy';
import { NormalShipping } from '../strategies/NormalShipping';
import { ExpressShipping } from '../strategies/ExpressShipping';
import { PickupShipping } from '../strategies/PickupShipping';
import { PaymentGatewayFactory } from '../factories/PaymentGatewayFactory';
import { OrderSubject } from '../observers/OrderSubject';
import { EmailNotificationListener } from '../observers/EmailNotificationListener';
import { SmsNotificationListener } from '../observers/SmsNotificationListener';
import { EmailChannel } from '../bridges/EmailChannel';
import { SmsChannel } from '../bridges/SmsChannel';
import { SendGridProvider } from '../bridges/SendGridProvider';
import { TwilioProvider } from '../bridges/TwilioProvider';
import { TrackingAdapter } from '../adapters/TrackingAdapter';
import { ITrackingService } from '../adapters/ITrackingService';
import { OrderItemsCollection } from '../iterators/OrderItemsCollection';
import { OrderBuilder } from '../builders/OrderBuilder';
import { IOrder } from '../decorators/IOrder';

export class OrderService {
  private orderRepository: IOrderRepository;
  private shippingStrategies: Record<string, IShippingStrategy>;
  private orderSubject: OrderSubject;
  private trackingService: ITrackingService;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;

    // Inicializando estratégias de frete (Padrão Strategy)
    this.shippingStrategies = {
      normal: new NormalShipping(),
      express: new ExpressShipping(),
      pickup: new PickupShipping()
    };

    // Inicializando o Adapter (Padrão Adapter)
    this.trackingService = new TrackingAdapter();

    // Configurando a Bridge e Observer (Padrão Bridge + Observer)
    this.orderSubject = new OrderSubject();
    const emailProvider = new SendGridProvider();
    const smsProvider = new TwilioProvider();
    
    this.orderSubject.attach(new EmailNotificationListener(new EmailChannel(emailProvider)));
    this.orderSubject.attach(new SmsNotificationListener(new SmsChannel(smsProvider)));
  }

  public async processOrder(data: {
    customerName: string;
    items: Array<{ productId: number; quantity: number }>;
    shippingType: string;
    paymentMethod: string;
    giftWrap: boolean;
    insurance: boolean;
  }) {
    const { customerName, items, shippingType, paymentMethod, giftWrap, insurance } = data;

    // 1. Carregar produtos do banco e criar Coleção (Padrão Iterator)
    const itemsCollection = new OrderItemsCollection();
    for (const item of items) {
      const product = await this.orderRepository.findProductById(item.productId);
      if (!product) {
        throw new Error(`Produto com ID ${item.productId} não encontrado.`);
      }
      itemsCollection.addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
    }

    // Usando Iterator para percorrer os itens e calcular subtotal
    const iterator = itemsCollection.createIterator();
    let subtotal = 0;
    while (iterator.hasNext()) {
      const detail = iterator.next();
      subtotal += detail.price * detail.quantity;
    }

    // 2. Selecionar estratégia de frete (Padrão Strategy)
    const strategy = this.shippingStrategies[shippingType.toLowerCase()];
    if (!strategy) {
      throw new Error(`Tipo de frete '${shippingType}' não é válido.`);
    }

    // 3. Montar o pedido usando o Builder e Decorators internamente (Padrão Builder + Decorator)
    const orderBuilder = new OrderBuilder();
    const order: IOrder = orderBuilder
      .withSubtotal(subtotal)
      .withShipping(strategy)
      .withGiftWrap(giftWrap)
      .withInsurance(insurance)
      .build();

    const finalTotalPrice = order.calculateTotal();
    const shippingCost = strategy.calculate(subtotal);
    const orderDescription = order.getDescription();
    console.log(`[Service] Pedido Montado via Builder: ${orderDescription}`);

    // 4. Processar Pagamento (Padrão Factory)
    const paymentGateway = PaymentGatewayFactory.createGateway(paymentMethod);
    const paymentResult = await paymentGateway.processPayment(finalTotalPrice);
    const paymentStatus = paymentResult.success ? 'PAID' : 'FAILED';
    const orderStatus = paymentResult.success ? 'paid' : 'pending';

    // 5. Salvar pedido e itens (Repository)
    const orderId = await this.orderRepository.saveOrder({
      customerName, shippingType, shippingCost, paymentMethod, paymentStatus,
      totalPrice: finalTotalPrice, status: orderStatus, giftWrap, insurance
    });

    const iteratorSave = itemsCollection.createIterator();
    while (iteratorSave.hasNext()) {
      const detail = iteratorSave.next();
      await this.orderRepository.saveOrderItem(orderId, {
        productId: detail.productId, quantity: detail.quantity, price: detail.price
      });
    }

    // 6. Integração Rastreio (Padrão Adapter)
    await this.trackingService.dispatchTracking(orderId, customerName);

    // 7. Notificações (Padrão Observer + Bridge)
    this.orderSubject.notify(orderId, orderStatus, customerName, finalTotalPrice)
      .catch(err => console.error('[Observer Error] Falha ao notificar ouvintes:', err));

    return {
      message: 'Pedido criado com sucesso (Com todos os 13 Padrões)!',
      orderId, customerName, description: orderDescription, totalPrice: finalTotalPrice,
      status: orderStatus, shippingCost, paymentMethod, transactionId: paymentResult.transactionId,
      items: itemsCollection.getItemsArray()
    };
  }

  // Padrão Prototype: Metódo para clonar um pedido antigo (Reorder)
  public async reorder(oldOrderId: number): Promise<any> {
    const db = require('../database/DatabaseConnection').DatabaseConnection.getInstance().getDatabase();
    
    // Buscar o pedido original diretamente para demonstração do clone
    const oldOrder = await new Promise<any>((resolve, reject) => {
      db.get('SELECT * FROM orders WHERE id = ?', [oldOrderId], (err: any, row: any) => {
        if (err || !row) return reject(new Error('Pedido não encontrado'));
        resolve(row);
      });
    });

    const oldItems = await new Promise<any[]>((resolve, reject) => {
      db.all('SELECT * FROM order_items WHERE order_id = ?', [oldOrderId], (err: any, rows: any[]) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });

    // Reconstruir objeto order original para poder invocar .clone() (Prototype)
    const strategy = this.shippingStrategies[oldOrder.shipping_type.toLowerCase()];
    const orderObj = new OrderBuilder()
      .withSubtotal(oldOrder.total_price - oldOrder.shipping_cost - (oldOrder.gift_wrap ? 10 : 0) - (oldOrder.insurance ? 25 : 0))
      .withShipping(strategy)
      .withGiftWrap(oldOrder.gift_wrap === 1)
      .withInsurance(oldOrder.insurance === 1)
      .build();

    // Aqui usamos o Padrão Prototype!
    console.log(`[Prototype] Clonando o pedido ID ${oldOrderId}...`);
    const clonedOrder = orderObj.clone();

    // Processar o pagamento para a cópia clonada
    const paymentGateway = PaymentGatewayFactory.createGateway(oldOrder.payment_method);
    const paymentResult = await paymentGateway.processPayment(clonedOrder.calculateTotal());
    const paymentStatus = paymentResult.success ? 'PAID' : 'FAILED';
    
    // Salvar o pedido clonado
    const newOrderId = await this.orderRepository.saveOrder({
      customerName: oldOrder.customer_name + ' (Reorder)',
      shippingType: oldOrder.shipping_type,
      shippingCost: oldOrder.shipping_cost,
      paymentMethod: oldOrder.payment_method,
      paymentStatus,
      totalPrice: clonedOrder.calculateTotal(),
      status: paymentResult.success ? 'paid' : 'pending',
      giftWrap: oldOrder.gift_wrap === 1,
      insurance: oldOrder.insurance === 1
    });

    for (const item of oldItems) {
      await this.orderRepository.saveOrderItem(newOrderId, {
        productId: item.product_id, quantity: item.quantity, price: item.price
      });
    }

    return {
      message: 'Pedido clonado com sucesso via Prototype!',
      newOrderId,
      description: clonedOrder.getDescription(),
      totalPrice: clonedOrder.calculateTotal()
    };
  }
}
