import { OrderDecorator } from './OrderDecorator';
import { IOrder } from './IOrder';

export class GiftWrapDecorator extends OrderDecorator {
  private wrapCost = 10.00;

  public calculateTotal(): number {
    return this.order.calculateTotal() + this.wrapCost;
  }

  public getDescription(): string {
    return `${this.order.getDescription()} + Embrulho de Presente (R$ ${this.wrapCost.toFixed(2)})`;
  }

  public clone(): IOrder {
    return new GiftWrapDecorator(this.order.clone());
  }
}

