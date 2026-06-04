import { IOrder } from '../decorators/IOrder';
import { BaseOrder } from '../decorators/BaseOrder';
import { GiftWrapDecorator } from '../decorators/GiftWrapDecorator';
import { DeliveryInsuranceDecorator } from '../decorators/DeliveryInsuranceDecorator';
import { IShippingStrategy } from '../strategies/IShippingStrategy';

export class OrderBuilder {
  private subtotal: number = 0;
  private shippingStrategy: IShippingStrategy | null = null;
  private hasGiftWrap: boolean = false;
  private hasInsurance: boolean = false;

  public withSubtotal(subtotal: number): this {
    this.subtotal = subtotal;
    return this;
  }

  public withShipping(strategy: IShippingStrategy): this {
    this.shippingStrategy = strategy;
    return this;
  }

  public withGiftWrap(hasGiftWrap: boolean): this {
    this.hasGiftWrap = hasGiftWrap;
    return this;
  }

  public withInsurance(hasInsurance: boolean): this {
    this.hasInsurance = hasInsurance;
    return this;
  }

  // Monta o objeto complexo de pedido aplicando decoradores em cascata
  public build(): IOrder {
    if (!this.shippingStrategy) {
      throw new Error('Estratégia de frete é obrigatória para construir o pedido.');
    }

    const shippingCost = this.shippingStrategy.calculate(this.subtotal);
    let order: IOrder = new BaseOrder(this.subtotal, shippingCost);

    if (this.hasGiftWrap) {
      order = new GiftWrapDecorator(order);
    }
    if (this.hasInsurance) {
      order = new DeliveryInsuranceDecorator(order);
    }

    return order;
  }
}
