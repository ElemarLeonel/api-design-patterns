import { IOrder } from './IOrder';

export class BaseOrder implements IOrder {
  private subtotal: number;
  private shippingCost: number;

  constructor(subtotal: number, shippingCost: number) {
    this.subtotal = subtotal;
    this.shippingCost = shippingCost;
  }

  public calculateTotal(): number {
    return this.subtotal + this.shippingCost;
  }

  public getDescription(): string {
    return `Pedido Base (Subtotal: R$ ${this.subtotal.toFixed(2)}, Frete: R$ ${this.shippingCost.toFixed(2)})`;
  }

  // Padrão Prototype: Retorna uma cópia exata de si mesmo
  public clone(): IOrder {
    return new BaseOrder(this.subtotal, this.shippingCost);
  }
}

