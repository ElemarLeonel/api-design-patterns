export interface IOrderObserver {
  update(orderId: number, status: string, customerName: string, totalPrice: number): Promise<void>;
}
