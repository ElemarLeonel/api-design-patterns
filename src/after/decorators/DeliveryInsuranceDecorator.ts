import { OrderDecorator } from './OrderDecorator';
import { IOrder } from './IOrder';

export class DeliveryInsuranceDecorator extends OrderDecorator {
  private insuranceCost = 25.00;

  public calculateTotal(): number {
    return this.order.calculateTotal() + this.insuranceCost;
  }

  public getDescription(): string {
    return `${this.order.getDescription()} + Seguro de Entrega (R$ ${this.insuranceCost.toFixed(2)})`;
  }

  public clone(): IOrder {
    return new DeliveryInsuranceDecorator(this.order.clone());
  }
}
