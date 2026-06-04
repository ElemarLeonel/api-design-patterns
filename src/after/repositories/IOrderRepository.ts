export interface IOrderRepository {
  findProductById(id: number): Promise<any>;
  saveOrder(order: {
    customerName: string;
    shippingType: string;
    shippingCost: number;
    paymentMethod: string;
    paymentStatus: string;
    totalPrice: number;
    status: string;
    giftWrap: boolean;
    insurance: boolean;
  }): Promise<number>;
  saveOrderItem(orderId: number, item: {
    productId: number;
    quantity: number;
    price: number;
  }): Promise<void>;
}
