import { IOrder } from './IOrder';

export abstract class OrderDecorator implements IOrder {
  protected order: IOrder;

  constructor(order: IOrder) {
    this.order = order;
  }

  public calculateTotal(): number {
    return this.order.calculateTotal();
  }

  public getDescription(): string {
    return this.order.getDescription();
  }

  public abstract clone(): IOrder;
}

